import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface SimModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function SimModal({ title, onClose, children, footer, maxWidth = 'max-w-2xl' }: SimModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`sim-app bg-white rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[92vh] flex flex-col overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Yopish"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">{children}</div>

        {footer && (
          <div className="px-6 sm:px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
