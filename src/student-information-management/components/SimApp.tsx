import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimApiUrl } from '../api';
import { getSimRoleTheme } from '../theme';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { StudentList } from './StudentList';
import { AddStudent } from './AddStudent';
import { StudentDetail } from './StudentDetail';
import { DirektorManagement } from './DirektorManagement';
import { Student } from '../types/student';

export function SimApp() {
  const { user } = useSimAuth();
  const router = useRouter();
  const API_URL = getSimApiUrl();
  const theme = getSimRoleTheme(user?.role);

  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'students' | 'add' | 'direktorlar'>(
    'dashboard'
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace('/auth');
      return;
    }

    setIsLoading(true);
    const role = user.role;
    const createdBy = user.email;

    fetch(
      `${API_URL}/students?createdBy=${encodeURIComponent(createdBy)}&role=${encodeURIComponent(role)}`
    )
      .then(async r => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.message || `Server xatosi (${r.status})`);
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const normalized = data.map((s: Student & { _id?: string }) => ({
            ...s,
            id: s.id || s._id || '',
          }));
          setStudents(normalized as Student[]);
        } else {
          setStudents([]);
        }
      })
      .catch((e: Error) => {
        setStudents([]);
        toast.error(e.message || "O'quvchilar ma'lumotlarini yuklashda xatolik");
      })
      .finally(() => setIsLoading(false));
  }, [user, API_URL, router]);

  const handleAddStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
    setCurrentPage('students');
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Server error' }));
        toast.error(err.message || "O'chirishda xatolik yuz berdi");
        return;
      }
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch {
      toast.error("Tarmoq xatosi. Iltimos, qaytadan urinib ko'ring");
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.lightBg} flex flex-col items-center justify-center gap-4`}>
        <div className={`w-12 h-12 ${theme.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
        <p className="text-gray-500 text-sm">Ma&apos;lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && <Dashboard students={students} />}
        {currentPage === 'students' && (
          <StudentList
            students={students}
            onViewStudent={setSelectedStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}
        {currentPage === 'add' && <AddStudent onAddStudent={handleAddStudent} />}
        {currentPage === 'direktorlar' && user.role === 'admin' && <DirektorManagement />}

        {selectedStudent && (
          <StudentDetail student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}
      </Layout>
      <Toaster position="top-right" richColors />
    </>
  );
}
