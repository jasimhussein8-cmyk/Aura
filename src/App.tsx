import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  ClipboardList, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  CheckCircle2,
  Send,
  Plus,
  Settings,
  Bell,
  Trophy,
  Zap,
  Award,
  Star,
  TrendingUp,
  Upload,
  Calendar,
  Clock,
  FileUp,
  Sun,
  Moon,
  Link,
  Eye,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Subject, Lesson, Exam, Question, Message, Role, UserStats, LeaderboardEntry, SubjectProgress, Assignment, Submission, Recommendation } from './types';

// --- Components ---

const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dimensions = size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : "w-24 h-24";
  return (
    <div className="flex flex-col items-center">
      <div className={`${dimensions} relative flex items-center justify-center`}>
        <Star className="text-amber-400 w-full h-full" fill="currentColor" />
        <div className="absolute inset-0 flex items-center justify-center p-[20%]">
          <BookOpen className="text-indigo-600 dark:text-indigo-400 w-full h-full transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ user, onLogout }: { user: User; onLogout: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 px-6 flex items-center justify-between transition-colors duration-300">
    <div className="flex items-center gap-2">
      <Logo size="sm" />
      <div className="flex items-center gap-0 font-display font-bold text-xl tracking-tight">
        <span className="text-amber-400">star</span>
        <span className="text-indigo-600 dark:text-indigo-400">Edu</span>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="hidden md:flex flex-col items-start">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.full_name}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role === 'admin' ? 'مسؤول' : user.role === 'teacher' ? 'معلم' : 'طالب'} {user.grade ? `• ${user.grade}` : ''}</span>
      </div>
      <button 
        onClick={() => {
          if (window.confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
            onLogout();
          }
        }}
        className="flex items-center gap-2 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all rounded-lg font-medium"
      >
        <span className="text-sm hidden sm:inline">تسجيل الخروج</span>
        <LogOut size={18} />
      </button>
    </div>
  </nav>
);

const Sidebar = ({ activeTab, setActiveTab, role }: { activeTab: string; setActiveTab: (t: string) => void; role: Role }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['student', 'teacher', 'admin'] },
    { id: 'leaderboard', label: 'المتصدرون', icon: Trophy, roles: ['student', 'teacher', 'admin'] },
    { id: 'grades', label: 'الصفوف الدراسية', icon: GraduationCap, roles: ['student', 'teacher', 'admin'] },
    { id: 'subjects', label: 'موادي الدراسية', icon: BookOpen, roles: ['student'] },
    { id: 'assignments', label: 'الواجبات', icon: FileUp, roles: ['student', 'teacher'] },
    { id: 'exams', label: 'الامتحانات', icon: ClipboardList, roles: ['student'] },
    { id: 'chat', label: 'الرسائل', icon: MessageSquare, roles: ['student', 'teacher'] },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users, roles: ['admin'] },
    { id: 'curriculum', label: 'المناهج الدراسية', icon: Settings, roles: ['admin'] },
  ];

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 hidden lg:block transition-colors duration-300">
      <div className="space-y-1">
        {menuItems.filter(item => item.roles.includes(role)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

const BottomNav = ({ activeTab, setActiveTab, role }: { activeTab: string; setActiveTab: (t: string) => void; role: Role }) => {
  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, roles: ['student', 'teacher', 'admin'] },
    { id: 'subjects', label: 'المواد', icon: BookOpen, roles: ['student'] },
    { id: 'assignments', label: 'الواجبات', icon: FileUp, roles: ['student', 'teacher'] },
    { id: 'exams', label: 'الامتحانات', icon: ClipboardList, roles: ['student'] },
    { id: 'chat', label: 'الرسائل', icon: MessageSquare, roles: ['student', 'teacher'] },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'users', label: 'المستخدمين', icon: Users, roles: ['admin'] },
    { id: 'grades', label: 'الصفوف', icon: GraduationCap, roles: ['admin'] },
    { id: 'curriculum', label: 'المناهج', icon: Settings, roles: ['admin'] },
  ];

  const items = role === 'admin' ? adminItems : menuItems.filter(item => item.roles.includes(role));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around z-50 lg:hidden transition-colors duration-300">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
            activeTab === item.id 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <item.icon size={20} className={activeTab === item.id ? 'scale-110 transition-transform' : ''} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Assignment Components ---

const SubmissionModal = ({ assignment, user, onClose, onSuccess }: { assignment: Assignment, user: User, onClose: () => void, onSuccess: () => void }) => {
  const [textEntry, setTextEntry] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('assignmentId', assignment.id.toString());
    formData.append('userId', user.id.toString());
    formData.append('textEntry', textEntry);
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-colors duration-300"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">تسليم الواجب: {assignment.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">النص (اختياري)</label>
            <textarea 
              value={textEntry}
              onChange={(e) => setTextEntry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[120px] text-right transition-colors duration-300"
              placeholder="اكتب إجابتك أو ملاحظاتك هنا..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">إرفاق ملف</label>
            <div className="relative">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden" 
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {file ? file.name : 'اضغط لرفع ملف أو اسحب وأفلت'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'جاري التسليم...' : 'تسليم الواجب'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AssignmentsView = ({ user }: { user: User }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        fetch(`/api/assignments/${user.grade}`),
        fetch(`/api/submissions/user/${user.id}`)
      ]);
      const [assignmentsData, submissionsData] = await Promise.all([
        assignmentsRes.json(),
        submissionsRes.json()
      ]);
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.grade, user.id]);

  const getSubmission = (assignmentId: number) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">الواجبات المنزلية</h2>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">تابع واجباتك وقم بتسليمها في الوقت المحدد.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.map((assignment) => {
          const submission = getSubmission(assignment.id);
          const isOverdue = new Date(assignment.due_date) < new Date() && !submission;

          return (
            <motion.div 
              key={assignment.id}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{assignment.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.subject_name}</p>
                  </div>
                </div>
                {submission ? (
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={14} /> تم التسليم
                  </span>
                ) : isOverdue ? (
                  <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                    متأخر
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
                    قيد الانتظار
                  </span>
                )}
                {user.role === 'admin' && (
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if(window.confirm('هل تريد حذف هذا الواجب؟')) {
                        await fetch(`/api/admin/assignments/${assignment.id}`, { method: 'DELETE' });
                        fetchData();
                      }
                    }}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1 mr-2"
                  >
                    حذف
                  </button>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                {assignment.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>تاريخ الاستحقاق: {assignment.due_date}</span>
                  </div>
                </div>
                
                {!submission ? (
                  <button 
                    onClick={() => setSelectedAssignment(assignment)}
                    className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <Upload size={16} />
                    رفع الواجب
                  </button>
                ) : (
                  <div className="text-right">
                    {submission.grade !== null && submission.grade !== undefined ? (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500">الدرجة</span>
                        <span className="text-lg font-bold text-indigo-600">{submission.grade} / 100</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">في انتظار التقييم</span>
                    )}
                  </div>
                )}
              </div>
              
              {submission?.feedback && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 mb-1">ملاحظات المعلم:</p>
                  <p className="text-xs text-slate-600">{submission.feedback}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedAssignment && (
        <SubmissionModal 
          assignment={selectedAssignment} 
          user={user} 
          onClose={() => setSelectedAssignment(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

// --- Views ---

const LoginView = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        onLogin(event.data.user);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLogin]);

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (err) {
      console.error('Failed to start Google login:', err);
      setError('فشل الاتصال بـ Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
    });
    const data = await res.json();
    if (data.success) {
      onLogin(data.user);
    } else {
      setError('بيانات الاعتماد غير صالحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8"
      >
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <Logo size="lg" />
          </div>
          <div className="flex items-center justify-center gap-0 font-display font-bold text-4xl mb-2">
            <span className="text-amber-400">star</span>
            <span className="text-indigo-600 dark:text-indigo-400">Edu</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2">مرحباً بك مجدداً! يرجى تسجيل الدخول إلى حسابك.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اسم المستخدم</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-right"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-right"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full btn-primary mt-4">
            تسجيل الدخول
          </button>
          
          <button 
            type="button"
            onClick={async () => {
              const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'student_demo', password: 'password123' })
              });
              if (res.ok) {
                const data = await res.json();
                onLogin(data.user);
              }
            }}
            className="w-full btn-secondary mt-2 border-dashed border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400"
          >
            تجربة التطبيق (حساب طالب)
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ليس لديك حساب؟ <span className="text-indigo-600 dark:text-indigo-400 font-semibold">يرجى مراجعة المسؤول</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const StudentDashboard = ({ user }: { user: User }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<SubjectProgress[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    try {
      const [subjectsRes, statsRes, progressRes, recsRes] = await Promise.all([
        fetch(`/api/subjects/${user.grade}`),
        fetch(`/api/gamification/stats/${user.id}`),
        fetch(`/api/subjects/progress/${user.id}/${user.grade}`),
        fetch(`/api/recommendations/${user.id}`)
      ]);
      
      const [subjectsData, statsData, progressData, recsData] = await Promise.all([
        subjectsRes.json(),
        statsRes.json(),
        progressRes.json(),
        recsRes.json()
      ]);

      setSubjects(subjectsData);
      setStats(statsData);
      setProgress(progressData);
      setRecommendations(recsData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id, user.grade]);

  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error("Failed to generate recommendations", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">مرحباً بك مجدداً، {user.full_name}!</h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">إليك ما يحدث في صفوفك الدراسية ({user.grade}) اليوم.</p>
        </div>
        {stats && (
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">نقاطك الحالية</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">{stats.points} نقطة</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">المواد النشطة</span>
          </div>
          <div className="text-4xl font-bold">{subjects.length}</div>
          <p className="text-sm mt-2 opacity-80">استمر في العمل الرائع!</p>
        </div>
        
        <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">الدروس المكتملة</span>
          </div>
          <div className="text-4xl font-bold">{stats?.lessonsCompleted || 0}</div>
          <p className="text-sm mt-2 opacity-80">أكمل المزيد لربح النقاط</p>
        </div>

        <div className="bg-amber-500 rounded-2xl p-6 text-white shadow-xl shadow-amber-100 dark:shadow-amber-900/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Award size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">الأوسمة</span>
          </div>
          <div className="text-4xl font-bold">{stats?.badges.length || 0}</div>
          <p className="text-sm mt-2 opacity-80">أوسمة الإنجاز الخاصة بك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-sm overflow-hidden relative transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="text-amber-500" size={24} /> مسار التعلم المخصص
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">توصيات ذكية بناءً على أدائك الأكاديمي.</p>
              </div>
              <button 
                onClick={generateRecommendations}
                disabled={generating}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all disabled:opacity-50"
              >
                {generating ? 'جاري التحليل...' : 'تحديث التوصيات'}
              </button>
            </div>

            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-3">
                    <TrendingUp size={32} />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">اضغط على "تحديث التوصيات" للحصول على مسار تعلم مخصص.</p>
                </div>
              ) : (
                recommendations.map((rec) => (
                  <motion.div 
                    key={rec.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                      rec.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 
                      'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {rec.content_type === 'lesson' ? <PlayCircle size={20} /> : <ClipboardList size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{rec.title}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                          rec.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 
                          'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {rec.priority === 'high' ? 'أولوية عالية' : rec.priority === 'medium' ? 'متوسط' : 'عادي'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rec.reason}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">تقدمك في المواد</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {progress.map((item) => (
                <motion.div 
                  key={item.subjectId}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.subjectName}</h4>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    أكملت {item.completed} من أصل {item.total} درساً
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">موادك الدراسية</h3>
              <button className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">عرض الكل</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {subjects.map((subject) => (
                <motion.div 
                  key={subject.id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{subject.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">الصف: {subject.grade}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700" />
                      ))}
                    </div>
                    <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors transform rotate-180" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Award className="text-amber-500" size={20} /> أوسمتك
            </h3>
            {stats?.badges.length === 0 ? (
              <div className="text-center py-8">
                <Award size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">لم تحصل على أوسمة بعد. ابدأ التعلم الآن!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {stats?.badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center text-amber-500 mb-2">
                      {badge.icon === 'Star' ? <Star size={24} fill="currentColor" /> : 
                       badge.icon === 'Award' ? <Award size={24} /> : 
                       badge.icon === 'Zap' ? <Zap size={24} fill="currentColor" /> :
                       <BookOpen size={24} />}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{badge.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{badge.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">تحدي الأسبوع</h3>
              <p className="text-sm opacity-80 mb-4">أكمل 3 امتحانات بتقدير ممتاز لتربح 200 نقطة إضافية!</p>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full w-1/3" />
              </div>
              <p className="text-xs opacity-60">1 من أصل 3 مكتمل</p>
            </div>
            <TrendingUp size={120} className="absolute -bottom-10 -right-10 text-white/10" />
          </section>
        </div>
      </div>
    </div>
  );
};

const LeaderboardView = ({ user }: { user: User }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/gamification/leaderboard/${user.grade}`)
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      });
  }, [user.grade]);

  return (
    <div className="space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-6 shadow-lg shadow-amber-50 dark:shadow-amber-900/20 transition-colors duration-300">
          <Trophy size={32} className="md:w-10 md:h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">لوحة المتصدرين</h2>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-300">تعرف على الطلاب الأكثر تميزاً في {user.grade}. هل يمكنك الوصول إلى القمة؟</p>
      </header>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl transition-colors duration-300">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">الترتيب</span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">الطالب</span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">النقاط</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaderboard.map((entry, index) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all ${entry.id === user.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' :
                    index === 1 ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' :
                    index === 2 ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400' :
                    'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{entry.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{entry.grade}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{entry.points}</span>
                  <Star size={16} className="text-amber-500" fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatView = ({ user }: { user: User }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetch(`/api/messages/${user.id}`)
      .then(res => res.json())
      .then(setMessages);
  }, [user.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: user.id,
        receiverId: 1, // Defaulting to admin/teacher for demo
        content: newMessage
      })
    });

    if (res.ok) {
      setMessages([...messages, { 
        id: Date.now(), 
        sender_id: user.id, 
        receiver_id: 1, 
        content: newMessage, 
        created_at: new Date().toISOString(),
        sender_name: user.full_name
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Users size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">الدعم العام</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">اسأل معلميك أي شيء</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender_id === user.id ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[70%] p-4 rounded-2xl ${
              msg.sender_id === user.id 
                ? 'bg-indigo-600 text-white rounded-tl-none' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-none'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <span className={`text-[10px] mt-1 block opacity-60 ${msg.sender_id === user.id ? 'text-left' : 'text-right'}`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-right transition-colors duration-300"
        />
        <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          <Send size={20} className="transform rotate-180" />
        </button>
      </form>
    </div>
  );
};

const ExamView = ({ user, exam, onComplete, onCancel }: { user: User, exam: Exam, onComplete: (score: number, total: number) => void, onCancel: () => void }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/exam-questions/${exam.id}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      });
  }, [exam.id]);

  const handleSubmit = async () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        score++;
      }
    });

    const res = await fetch('/api/exams/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        examId: exam.id,
        score,
        total: questions.length
      })
    });

    if (res.ok) {
      const data = await res.json();
      setSubmitted(true);
      onComplete(score, questions.length);
    }
  };

  if (loading) return <div className="py-20 text-center">جاري تحميل الأسئلة...</div>;
  if (questions.length === 0) return <div className="py-20 text-center">لا توجد أسئلة لهذا الامتحان.</div>;

  if (submitted) {
    const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct_answer ? 1 : 0), 0);
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">تم إكمال الامتحان بنجاح!</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">لقد حصلت على {score} من أصل {questions.length}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">لقد ربحت {50 + Math.floor((score / questions.length) * 50)} نقطة!</p>
        </div>
        <button onClick={onCancel} className="btn-primary w-full">العودة للمادة</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{exam.title}</h2>
          <p className="text-slate-500 dark:text-slate-400">السؤال {currentQuestionIndex + 1} من {questions.length}</p>
        </div>
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono font-bold text-slate-600 dark:text-slate-400">
          {exam.duration}:00
        </div>
      </header>

      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <motion.div 
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-8">{currentQuestion.question_text}</h3>
        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option })}
              className={`w-full p-4 rounded-2xl border-2 text-right transition-all font-medium ${
                answers[currentQuestion.id] === option 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary disabled:opacity-50"
        >
          السابق
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={!answers[currentQuestion.id]}
            className="btn-primary"
          >
            إنهاء الامتحان
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={!answers[currentQuestion.id]}
            className="btn-primary"
          >
            التالي
          </button>
        )}
      </div>
    </div>
  );
};

const SubjectDetailView = ({ user, subject, onBack }: { user: User, subject: Subject, onBack: () => void }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [lessonsRes, examsRes] = await Promise.all([
        fetch(`/api/lessons/${subject.id}`),
        fetch(`/api/exams/${subject.id}`)
      ]);
      const [lessonsData, examsData] = await Promise.all([
        lessonsRes.json(),
        examsRes.json()
      ]);
      setLessons(lessonsData);
      setExams(examsData);
      setLoading(false);
    };
    fetchData();
  }, [subject.id]);

  const handleCompleteLesson = async (lessonId: number) => {
    const res = await fetch('/api/gamification/complete-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, lessonId })
    });
    if (res.ok) {
      setCompletedLessons([...completedLessons, lessonId]);
      alert('أحسنت! لقد حصلت على 20 نقطة.');
    }
  };

  if (activeExam) {
    return <ExamView user={user} exam={activeExam} onComplete={() => {}} onCancel={() => setActiveExam(null)} />;
  }

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
        <ChevronRight size={20} /> العودة للمواد
      </button>
      
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{subject.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">استكشف الدروس والامتحانات الخاصة بهذه المادة.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PlayCircle className="text-indigo-600 dark:text-indigo-400" /> الدروس التعليمية
          </h3>
          <div className="space-y-3">
            {lessons.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 py-4">لا توجد دروس مضافة بعد.</p>
            ) : (
              lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {lesson.type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{lesson.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{lesson.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(lesson.url, '_blank')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                      <Eye size={16} /> عرض
                    </button>
                    <button 
                      onClick={() => handleCompleteLesson(lesson.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <CheckCircle2 size={16} /> إكمال الدرس
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardList className="text-emerald-600 dark:text-emerald-400" /> الامتحانات التقويمية
          </h3>
          <div className="space-y-3">
            {exams.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 py-4">لا توجد امتحانات مضافة بعد.</p>
            ) : (
              exams.map((exam) => (
                <div key={exam.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{exam.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">المدة: {exam.duration} دقيقة</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveExam(exam)}
                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-sm hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    بدء الامتحان
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const SubjectsView = ({ user }: { user: User }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/subjects/${user.grade}`)
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        setLoading(false);
      });
  }, [user.grade]);

  if (selectedSubject) {
    return <SubjectDetailView user={user} subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">موادي الدراسية</h2>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">اختر مادة للبدء في التعلم وجمع النقاط.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <motion.div 
            key={subject.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedSubject(subject)}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <BookOpen size={32} />
            </div>
            <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100">{subject.name}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">استكشف المنهج والامتحانات</p>
            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">ابدأ الآن</span>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors transform rotate-180" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AdminUsersView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'student' as Role,
    grade: ''
  });

  const fetchUsers = () => {
    fetch('/api/admin/users').then(res => res.json()).then(setUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't show password
      full_name: user.full_name,
      role: user.role,
      grade: user.grade || ''
    });
    setShowAdd(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/auth/register';
    const method = editingUser ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setShowAdd(false);
      setEditingUser(null);
      setFormData({ username: '', password: '', full_name: '', role: 'student', grade: '' });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">إدارة المستخدمين</h2>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: '', password: '', full_name: '', role: 'student', grade: '' });
            setShowAdd(true);
          }}
          className="btn-primary flex items-center gap-2 py-2"
        >
          <Plus size={20} /> إضافة مستخدم
        </button>
      </div>

      {showAdd && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-lg mb-8 transition-colors duration-300"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
              <input 
                type="text" 
                required
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اسم المستخدم</label>
              <input 
                type="text" 
                required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">كلمة المرور {editingUser && '(اتركها فارغة إذا كنت لا تريد التغيير)'}</label>
              <input 
                type="password" 
                required={!editingUser}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الدور</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as Role})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                <option value="student">طالب</option>
                <option value="teacher">معلم</option>
                <option value="admin">مسؤول</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الصف الدراسي</label>
              <input 
                type="text" 
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
              >
                إلغاء
              </button>
              <button 
                type="submit"
                className="btn-primary px-8 py-2"
              >
                {editingUser ? 'حفظ التعديلات' : 'إضافة'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm transition-colors duration-300">
        <table className="w-full text-right min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">الاسم الكامل</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">اسم المستخدم</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">الدور</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">الصف</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{u.full_name}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                    u.role === 'teacher' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 
                    'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {u.role === 'admin' ? 'مسؤول' : u.role === 'teacher' ? 'معلم' : 'طالب'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.grade || '-'}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <button 
                    onClick={() => handleEdit(u)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-sm"
                  >
                    تعديل
                  </button>
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 font-semibold text-sm"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CurriculumManagementView = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', grade: 'السادس الثانوي' });
  const [newLesson, setNewLesson] = useState({ title: '', content: '', type: 'video', url: '', sourceType: 'url' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchSubjects = () => {
    fetch('/api/subjects/السادس الثانوي').then(res => res.json()).then(setSubjects);
  };

  const fetchLessons = (subjectId: number) => {
    fetch(`/api/lessons/${subjectId}`).then(res => res.json()).then(setLessons);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchLessons(selectedSubject.id);
    }
  }, [selectedSubject]);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubject)
    });
    if (res.ok) {
      setShowAddSubject(false);
      setNewSubject({ name: '', grade: 'السادس الثانوي' });
      fetchSubjects();
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    
    const formData = new FormData();
    formData.append('subjectId', selectedSubject.id.toString());
    formData.append('title', newLesson.title);
    formData.append('content', newLesson.content);
    formData.append('type', newLesson.type);
    
    if (newLesson.sourceType === 'file' && selectedFile) {
      formData.append('file', selectedFile);
    } else {
      formData.append('url', newLesson.url);
    }

    const res = await fetch('/api/admin/lessons', {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      setShowAddLesson(false);
      setNewLesson({ title: '', content: '', type: 'video', url: '', sourceType: 'url' });
      setSelectedFile(null);
      fetchLessons(selectedSubject.id);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (window.confirm('هل تريد حذف هذه المادة وكل دروسها؟')) {
      await fetch(`/api/admin/subjects/${id}`, { method: 'DELETE' });
      fetchSubjects();
      if (selectedSubject?.id === id) setSelectedSubject(null);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (window.confirm('هل تريد حذف هذا الدرس؟')) {
      await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
      if (selectedSubject) fetchLessons(selectedSubject.id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subjects Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">المواد الدراسية</h3>
            <button 
              onClick={() => setShowAddSubject(true)}
              className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg"
            >
              <Plus size={20} />
            </button>
          </div>

          {showAddSubject && (
            <form onSubmit={handleAddSubject} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-sm space-y-3 transition-colors duration-300">
              <input 
                type="text" 
                required
                placeholder="اسم المادة"
                value={newSubject.name}
                onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddSubject(false)} className="text-xs text-slate-500 dark:text-slate-400">إلغاء</button>
                <button type="submit" className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg">إضافة</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {subjects.map(s => (
              <div 
                key={s.id}
                onClick={() => setSelectedSubject(s)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  selectedSubject?.id === s.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-800'
                }`}
              >
                <span className={`font-bold transition-colors duration-300 ${selectedSubject?.id === s.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>{s.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteSubject(s.id); }}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons Column */}
        <div className="lg:col-span-2 space-y-4">
          {selectedSubject ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">دروس مادة {selectedSubject.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      setNewLesson({ title: '', content: '', type: 'video', url: '', sourceType: 'url' });
                      setShowAddLesson(true);
                    }}
                    className="flex items-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all"
                  >
                    <PlayCircle size={18} /> إضافة فيديو
                  </button>
                  <button 
                    onClick={() => {
                      setNewLesson({ title: '', content: '', type: 'pdf', url: '', sourceType: 'file' });
                      setShowAddLesson(true);
                    }}
                    className="flex items-center gap-2 py-2 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-sm hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <FileText size={18} /> إضافة ملف
                  </button>
                  <button 
                    onClick={() => {
                      setNewLesson({ title: '', content: '', type: 'text', url: '', sourceType: 'url' });
                      setShowAddLesson(true);
                    }}
                    className="flex items-center gap-2 py-2 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Link size={18} /> إضافة رابط
                  </button>
                </div>
              </div>

              {showAddLesson && (
                <form onSubmit={handleAddLesson} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-lg space-y-4 transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">عنوان الدرس</label>
                      <input 
                        type="text" required
                        value={newLesson.title}
                        onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">النوع</label>
                      <select 
                        value={newLesson.type}
                        onChange={e => setNewLesson({...newLesson, type: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                      >
                        <option value="video">فيديو</option>
                        <option value="pdf">PDF</option>
                        <option value="text">نص</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">مصدر المحتوى</label>
                      <select 
                        value={newLesson.sourceType}
                        onChange={e => setNewLesson({...newLesson, sourceType: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                      >
                        <option value="url">رابط خارجي</option>
                        <option value="file">رفع ملف من الجهاز</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      {newLesson.sourceType === 'url' ? (
                        <>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الرابط</label>
                          <input 
                            type="text" required
                            value={newLesson.url}
                            onChange={e => setNewLesson({...newLesson, url: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                            placeholder="https://..."
                          />
                        </>
                      ) : (
                        <>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اختر الملف</label>
                          <input 
                            type="file" required
                            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowAddLesson(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400">إلغاء</button>
                    <button type="submit" className="btn-primary px-6 py-2">حفظ الدرس</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map(l => (
                  <div key={l.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400">
                        {l.type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{l.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => window.open(l.url, '_blank')}
                        className="text-indigo-600 dark:text-indigo-400 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded"
                        title="عرض"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(l.id)}
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <BookOpen size={64} strokeWidth={1} className="mb-4 opacity-20" />
              <p>اختر مادة من القائمة الجانبية لإدارة دروسها.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GradesView = ({ user }: { user: User }) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [content, setContent] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', description: '', url: '', type: 'link', sourceType: 'url' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const grades = [
    'السادس الابتدائي',
    'الأول المتوسط',
    'الثاني المتوسط',
    'الثالث المتوسط',
    'الرابع الإعدادي',
    'الخامس الإعدادي',
    'السادس الإعدادي'
  ];

  const categories = [
    { id: 'textbooks', label: 'الكتب الدراسية', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'videos', label: 'الشرح الفيديوي', icon: PlayCircle, color: 'bg-red-500' },
    { id: 'summaries', label: 'الملازم', icon: FileText, color: 'bg-emerald-500' },
    { id: 'exams', label: 'الامتحانات', icon: ClipboardList, color: 'bg-amber-500' }
  ];

  useEffect(() => {
    if (selectedGrade && selectedCategory) {
      fetch(`/api/grade-content/${selectedGrade}/${selectedCategory}`)
        .then(res => res.json())
        .then(setContent);
    }
  }, [selectedGrade, selectedCategory]);

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('grade', selectedGrade || '');
    formData.append('category', selectedCategory || '');
    formData.append('title', newContent.title);
    formData.append('description', newContent.description);
    formData.append('type', newContent.type);

    if (newContent.sourceType === 'file' && selectedFile) {
      formData.append('file', selectedFile);
    } else {
      formData.append('url', newContent.url);
    }

    const res = await fetch('/api/grade-content', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      setShowAddForm(false);
      setNewContent({ title: '', description: '', url: '', type: 'link', sourceType: 'url' });
      setSelectedFile(null);
      // Refresh content
      fetch(`/api/grade-content/${selectedGrade}/${selectedCategory}`)
        .then(res => res.json())
        .then(setContent);
    }
  };

  if (!selectedGrade) {
    return (
      <div className="space-y-8">
        <header>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">الصفوف الدراسية</h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">اختر الصف الدراسي لعرض المحتوى التعليمي.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {grades.map((grade, index) => (
            <motion.div
              key={grade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGrade(grade)}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <GraduationCap size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{grade}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">اضغط لاستكشاف الكتب والملازم والفيديوهات</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setSelectedGrade(null)}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          <ChevronRight size={20} className="transform rotate-0" /> العودة للصفوف
        </button>
        <header>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{selectedGrade}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">اختر القسم الذي تريد تصفحه.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex items-center gap-6 group"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <cat.icon size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{cat.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">تصفح وإضافة محتوى {cat.label}</p>
              </div>
              <ChevronRight className="mr-auto text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors transform rotate-180" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          <ChevronRight size={20} className="transform rotate-0" /> العودة للأقسام
        </button>
        {(user.role === 'admin' || user.role === 'teacher') && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2 py-2"
          >
            <Plus size={20} /> إضافة محتوى
          </button>
        )}
      </div>

      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {categories.find(c => c.id === selectedCategory)?.label} - {selectedGrade}
        </h2>
      </header>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-lg transition-colors duration-300"
        >
          <form onSubmit={handleAddContent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">العنوان</label>
              <input 
                type="text" 
                required
                value={newContent.title}
                onChange={e => setNewContent({...newContent, title: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                placeholder="مثال: كتاب الرياضيات المنهجي"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الوصف</label>
              <textarea 
                value={newContent.description}
                onChange={e => setNewContent({...newContent, description: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                placeholder="وصف بسيط للمحتوى"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نوع المحتوى</label>
              <select 
                value={newContent.type}
                onChange={e => setNewContent({...newContent, type: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                <option value="link">رابط (Link)</option>
                <option value="video">فيديو (Video)</option>
                <option value="file">ملف (File/PDF)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">مصدر المحتوى</label>
              <select 
                value={newContent.sourceType}
                onChange={e => setNewContent({...newContent, sourceType: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                <option value="url">رابط خارجي</option>
                <option value="file">رفع ملف من الجهاز</option>
              </select>
            </div>
            <div className="md:col-span-2">
              {newContent.sourceType === 'url' ? (
                <>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الرابط (URL)</label>
                  <input 
                    type="text" 
                    required
                    value={newContent.url}
                    onChange={e => setNewContent({...newContent, url: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                    placeholder="رابط الملف أو الفيديو أو الامتحان"
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اختر الملف</label>
                  <input 
                    type="file" 
                    required
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="btn-secondary py-2"
              >
                إلغاء
              </button>
              <button type="submit" className="btn-primary py-2">
                حفظ المحتوى
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 dark:text-slate-500">
            <FileText size={64} strokeWidth={1} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">لا يوجد محتوى مضاف حالياً في هذا القسم.</p>
          </div>
        ) : (
          content.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400">
                  {item.type === 'video' ? <PlayCircle size={24} /> : item.type === 'file' ? <FileText size={24} /> : <BookOpen size={24} />}
                </div>
                {(user.role === 'admin' || user.role === 'teacher') && (
                  <button 
                    onClick={async () => {
                      if(window.confirm('هل تريد حذف هذا المحتوى؟')) {
                        await fetch(`/api/grade-content/${item.id}`, { method: 'DELETE' });
                        setContent(content.filter(c => c.id !== item.id));
                      }
                    }}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                  >
                    حذف
                  </button>
                )}
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">{item.description}</p>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"
              >
                عرض المحتوى <ChevronRight size={18} className="transform rotate-180" />
              </a>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['student', 'teacher', 'admin'] },
    { id: 'leaderboard', label: 'المتصدرون', icon: Trophy, roles: ['student', 'teacher', 'admin'] },
    { id: 'grades', label: 'الصفوف الدراسية', icon: GraduationCap, roles: ['student', 'teacher', 'admin'] },
    { id: 'subjects', label: 'موادي الدراسية', icon: BookOpen, roles: ['student'] },
    { id: 'assignments', label: 'الواجبات', icon: FileUp, roles: ['student', 'teacher'] },
    { id: 'exams', label: 'الامتحانات', icon: ClipboardList, roles: ['student'] },
    { id: 'chat', label: 'الرسائل', icon: MessageSquare, roles: ['student', 'teacher'] },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users, roles: ['admin'] },
    { id: 'curriculum', label: 'المناهج الدراسية', icon: Settings, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[70] shadow-2xl p-6 lg:hidden transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Logo size="sm" />
                  <div className="flex items-center gap-0 font-display font-bold text-xl tracking-tight">
                    <span className="text-amber-400">star</span>
                    <span className="text-indigo-600 dark:text-indigo-400">Edu</span>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 dark:text-slate-500">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <div className="space-y-2">
                {filteredMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="absolute bottom-8 left-6 right-6">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-xl font-bold"
                >
                  <LogOut size={20} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 px-4 md:px-6 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-400 lg:hidden"
          >
            <Plus className="rotate-0" size={24} />
          </button>
          <Logo size="sm" />
          <div className="flex items-center gap-0 font-display font-bold text-xl tracking-tight">
            <span className="text-amber-400">star</span>
            <span className="text-indigo-600 dark:text-indigo-400">Edu</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.full_name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role === 'admin' ? 'مسؤول' : user.role === 'teacher' ? 'معلم' : 'طالب'} {user.grade ? `• ${user.grade}` : ''}</span>
          </div>
          <button 
            onClick={() => {
              if (window.confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                handleLogout();
              }
            }}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all rounded-lg font-medium"
          >
            <span className="text-sm hidden sm:inline">تسجيل الخروج</span>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={user.role} />
      
      <main className={`pt-20 pb-24 lg:pb-12 px-4 md:px-6 transition-all duration-300 ${isSidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <StudentDashboard user={user} />}
              {activeTab === 'leaderboard' && <LeaderboardView user={user} />}
              {activeTab === 'subjects' && <SubjectsView user={user} />}
              {activeTab === 'assignments' && <AssignmentsView user={user} />}
              {activeTab === 'grades' && <GradesView user={user} />}
              {activeTab === 'chat' && <ChatView user={user} />}
              {activeTab === 'users' && <AdminUsersView />}
              {activeTab === 'curriculum' && <CurriculumManagementView />}
              {/* Other tabs would go here */}
              {activeTab !== 'dashboard' && activeTab !== 'leaderboard' && activeTab !== 'grades' && activeTab !== 'chat' && activeTab !== 'users' && activeTab !== 'assignments' && activeTab !== 'subjects' && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Settings size={64} strokeWidth={1} className="mb-4" />
                  <h3 className="text-xl font-semibold">القسم قيد التطوير</h3>
                  <p>نحن نعمل بجد لتوفير ميزات {activeTab} قريباً!</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} role={user.role} />
    </div>
  );
}
