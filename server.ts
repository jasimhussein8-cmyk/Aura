import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("edustar.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin', 'teacher', 'student')),
    grade TEXT,
    full_name TEXT,
    google_id TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade TEXT
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    title TEXT,
    content TEXT,
    type TEXT, -- 'video', 'pdf', 'text'
    url TEXT,
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
  );

  CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    title TEXT,
    duration INTEGER, -- in minutes
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER,
    question_text TEXT,
    options TEXT, -- JSON string
    correct_answer TEXT,
    type TEXT, -- 'mcq', 'tf', 'short'
    FOREIGN KEY(exam_id) REFERENCES exams(id)
  );

  CREATE TABLE IF NOT EXISTS exam_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    exam_id INTEGER,
    score INTEGER,
    total INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(exam_id) REFERENCES exams(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS grade_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grade TEXT,
    category TEXT CHECK(category IN ('textbooks', 'videos', 'summaries', 'exams')),
    title TEXT,
    description TEXT,
    url TEXT,
    type TEXT, -- 'file', 'video', 'link'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    icon TEXT,
    criteria_type TEXT, -- 'exam_score', 'lessons_completed', 'points'
    criteria_value INTEGER
  );

  CREATE TABLE IF NOT EXISTS user_badges (
    user_id INTEGER,
    badge_id INTEGER,
    awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, badge_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(badge_id) REFERENCES badges(id)
  );

  CREATE TABLE IF NOT EXISTS user_points (
    user_id INTEGER PRIMARY KEY,
    points INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS lesson_completions (
    user_id INTEGER,
    lesson_id INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, lesson_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    title TEXT,
    description TEXT,
    due_date DATETIME,
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER,
    user_id INTEGER,
    text_entry TEXT,
    file_url TEXT,
    file_name TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    grade INTEGER,
    feedback TEXT,
    FOREIGN KEY(assignment_id) REFERENCES assignments(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content_type TEXT, -- 'lesson', 'exam', 'subject'
    content_id INTEGER,
    title TEXT,
    reason TEXT,
    priority TEXT, -- 'high', 'medium', 'low'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed initial admin if not exists
db.prepare("INSERT OR IGNORE INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)").run(
  "admin",
  "admin123",
  "admin",
  "مدير النظام"
);

// Seed initial student
db.prepare("INSERT OR IGNORE INTO users (username, password, role, grade, full_name) VALUES (?, ?, ?, ?, ?)").run(
  "student",
  "student123",
  "student",
  "السادس الثانوي",
  "أحمد محمد"
);

// Seed initial demo student
db.prepare("INSERT OR IGNORE INTO users (username, password, role, grade, full_name) VALUES (?, ?, ?, ?, ?)").run(
  "student_demo",
  "password123",
  "student",
  "السادس الثانوي",
  "طالب تجريبي"
);

// Seed initial teacher
db.prepare("INSERT OR IGNORE INTO users (username, password, role, grade, full_name) VALUES (?, ?, ?, ?, ?)").run(
  "teacher",
  "teacher123",
  "teacher",
  "السادس الثانوي",
  "الأستاذ علي"
);

// Seed initial subjects
const subjectsCount = db.prepare("SELECT COUNT(*) as count FROM subjects").get() as { count: number };
if (subjectsCount.count === 0) {
  const initialSubjects = [
    { name: "الرياضيات", grade: "السادس الثانوي" },
    { name: "الفيزياء", grade: "السادس الثانوي" },
    { name: "الكيمياء", grade: "السادس الثانوي" },
    { name: "الأحياء", grade: "السادس الثانوي" },
    { name: "اللغة العربية", grade: "السادس الثانوي" },
    { name: "التاريخ", grade: "السادس الثانوي" },
  ];
  const insertSubject = db.prepare("INSERT INTO subjects (name, grade) VALUES (?, ?)");
  initialSubjects.forEach(s => insertSubject.run(s.name, s.grade));
}

// Seed initial badges
const badgesCount = db.prepare("SELECT COUNT(*) as count FROM badges").get() as { count: number };
if (badgesCount.count === 0) {
  const initialBadges = [
    { name: "المجتهد", description: "أكمل 5 دروس", icon: "BookOpen", criteria_type: "lessons_completed", criteria_value: 5 },
    { name: "العلامة الكاملة", description: "حصل على 100% في امتحان", icon: "Award", criteria_type: "exam_score", criteria_value: 100 },
    { name: "نجم ساطع", description: "جمع 500 نقطة", icon: "Star", criteria_type: "points", criteria_value: 500 },
    { name: "المثابر", description: "أكمل 10 دروس", icon: "Zap", criteria_type: "lessons_completed", criteria_value: 10 },
  ];
  const insertBadge = db.prepare("INSERT INTO badges (name, description, icon, criteria_type, criteria_value) VALUES (?, ?, ?, ?, ?)");
  initialBadges.forEach(b => insertBadge.run(b.name, b.description, b.icon, b.criteria_type, b.criteria_value));
}

// Seed initial assignments
const assignmentsCount = db.prepare("SELECT COUNT(*) as count FROM assignments").get() as { count: number };
if (assignmentsCount.count === 0) {
  const mathSubject = db.prepare("SELECT id FROM subjects WHERE name = 'الرياضيات' AND grade = 'السادس الثانوي'").get() as { id: number };
  if (mathSubject) {
    db.prepare("INSERT INTO assignments (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)").run(
      mathSubject.id,
      "واجب التفاضل والتكامل",
      "يرجى حل المسائل الموجودة في صفحة 45 من الكتاب المدرسي ورفع الحل هنا.",
      "2026-03-15"
    );
  }
  const physicsSubject = db.prepare("SELECT id FROM subjects WHERE name = 'الفيزياء' AND grade = 'السادس الثانوي'").get() as { id: number };
  if (physicsSubject) {
    db.prepare("INSERT INTO assignments (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)").run(
      physicsSubject.id,
      "تقرير الميكانيكا",
      "اكتب تقريراً عن قوانين نيوتن للحركة مع أمثلة تطبيقية.",
      "2026-03-20"
    );
  }
}

export async function createServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Configure Multer for file uploads
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const upload = multer({ storage });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  // API Routes
  app.get("/api/auth/google/url", (req, res) => {
    const redirectUri = `${process.env.APP_URL}/auth/callback`;
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    res.json({ url: authUrl });
  });

  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("No code provided");

    try {
      const redirectUri = `${process.env.APP_URL}/auth/callback`;
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenResponse.json();
      if (tokens.error) throw new Error(tokens.error_description);

      const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const googleUser = await userResponse.json();

      // Find or create user
      let user = db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleUser.sub);
      if (!user) {
        // For demo, we auto-register Google users as students
        const result = db.prepare("INSERT INTO users (username, full_name, role, google_id, grade) VALUES (?, ?, ?, ?, ?)").run(
          googleUser.email,
          googleUser.name,
          'student',
          googleUser.sub,
          '6th Secondary' // Default grade for demo
        );
        user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      }

      const userData = JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        grade: user.grade,
        full_name: user.full_name
      });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${userData} }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Google OAuth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.post("/api/auth/login", (req, res) => {
    let { username, password } = req.body;
    username = username?.trim();
    password = password?.trim();
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, grade: user.grade, full_name: user.full_name } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { username, password, role, grade, full_name } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (username, password, role, grade, full_name) VALUES (?, ?, ?, ?, ?)").run(
        username,
        password,
        role || 'student',
        grade,
        full_name
      );
      res.json({ success: true, userId: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.get("/api/subjects/:grade", (req, res) => {
    const subjects = db.prepare("SELECT * FROM subjects WHERE grade = ?").all(req.params.grade);
    res.json(subjects);
  });

  app.get("/api/lessons/:subjectId", (req, res) => {
    const lessons = db.prepare("SELECT * FROM lessons WHERE subject_id = ?").all(req.params.subjectId);
    res.json(lessons);
  });

  app.get("/api/exams/:subjectId", (req, res) => {
    const exams = db.prepare("SELECT * FROM exams WHERE subject_id = ?").all(req.params.subjectId);
    res.json(exams);
  });

  app.get("/api/exam-questions/:examId", (req, res) => {
    const questions = db.prepare("SELECT * FROM questions WHERE exam_id = ?").all(req.params.examId);
    res.json(questions.map((q: any) => ({ ...q, options: JSON.parse(q.options) })));
  });

  app.post("/api/exams/submit", (req, res) => {
    const { userId, examId, score, total } = req.body;
    db.prepare("INSERT INTO exam_results (user_id, exam_id, score, total) VALUES (?, ?, ?, ?)").run(userId, examId, score, total);
    
    // Award points for exam completion (e.g., 50 points base + bonus for score)
    const pointsEarned = 50 + Math.floor((score / total) * 50);
    db.prepare(`
      INSERT INTO user_points (user_id, points) VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET points = points + ?, last_updated = CURRENT_TIMESTAMP
    `).run(userId, pointsEarned, pointsEarned);

    // Check for badges
    const percentage = (score / total) * 100;
    const badges = db.prepare("SELECT * FROM badges WHERE criteria_type = 'exam_score' AND criteria_value <= ?").all(percentage);
    const insertUserBadge = db.prepare("INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)");
    badges.forEach((b: any) => insertUserBadge.run(userId, b.id));

    res.json({ success: true, pointsEarned });
  });

  // Gamification Routes
  app.get("/api/gamification/stats/:userId", (req, res) => {
    const points = db.prepare("SELECT points FROM user_points WHERE user_id = ?").get(req.params.userId) || { points: 0 };
    const badges = db.prepare(`
      SELECT b.*, ub.awarded_at 
      FROM badges b 
      JOIN user_badges ub ON b.id = ub.badge_id 
      WHERE ub.user_id = ?
    `).all(req.params.userId);
    
    const lessonsCompleted = db.prepare("SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?").get(req.params.userId) as { count: number };
    
    res.json({ points: (points as any).points, badges, lessonsCompleted: lessonsCompleted.count });
  });

  app.get("/api/gamification/leaderboard/:grade", (req, res) => {
    const leaderboard = db.prepare(`
      SELECT u.id, u.full_name, up.points, u.grade
      FROM users u
      JOIN user_points up ON u.id = up.user_id
      WHERE u.grade = ?
      ORDER BY up.points DESC
      LIMIT 10
    `).all(req.params.grade);
    res.json(leaderboard);
  });

  app.post("/api/gamification/complete-lesson", (req, res) => {
    const { userId, lessonId } = req.body;
    try {
      db.prepare("INSERT OR IGNORE INTO lesson_completions (user_id, lesson_id) VALUES (?, ?)").run(userId, lessonId);
      
      // Award points for lesson completion (e.g., 20 points)
      const pointsEarned = 20;
      db.prepare(`
        INSERT INTO user_points (user_id, points) VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET points = points + ?, last_updated = CURRENT_TIMESTAMP
      `).run(userId, pointsEarned, pointsEarned);

      // Check for badges based on lessons completed
      const count = db.prepare("SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?").get(userId) as { count: number };
      const badges = db.prepare("SELECT * FROM badges WHERE criteria_type = 'lessons_completed' AND criteria_value <= ?").all(count.count);
      const insertUserBadge = db.prepare("INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)");
      badges.forEach((b: any) => insertUserBadge.run(userId, b.id));

      res.json({ success: true, pointsEarned });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.get("/api/subjects/progress/:userId/:grade", (req, res) => {
    const { userId, grade } = req.params;
    const subjects = db.prepare("SELECT id, name FROM subjects WHERE grade = ?").all(grade);
    
    const progress = subjects.map((s: any) => {
      const totalLessons = db.prepare("SELECT COUNT(*) as count FROM lessons WHERE subject_id = ?").get(s.id) as { count: number };
      const completedLessons = db.prepare(`
        SELECT COUNT(*) as count 
        FROM lesson_completions lc
        JOIN lessons l ON lc.lesson_id = l.id
        WHERE lc.user_id = ? AND l.subject_id = ?
      `).get(userId, s.id) as { count: number };
      
      return {
        subjectId: s.id,
        subjectName: s.name,
        total: totalLessons.count,
        completed: completedLessons.count,
        percentage: totalLessons.count > 0 ? Math.round((completedLessons.count / totalLessons.count) * 100) : 0
      };
    });
    
    res.json(progress);
  });

  app.get("/api/messages/:userId", (req, res) => {
    const messages = db.prepare(`
      SELECT m.*, u.full_name as sender_name 
      FROM messages m 
      JOIN users u ON m.sender_id = u.id 
      WHERE receiver_id = ? OR sender_id = ?
      ORDER BY created_at ASC
    `).all(req.params.userId, req.params.userId);
    res.json(messages);
  });

  app.post("/api/messages", (req, res) => {
    const { senderId, receiverId, content } = req.body;
    db.prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)").run(senderId, receiverId, content);
    res.json({ success: true });
  });

  // Grade Content Routes
  app.get("/api/grade-content/:grade/:category", (req, res) => {
    const content = db.prepare("SELECT * FROM grade_content WHERE grade = ? AND category = ? ORDER BY created_at DESC").all(req.params.grade, req.params.category);
    res.json(content);
  });

  app.post("/api/grade-content", upload.single('file'), (req, res) => {
    const { grade, category, title, description, type } = req.body;
    let { url } = req.body;

    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }

    db.prepare("INSERT INTO grade_content (grade, category, title, description, url, type) VALUES (?, ?, ?, ?, ?, ?)").run(grade, category, title, description, url, type);
    res.json({ success: true });
  });

  app.delete("/api/grade-content/:id", (req, res) => {
    db.prepare("DELETE FROM grade_content WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Admin Routes
  app.get("/api/admin/users", (req, res) => {
    const users = db.prepare("SELECT id, username, role, grade, full_name FROM users").all();
    res.json(users);
  });

  app.put("/api/admin/users/:id", (req, res) => {
    const { username, role, grade, full_name, password } = req.body;
    if (password) {
      db.prepare("UPDATE users SET username = ?, role = ?, grade = ?, full_name = ?, password = ? WHERE id = ?").run(username, role, grade, full_name, password, req.params.id);
    } else {
      db.prepare("UPDATE users SET username = ?, role = ?, grade = ?, full_name = ? WHERE id = ?").run(username, role, grade, full_name, req.params.id);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/subjects", (req, res) => {
    const { name, grade } = req.body;
    db.prepare("INSERT INTO subjects (name, grade) VALUES (?, ?)").run(name, grade);
    res.json({ success: true });
  });

  app.put("/api/admin/subjects/:id", (req, res) => {
    const { name, grade } = req.body;
    db.prepare("UPDATE subjects SET name = ?, grade = ? WHERE id = ?").run(name, grade, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/subjects/:id", (req, res) => {
    db.prepare("DELETE FROM subjects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/lessons", upload.single('file'), (req, res) => {
    const { subjectId, title, content, type } = req.body;
    let { url } = req.body;
    
    // If a file was uploaded, use its path as the URL
    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }
    
    db.prepare("INSERT INTO lessons (subject_id, title, content, type, url) VALUES (?, ?, ?, ?, ?)").run(subjectId, title, content, type, url);
    res.json({ success: true });
  });

  app.put("/api/admin/lessons/:id", (req, res) => {
    const { title, content, type, url } = req.body;
    db.prepare("UPDATE lessons SET title = ?, content = ?, type = ?, url = ? WHERE id = ?").run(title, content, type, url, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/lessons/:id", (req, res) => {
    db.prepare("DELETE FROM lessons WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Assignment & Submission Routes
  app.get("/api/assignments/:grade", (req, res) => {
    const assignments = db.prepare(`
      SELECT a.*, s.name as subject_name 
      FROM assignments a 
      JOIN subjects s ON a.subject_id = s.id 
      WHERE s.grade = ?
    `).all(req.params.grade);
    res.json(assignments);
  });

  app.post("/api/admin/assignments", (req, res) => {
    const { subjectId, title, description, dueDate } = req.body;
    db.prepare("INSERT INTO assignments (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)").run(subjectId, title, description, dueDate);
    res.json({ success: true });
  });

  app.put("/api/admin/assignments/:id", (req, res) => {
    const { title, description, dueDate } = req.body;
    db.prepare("UPDATE assignments SET title = ?, description = ?, due_date = ? WHERE id = ?").run(title, description, dueDate, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/assignments/:id", (req, res) => {
    db.prepare("DELETE FROM assignments WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/submissions", upload.single("file"), (req, res) => {
    const { assignmentId, userId, textEntry } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const fileName = req.file ? req.file.originalname : null;

    try {
      db.prepare(`
        INSERT INTO submissions (assignment_id, user_id, text_entry, file_url, file_name) 
        VALUES (?, ?, ?, ?, ?)
      `).run(assignmentId, userId, textEntry, fileUrl, fileName);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.get("/api/submissions/user/:userId", (req, res) => {
    const submissions = db.prepare(`
      SELECT s.*, a.title as assignment_title 
      FROM submissions s 
      JOIN assignments a ON s.assignment_id = a.id 
      WHERE s.user_id = ?
    `).all(req.params.userId);
    res.json(submissions);
  });

  app.get("/api/submissions/assignment/:assignmentId", (req, res) => {
    const submissions = db.prepare(`
      SELECT s.*, u.full_name as student_name 
      FROM submissions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.assignment_id = ?
    `).all(req.params.assignmentId);
    res.json(submissions);
  });

  app.post("/api/submissions/grade", (req, res) => {
    const { submissionId, grade, feedback } = req.body;
    db.prepare("UPDATE submissions SET grade = ?, feedback = ? WHERE id = ?").run(grade, feedback, submissionId);
    res.json({ success: true });
  });

  // Recommendation Routes
  app.get("/api/recommendations/:userId", (req, res) => {
    const recommendations = db.prepare("SELECT * FROM recommendations WHERE user_id = ? ORDER BY created_at DESC LIMIT 5").all(req.params.userId);
    res.json(recommendations);
  });

  app.post("/api/recommendations/generate", async (req, res) => {
    const { userId } = req.body;
    
    try {
      // 1. Fetch student data
      const examResults = db.prepare(`
        SELECT er.*, e.title as exam_title, s.name as subject_name 
        FROM exam_results er
        JOIN exams e ON er.exam_id = e.id
        JOIN subjects s ON e.subject_id = s.id
        WHERE er.user_id = ?
      `).all(userId);

      const lessonCompletions = db.prepare(`
        SELECT lc.*, l.title as lesson_title, s.name as subject_name
        FROM lesson_completions lc
        JOIN lessons l ON lc.lesson_id = l.id
        JOIN subjects s ON l.subject_id = s.id
        WHERE lc.user_id = ?
      `).all(userId);

      const user = db.prepare("SELECT grade FROM users WHERE id = ?").get(userId) as { grade: string };
      const availableContent = db.prepare(`
        SELECT 'lesson' as type, l.id, l.title, s.name as subject_name
        FROM lessons l
        JOIN subjects s ON l.subject_id = s.id
        WHERE s.grade = ?
        UNION ALL
        SELECT 'exam' as type, e.id, e.title, s.name as subject_name
        FROM exams e
        JOIN subjects s ON e.subject_id = s.id
        WHERE s.grade = ?
      `).all(user.grade, user.grade);

      // 2. Use Gemini to analyze and recommend
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `
        Analyze this student's performance and recommend the next 3 most beneficial learning items (lessons or exams).
        Student Grade: ${user.grade}
        
        Exam Results: ${JSON.stringify(examResults)}
        Lesson Completions: ${JSON.stringify(lessonCompletions)}
        
        Available Content to Recommend: ${JSON.stringify(availableContent)}
        
        Return a JSON array of objects with these properties:
        - content_type: 'lesson' or 'exam'
        - content_id: the ID from the available content
        - title: the title of the content
        - reason: a brief, encouraging explanation in Arabic why this is recommended
        - priority: 'high', 'medium', or 'low'
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const recommendations = JSON.parse(response.text || "[]");

      // 3. Store recommendations
      db.prepare("DELETE FROM recommendations WHERE user_id = ?").run(userId);
      const insertRec = db.prepare(`
        INSERT INTO recommendations (user_id, content_type, content_id, title, reason, priority)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const rec of recommendations) {
        insertRec.run(userId, rec.content_type, rec.content_id, rec.title, rec.reason, rec.priority);
      }

      res.json({ success: true, recommendations });
    } catch (err: any) {
      console.error("Failed to generate recommendations:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  return app;
}

async function startServer() {
  const app = await createServer();
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
