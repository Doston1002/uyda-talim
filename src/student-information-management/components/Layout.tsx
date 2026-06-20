import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { simBtnNav } from '../sim-ui';
import { LayoutDashboard, Users, UserPlus, LogOut, GraduationCap, UserCog } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'students' | 'add' | 'direktorlar';
  onNavigate: (page: 'dashboard' | 'students' | 'add' | 'direktorlar') => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useSimAuth();
  const router = useRouter();
  const theme = getSimRoleTheme(user?.role);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const menuItems =
    user?.role === 'admin'
      ? [
          { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students' as const, label: "O'quvchilar", icon: Users },
          { id: 'direktorlar' as const, label: 'Direktorlar', icon: UserCog },
        ]
      : [
          { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students' as const, label: "O'quvchilar", icon: Users },
          { id: 'add' as const, label: "Qo'shish", icon: UserPlus },
        ];

  return (
    <div className={`sim-app min-h-screen bg-gradient-to-br ${theme.lightBg}`}>
      <nav className="bg-white border-b-2 border-gray-100 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[80px] gap-6 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-14 h-14 shrink-0 ${theme.iconBg} rounded-2xl flex items-center justify-center shadow-md`}>
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className={`text-xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  Inklyuziv Ta&apos;lim
                </h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${theme.badge}`}>
                    {theme.label}
                  </span>
                  {user?.email && (
                    <span className="text-sm text-gray-500 hidden lg:inline truncate max-w-[260px]">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`${simBtnNav} ${
                        isActive
                          ? `${theme.navActive} shadow-md`
                          : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleLogout}
                className={`${simBtnNav} text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100`}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          </div>

          <div className="md:hidden flex gap-2 pb-4">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 min-h-[60px] px-2 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                    isActive ? theme.navActive : 'text-gray-600 bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
