import { SimUserRole } from './contexts/SimAuthContext';

export interface SimRoleTheme {
  label: string;
  description: string;
  gradient: string;
  gradientHover: string;
  lightBg: string;
  badge: string;
  ring: string;
  dot: string;
  navActive: string;
  iconBg: string;
}

export const simRoleThemes: Record<SimUserRole, SimRoleTheme> = {
  admin: {
    label: 'Administrator',
    description: 'Barcha maktablar va direktorlarni boshqarish',
    gradient: 'from-indigo-600 to-purple-600',
    gradientHover: 'hover:from-indigo-700 hover:to-purple-700',
    lightBg: 'from-indigo-50 via-purple-50 to-white',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    ring: 'focus:ring-indigo-500',
    dot: 'bg-indigo-500',
    navActive: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md',
    iconBg: 'bg-gradient-to-br from-indigo-600 to-purple-600',
  },
  direktor: {
    label: 'Direktor',
    description: "Maktab o'quvchilarini boshqarish",
    gradient: 'from-emerald-600 to-teal-600',
    gradientHover: 'hover:from-emerald-700 hover:to-teal-700',
    lightBg: 'from-emerald-50 via-teal-50 to-white',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ring: 'focus:ring-emerald-500',
    dot: 'bg-emerald-500',
    navActive: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md',
    iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-600',
  },
};

export function getSimRoleTheme(role?: SimUserRole): SimRoleTheme {
  return simRoleThemes[role ?? 'direktor'];
}
