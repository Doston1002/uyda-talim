import { useMemo } from 'react';
import { Student } from '../types/student';
import { Users, Home, GraduationCap, TrendingUp, BarChart3, MapPinned } from 'lucide-react';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { SimPageHeader } from './SimPageHeader';
import { SimEmptyState } from './SimEmptyState';
import { regions } from '../data/uzbekistan-regions';

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
      title: "Jami o'quvchilar",
      value: stats.total,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      ring: 'ring-blue-100',
    },
    {
      title: "Inklyuziv ta'lim",
      value: stats.inklyuziv,
      icon: GraduationCap,
      gradient: 'from-purple-500 to-pink-500',
      ring: 'ring-purple-100',
    },
    {
      title: "Uyda ta'lim",
      value: stats.uyda,
      icon: Home,
      gradient: 'from-green-500 to-emerald-500',
      ring: 'ring-green-100',
    },
    {
      title: 'Joriy yil',
      value: stats.currentYear,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-amber-500',
      ring: 'ring-orange-100',
    },
  ];

  const isAdmin = user?.role === 'admin';

  const academicYears = ['2024-2025', '2025-2026', '2026-2027'];
  const chartGradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-rose-500',
    'from-indigo-500 to-violet-500',
    'from-teal-500 to-green-500',
    'from-yellow-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-pink-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-yellow-500',
    'from-rose-500 to-red-500',
    'from-violet-500 to-indigo-500',
  ];

  const regionStats = useMemo(() => {
    return regions.map(region => ({
      name: region.name,
      count: students.filter(s => s.region === region.name).length,
    }));
  }, [students]);

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
        count={stats.total}
        countLabel="ta o'quvchi ro'yxatda"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500 mb-2">{card.title}</p>
                  <p
                    className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md ring-4 ${card.ring} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="flex items-center gap-3 text-lg font-bold text-gray-800">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.iconBg} flex items-center justify-center shadow-sm`}>
              {isAdmin ? (
                <MapPinned className="w-5 h-5 text-white" />
              ) : (
                <BarChart3 className="w-5 h-5 text-white" />
              )}
            </div>
            {isAdmin ? "14 ta hudud bo'yicha o'quvchilar statistikasi" : "Yillar bo'yicha taqsimot"}
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">
            {isAdmin
              ? "Viloyat va shahar kesimida o'quvchilar soni"
              : "O'quv yillari kesimida o'quvchilar soni"}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {students.length === 0 ? (
            <SimEmptyState
              icon={isAdmin ? MapPinned : BarChart3}
              title="Ma'lumot yo'q"
              description={
                isAdmin
                  ? "Hozircha o'quvchilar mavjud emas. Direktorlar qo'shilgandan so'ng ma'lumotlar shu yerda ko'rinadi."
                  : "Hozircha o'quvchilar mavjud emas. \"Qo'shish\" bo'limidan yangi o'quvchi qo'shing."
              }
            />
          ) : isAdmin ? (
            <div className="space-y-5">
              {regionStats.map((region, index) => {
                const percentage = students.length > 0 ? (region.count / students.length) * 100 : 0;
                const gradient = chartGradients[index % chartGradients.length];

                return (
                  <div key={region.name} className="group">
                    <div className="flex items-center justify-between mb-2 gap-4">
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">{region.name}</span>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white shadow-sm shrink-0`}
                      >
                        {region.count} ta
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${gradient} h-2.5 rounded-full transition-all duration-700 group-hover:opacity-90`}
                        style={{ width: `${Math.max(percentage, region.count > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Jami foiz: {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {academicYears.map((year, index) => {
                const count = students.filter(s => s.academicYear === year).length;
                const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
                const gradient = chartGradients[index % chartGradients.length];

                return (
                  <div key={year} className="group">
                    <div className="flex items-center justify-between mb-3 gap-4">
                      <span className="font-semibold text-gray-800 text-base">{year}</span>
                      <span
                        className={`text-sm font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r ${gradient} text-white shadow-sm`}
                      >
                        {count} ta
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${gradient} h-3 rounded-full transition-all duration-700 group-hover:opacity-90`}
                        style={{ width: `${Math.max(percentage, count > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Jami foiz: {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
