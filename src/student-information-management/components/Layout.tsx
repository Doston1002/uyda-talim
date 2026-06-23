import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  GraduationCap,
  UserCog,
  LucideIcon,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'students' | 'add' | 'direktorlar';
  onNavigate: (page: 'dashboard' | 'students' | 'add' | 'direktorlar') => void;
}

type MenuId = LayoutProps['currentPage'];

interface MenuItem {
  id: MenuId;
  label: string;
  icon: LucideIcon;
}

function getUserInitial(email?: string) {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useSimAuth();
  const router = useRouter();
  const theme = getSimRoleTheme(user?.role);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const menuItems: MenuItem[] =
    user?.role === 'admin'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: "O'quvchilar", icon: Users },
          { id: 'direktorlar', label: 'Direktorlar', icon: UserCog },
        ]
      : [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: "O'quvchilar", icon: Users },
          { id: 'add', label: "Qo'shish", icon: UserPlus },
        ];

  const renderNavButton = (item: MenuItem, compact = false) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;

    if (compact) {
      return (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`
            flex-1 flex flex-col items-center justify-center gap-1.5 min-h-[72px] px-3 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200
            ${
              isActive
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-md`
                : 'text-gray-600 bg-white hover:bg-gray-50'
            }
          `}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-xl ${
              isActive ? 'bg-white/20' : 'bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
          </span>
          <span className="whitespace-nowrap">{item.label}</span>
        </button>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`
          group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-xl font-semibold text-[15px] transition-all duration-200
          ${
            isActive
              ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
        `}
      >
        <span
          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
            isActive ? 'bg-white/25' : 'bg-gray-100 group-hover:bg-gray-200/70'
          }`}
        >
          <Icon className="w-[18px] h-[18px]" />
        </span>
        <span className="whitespace-nowrap">{item.label}</span>
      </button>
    );
  };

  return (
    <div className={`sim-app min-h-screen bg-gradient-to-br ${theme.lightBg}`}>
      <header className="sticky top-0 z-50">
        <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />

        <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 min-h-[88px] py-3">
              {/* Brand */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 lg:shrink-0 lg:w-[300px]">
                <div className="relative shrink-0">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${theme.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${theme.gradient} ring-2 ring-white`}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-0.5">
                    Boshqaruv paneli
                  </p>
                  <h1
                    className={`text-lg sm:text-2xl font-bold leading-tight bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent truncate`}
                  >
                    Inklyuziv Ta&apos;lim
                  </h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`inline-flex items-center text-xs sm:text-sm font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border ${theme.badge}`}
                    >
                      {theme.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center navigation */}
              <div className="hidden lg:flex flex-1 justify-center px-4">
                <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-white border border-gray-200 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
                  {menuItems.map(item => renderNavButton(item))}
                </div>
              </div>

              {/* User + logout */}
              <div className="hidden lg:flex items-center gap-3 shrink-0 lg:w-[300px] justify-end">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                  >
                    {getUserInitial(user?.email)}
                  </div>
                  <div className="hidden xl:block min-w-0 max-w-[180px]">
                    <p className="text-sm font-semibold text-gray-800 truncate">{theme.label}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 min-h-[46px] px-4 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                  <span>Chiqish</span>
                </button>
              </div>

              {/* Mobile logout */}
              <button
                onClick={handleLogout}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all shrink-0"
                aria-label="Chiqish"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile / tablet nav */}
            <div className="lg:hidden pb-4">
              <div className="flex gap-2 p-2 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-x-auto">
                {menuItems.map(item => renderNavButton(item, true))}
              </div>
              {user?.email && (
                <p className="text-xs text-gray-500 mt-2.5 px-1 truncate sm:hidden">{user.email}</p>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
    </div>
  );
}
