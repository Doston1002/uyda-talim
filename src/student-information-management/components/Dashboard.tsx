import { useMemo } from 'react';
import { Student } from '../types/student';
import { Users, Home, GraduationCap, TrendingUp, BarChart3 } from 'lucide-react';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { SimPageHeader } from './SimPageHeader';
import { SimEmptyState } from './SimEmptyState';

interface DashboardProps {
  students: Student[];
}

export function Dashboard({ students }: DashboardProps) {
  const { user } = useSimAuth();
  const theme = getSimRoleTheme(user?.role);

  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear().toString();
    const currentYearStudents = students.filter(s => s.academicYear.includes(currentYear));

    return {
      total: students.length,
      inklyuziv: students.filter(s => s.educationType === 'inklyuziv').length,
      uyda: students.filter(s => s.educationType === 'uyda').length,
      currentYear: currentYearStudents.length,
    };
  }, [students]);

  const cards = [
    {
      title: "Jami O'quvchilar",
      value: stats.total,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      lightBg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      title: "Inklyuziv Ta'lim",
      value: stats.inklyuziv,
      icon: GraduationCap,
      gradient: 'from-purple-500 to-pink-500',
      lightBg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      title: "Uyda Ta'lim",
      value: stats.uyda,
      icon: Home,
      gradient: 'from-green-500 to-emerald-500',
      lightBg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
    {
      title: 'Joriy Yil',
      value: stats.currentYear,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      lightBg: 'bg-gradient-to-br from-orange-50 to-red-50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
  ];

  const academicYears = ['2024-2025', '2025-2026', '2026-2027'];
  const yearGradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
  ];

  return (
    <div className="space-y-6">
      <SimPageHeader
        title="Dashboard"
        subtitle={
          user?.role === 'admin'
            ? "Barcha maktablar bo'yicha o'quvchilar statistikasi"
            : "Maktabingiz bo'yicha o'quvchilar statistikasi"
        }
        role={user?.role}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.lightBg} rounded-2xl shadow-sm border border-white/80 p-5 hover:shadow-md transition-all`}
            >
              <div className={`${card.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-4`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
          <div className={`w-1 h-5 bg-gradient-to-b ${theme.gradient} rounded-full`} />
          Yillar bo&apos;yicha taqsimot
        </h2>

        {students.length === 0 ? (
          <SimEmptyState
            icon={BarChart3}
            title="Ma'lumot yo'q"
            description={
              user?.role === 'admin'
                ? "Hozircha o'quvchilar mavjud emas. Direktorlar qo'shilgandan so'ng ma'lumotlar shu yerda ko'rinadi."
                : "Hozircha o'quvchilar mavjud emas. \"Qo'shish\" bo'limidan yangi o'quvchi qo'shing."
            }
          />
        ) : (
          <div className="space-y-5">
            {academicYears.map((year, index) => {
              const count = students.filter(s => s.academicYear === year).length;
              const percentage = students.length > 0 ? (count / students.length) * 100 : 0;

              return (
                <div key={year}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700 text-sm">{year}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {count} ta o&apos;quvchi
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${yearGradients[index]} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
