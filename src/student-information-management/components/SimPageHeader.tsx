import { ReactNode } from 'react';
import { getSimRoleTheme } from '../theme';
import { SimUserRole } from '../contexts/SimAuthContext';

interface SimPageHeaderProps {
  title: string;
  subtitle?: string;
  role?: SimUserRole;
  count?: number;
  countLabel?: string;
  actions?: ReactNode;
}

export function SimPageHeader({
  title,
  subtitle,
  role,
  count,
  countLabel,
  actions,
}: SimPageHeaderProps) {
  const theme = getSimRoleTheme(role);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1
              className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
            >
              {title}
            </h1>
            {role && (
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${theme.badge}`}>
                {theme.label}
              </span>
            )}
          </div>
          {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
          {count !== undefined && countLabel && (
            <div className="text-gray-600 flex items-center gap-2 mt-2 text-base">
              <span className={`w-2.5 h-2.5 ${theme.dot} rounded-full shrink-0`} />
              <span>
                <strong className="text-gray-900 text-lg">{count}</strong> {countLabel}
              </span>
            </div>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 flex-wrap shrink-0 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
