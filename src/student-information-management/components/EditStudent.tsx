import { useMemo, useState } from 'react';
import { Student } from '../types/student';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { SimModal } from './SimModal';
import { SimFormField } from './SimFormField';
import { getSimApiUrl } from '../api';
import { simInput, simSelect, simTextarea, simFileUpload, simBtnPrimary, simBtnSecondary } from '../sim-ui';
import { Save, FileText, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { ILLNESS_TYPES, type IllnessTypeOption } from '../data/illness-types';
import { calculateIllnessPeriod, formatIllnessPeriodDisplay } from '../utils/illness-duration';

interface EditStudentProps {
  student: Student;
  onClose: () => void;
  onUpdateStudent: (student: Student) => void;
}

export function EditStudent({ student, onClose, onUpdateStudent }: EditStudentProps) {
  const { user } = useSimAuth();
  const theme = getSimRoleTheme(user?.role);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() => ({
    fullName: student.fullName || '',
    birthDate: student.birthDate || '',
    class: student.class || '',
    illnessType: student.illnessType || '',
    conclusionDate: student.conclusionDate || '',
    conclusionFile: null as File | null,
    phone: student.phone || '',
    address: student.address || '',
    academicYear: student.academicYear || '2025-2026',
    notes: student.notes || '',
    accommodations: student.accommodations || '',
    educationType: student.educationType || 'inklyuziv' as 'inklyuziv' | 'uyda',
    teacherName: student.teacherName || '',
    teacherPhone: student.teacherPhone || '',
  }));

  const illnessPeriod = useMemo(() => {
    if (!formData.illnessType || !formData.conclusionDate) return null;
    return calculateIllnessPeriod(
      formData.illnessType,
      formData.conclusionDate,
      formData.academicYear,
    );
  }, [formData.illnessType, formData.conclusionDate, formData.academicYear]);

  const selectedIllness = useMemo(
    () => ILLNESS_TYPES.find(item => item.id === formData.illnessType),
    [formData.illnessType],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, conclusionFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const API_URL = getSimApiUrl();
    const payload: Record<string, string> = {
      fullName: formData.fullName,
      birthDate: formData.birthDate,
      class: formData.class,
      phone: formData.phone,
      address: formData.address,
      academicYear: formData.academicYear,
      notes: formData.notes || '',
      accommodations: formData.accommodations || '',
      educationType: formData.educationType,
      teacherName: formData.teacherName || '',
      teacherPhone: formData.teacherPhone || '',
      illnessType: formData.illnessType || '',
      conclusionDate: formData.conclusionDate || '',
    };

    if (illnessPeriod) {
      payload.illnessEndDate = illnessPeriod.endDate;
      if (illnessPeriod.endDateMax) payload.illnessEndDateMax = illnessPeriod.endDateMax;
    } else {
      payload.illnessEndDate = '';
      payload.illnessEndDateMax = '';
    }

    try {
      let saved: Student & { _id?: string };

      if (formData.conclusionFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([key, value]) => fd.append(key, value));
        fd.append('file', formData.conclusionFile);

        const res = await fetch(`${API_URL}/students/${student.id}/upload`, {
          method: 'PUT',
          body: fd,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Server error' }));
          toast.error(err.message || 'O\'quvchini yangilashda xatolik yuz berdi');
          return;
        }
        saved = await res.json();
      } else {
        const res = await fetch(`${API_URL}/students/${student.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Server error' }));
          toast.error(err.message || 'O\'quvchini yangilashda xatolik yuz berdi');
          return;
        }
        saved = await res.json();
      }

      onUpdateStudent({
        ...student,
        ...saved,
        id: saved.id || saved._id || student.id,
        uploadedFiles: saved.uploadedFiles ?? student.uploadedFiles,
      });
      toast.success('O\'quvchi ma\'lumotlari yangilandi');
      onClose();
    } catch {
      toast.error('Tarmoq xatosi. Iltimos, qaytadan urinib ko\'ring');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SimModal
      title="O'quvchini tahrirlash"
      onClose={onClose}
      maxWidth="max-w-3xl"
      footer={
        <>
          <button type="button" onClick={onClose} className={simBtnSecondary} disabled={isSaving}>
            Bekor qilish
          </button>
          <button
            type="submit"
            form="edit-student-form"
            disabled={isSaving}
            className={`${simBtnPrimary} bg-gradient-to-r ${theme.gradient} ${theme.gradientHover}`}
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </>
      }
    >
      <form id="edit-student-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SimFormField label="F.I.Sh" required className="md:col-span-2">
          <input
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className={simInput}
            required
          />
        </SimFormField>

        <SimFormField label="Kasallik turi" className="md:col-span-2">
          <select
            name="illnessType"
            value={formData.illnessType}
            onChange={handleChange}
            className={simSelect}
          >
            <option value="">Tanlang</option>
            {ILLNESS_TYPES.reduce<{ category: string; items: IllnessTypeOption[] }[]>((groups, item) => {
              const last = groups[groups.length - 1];
              if (!last || last.category !== item.category) {
                groups.push({ category: item.category, items: [item] });
              } else {
                last.items.push(item);
              }
              return groups;
            }, []).map((group, groupIndex) => (
              <optgroup key={group.category} label={`${groupIndex + 1}. ${group.category}`}>
                {group.items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.label} ({item.durationLabel})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </SimFormField>

        {selectedIllness && (
          <div className="md:col-span-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
              Uyda yakka tartibda taʼlim muddati
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{selectedIllness.label}</span>
              {' — '}
              <span className="font-semibold text-indigo-700">{selectedIllness.durationLabel}</span>
            </p>
          </div>
        )}

        <SimFormField label="Xulosa berilgan sana">
          <input
            name="conclusionDate"
            type="date"
            value={formData.conclusionDate}
            onChange={handleChange}
            className={simInput}
          />
        </SimFormField>

        {illnessPeriod && (
          <SimFormField label="Ta'lim muddati tugash sanasi">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CalendarClock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-800">
                  {illnessPeriod.isRange && illnessPeriod.endDateMax
                    ? `${illnessPeriod.endDate} — ${illnessPeriod.endDateMax}`
                    : illnessPeriod.endDate}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {formatIllnessPeriodDisplay(illnessPeriod)}
                </p>
              </div>
            </div>
          </SimFormField>
        )}

        <SimFormField label="Xulosa (PDF)" className={illnessPeriod ? '' : 'md:col-span-1'}>
          <label htmlFor="editConclusionFile" className={simFileUpload}>
            <FileText className="w-5 h-5 shrink-0" />
            <span className="truncate">
              {formData.conclusionFile
                ? formData.conclusionFile.name
                : 'Yangi PDF fayl (ixtiyoriy)'}
            </span>
          </label>
          <input
            id="editConclusionFile"
            name="conclusionFile"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="sr-only"
          />
        </SimFormField>

        <SimFormField label="Tug'ilgan sana" required>
          <input
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            className={simInput}
            required
          />
        </SimFormField>

        <SimFormField label="Sinf" required>
          <select name="class" value={formData.class} onChange={handleChange} className={simSelect} required>
            <option value="">Tanlang</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
              <option key={num} value={`${num}-sinf`}>{num}-sinf</option>
            ))}
          </select>
        </SimFormField>

        {user?.role === 'direktor' && (
          <>
            <SimFormField label="O'qituvchi ismi">
              <input
                name="teacherName"
                type="text"
                value={formData.teacherName}
                onChange={handleChange}
                className={simInput}
              />
            </SimFormField>
            <SimFormField label="O'qituvchi telefoni">
              <input
                name="teacherPhone"
                type="tel"
                value={formData.teacherPhone}
                onChange={handleChange}
                className={simInput}
              />
            </SimFormField>
          </>
        )}

        <SimFormField label="Telefon" required>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={simInput}
            required
          />
        </SimFormField>

        <SimFormField label="Ta'lim turi" required>
          <select
            name="educationType"
            value={formData.educationType}
            onChange={handleChange}
            className={simSelect}
            required
          >
            <option value="inklyuziv">Inklyuziv ta'lim</option>
            <option value="uyda">Uyda ta'lim</option>
          </select>
        </SimFormField>

        <SimFormField label="Manzil" required className="md:col-span-2">
          <input
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={simInput}
            required
          />
        </SimFormField>

        <SimFormField label="O'quv yili" required>
          <select
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className={simSelect}
            required
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2026-2027">2026-2027</option>
          </select>
        </SimFormField>

        <SimFormField label="Qo'shimcha qulayliklar">
          <input
            name="accommodations"
            type="text"
            value={formData.accommodations}
            onChange={handleChange}
            className={simInput}
          />
        </SimFormField>

        <SimFormField label="Izoh" className="md:col-span-2">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={simTextarea}
          />
        </SimFormField>
      </form>
    </SimModal>
  );
}
