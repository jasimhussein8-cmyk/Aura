export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  username: string;
  role: Role;
  grade?: string;
  full_name: string;
}

export interface Subject {
  id: number;
  name: string;
  grade: string;
}

export interface Lesson {
  id: number;
  subject_id: number;
  title: string;
  content: string;
  type: 'video' | 'pdf' | 'text';
  url?: string;
}

export interface Exam {
  id: number;
  subject_id: number;
  title: string;
  duration: number;
}

export interface Question {
  id: number;
  exam_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  type: 'mcq' | 'tf' | 'short';
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  sender_name?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  awarded_at?: string;
}

export interface UserStats {
  points: number;
  badges: Badge[];
  lessonsCompleted: number;
}

export interface LeaderboardEntry {
  id: number;
  full_name: string;
  points: number;
  grade: string;
}

export interface SubjectProgress {
  subjectId: number;
  subjectName: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface Assignment {
  id: number;
  subject_id: number;
  title: string;
  description: string;
  due_date: string;
  subject_name?: string;
}

export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  text_entry?: string;
  file_url?: string;
  file_name?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  assignment_title?: string;
  student_name?: string;
}

export interface Recommendation {
  id: number;
  user_id: number;
  content_type: 'lesson' | 'exam' | 'subject';
  content_id: number;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
}
