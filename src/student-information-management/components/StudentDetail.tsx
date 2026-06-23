import { Student } from '../types/student';
import type { ElementType, ReactNode } from 'react';
import {
  X,
  User,
  Calendar,
  GraduationCap,
  Phone,
  MapPin,
  FileText,
  Award,
  Download,
  Stethoscope,
  MapPinned,
} from 'lucide-react';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { getSimApiUrl } from '../api';
import { getDisplayFileName } from '../utils';
import { getIllnessLabel } from '../data/illness-types';
import { calculateIllnessPeriod } from '../utils/illness-duration';

interface StudentDetailProps {
  student: Student;
  onClose: () => void;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
      <span className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
      {children}
    </h4>
  );
}

export function StudentDetail({ student, onClose }: StudentDetailProps) {
  const { user } = useSimAuth();
  const theme = getSimRoleTheme(user?.role);

  const illnessEndDisplay = (() => {
    if (student.illnessEndDate && student.illnessEndDateMax) {
      return `${student.illnessEndDate} — ${student.illnessEndDateMax}`;
    }
    if (student.illnessEndDate) return student.illnessEndDate;
    if (student.illnessType && student.conclusionDate) {
      const period = calculateIllnessPeriod(
        student.illnessType,
        student.conclusionDate,
        student.academicYear,
      );
      if (!period) return null;
      if (period.isRange && period.endDateMax) {
        return `${period.endDate} — ${period.endDateMax}`;
      }
      return period.endDate;
    }
    return null;
  })();

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-800">O&apos;quvchi ma&apos;lumotlari</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile header */}
          <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${theme.lightBg} border border-gray-100`}>
            <div className={`w-14 h-14 ${theme.iconBg} rounded-2xl flex items-center justify-center shadow-sm shrink-0`}>
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{student.fullName}</h3>
              <p className="text-sm text-gray-500">
                {student.class} &middot; {student.schoolName}
              </p>
              <span
                className={`inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.educationType === 'inklyuziv'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {student.educationType === 'inklyuziv' ? 'Inklyuziv ta\'lim' : 'Uyda ta\'lim'}
              </span>
            </div>
          </div>

          {/* Basic info */}
          <div>
            <SectionTitle>Asosiy ma&apos;lumotlar</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem icon={Calendar} label="Tug'ilgan sana" value={student.birthDate} />
              <InfoItem icon={Calendar} label="O'quv yili" value={student.academicYear} />
              <InfoItem icon={Phone} label="Telefon" value={student.phone} />
              <InfoItem icon={MapPin} label="Manzil" value={student.address} />
              {student.accommodations && (
                <InfoItem icon={Award} label="Qo'shimcha qulayliklar" value={student.accommodations} />
              )}
            </div>
          </div>

          {(student.region || student.districtOrCity) && (
            <div>
              <SectionTitle>Joylashuv ma&apos;lumotlari</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem icon={MapPinned} label="Viloyat" value={student.region} />
                <InfoItem icon={MapPinned} label="Tuman/Shahar" value={student.districtOrCity} />
              </div>
            </div>
          )}

          {(student.teacherName || student.teacherPhone) && (
            <div>
              <SectionTitle>O&apos;qituvchi ma&apos;lumotlari</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem icon={GraduationCap} label="O'qituvchi ismi" value={student.teacherName} />
                <InfoItem icon={Phone} label="O'qituvchi telefoni" value={student.teacherPhone} />
              </div>
            </div>
          )}

          {(student.illnessType || student.conclusionDate || student.uploadedFiles?.length) && (
            <div>
              <SectionTitle>Tibbiy ma&apos;lumotlar</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <InfoItem
                  icon={Stethoscope}
                  label="Kasallik turi"
                  value={student.illnessType ? getIllnessLabel(student.illnessType) : undefined}
                />
                <InfoItem icon={Calendar} label="Xulosa berilgan sana" value={student.conclusionDate} />
                <InfoItem icon={Calendar} label="Ta'lim muddati tugash sanasi" value={illnessEndDisplay} />
              </div>
              {student.uploadedFiles && student.uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-400">Xulosalar / Fayllar</p>
                  {student.uploadedFiles.map((f, idx) => (
                    <a
                      key={idx}
                      href={`${getSimApiUrl()}/students/download/${encodeURIComponent(f.filename)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors group"
                    >
                      <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                      <span className="text-sm font-medium text-indigo-700 flex-1 truncate">
                        {getDisplayFileName(f.originalname, f.filename)}
                      </span>
                      <Download className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {student.notes && (
            <div>
              <SectionTitle>Izoh</SectionTitle>
              <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-4 leading-relaxed">
                {student.notes}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
            <span>
              Kiritilgan:{' '}
              <strong className="text-gray-600">
                {new Date(student.createdAt).toLocaleString('uz-UZ')}
              </strong>
            </span>
            <span>
              Kiritgan: <strong className="text-gray-600">{student.createdBy}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
