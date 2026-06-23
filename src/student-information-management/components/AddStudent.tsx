import { useMemo, useState } from 'react';
import { Student } from '../types/student';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { SimPageHeader } from './SimPageHeader';
import { SimFormField } from './SimFormField';
import { getSimApiUrl } from '../api';
import { simInput, simSelect, simTextarea, simFileUpload, simBtnPrimary } from '../sim-ui';
import { UserPlus, CheckCircle, FileText, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { ILLNESS_TYPES, type IllnessTypeOption } from '../data/illness-types';
import { calculateIllnessPeriod, formatIllnessPeriodDisplay } from '../utils/illness-duration';// regions/districts removed from this form — kept in direktor account

interface AddStudentProps {
  onAddStudent: (student: Student) => void;
}

export function AddStudent({ onAddStudent }: AddStudentProps) {
  const { user } = useSimAuth();
  const theme = getSimRoleTheme(user?.role);
  const [formData, setFormData] = useState(() => ({
    fullName: '',
    birthDate: '',
    class: '',
    illnessType: '',
    conclusionDate: '',
    conclusionFile: null as File | null,
    phone: '',
    address: '',
    academicYear: '2025-2026',
    notes: '',
    accommodations: '',
    educationType: 'inklyuziv' as 'inklyuziv' | 'uyda',
    teacherName: '',
    teacherPhone: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit via FormData so file can be uploaded
    const fd = new FormData();
    fd.append('fullName', formData.fullName);
    fd.append('birthDate', formData.birthDate);
    fd.append('class', formData.class);
    fd.append('phone', formData.phone);
    fd.append('address', formData.address);
    fd.append('academicYear', formData.academicYear);
    fd.append('notes', formData.notes || '');
    fd.append('accommodations', formData.accommodations || '');
    fd.append('educationType', formData.educationType);
    fd.append('teacherName', formData.teacherName || '');
    fd.append('teacherPhone', formData.teacherPhone || '');
    fd.append('illnessType', formData.illnessType || '');
    fd.append('conclusionDate', formData.conclusionDate || '');
    if (illnessPeriod) {
      fd.append('illnessEndDate', illnessPeriod.endDate);
      if (illnessPeriod.endDateMax) fd.append('illnessEndDateMax', illnessPeriod.endDateMax);
    }
    if (formData.conclusionFile) fd.append('file', formData.conclusionFile);

    // include createdBy so backend can infer direktor
    fd.append('createdBy', user?.email || '');

    // send to API directly
    const API_URL = getSimApiUrl();
    fetch(`${API_URL}/students/upload`, {
      method: 'POST',
      body: fd,
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Server error' }));
          toast.error(err.message || 'O\'quvchini saqlashda xatolik yuz berdi');
          return;
        }
        const saved = await res.json();
        // add to parent state
        onAddStudent({ ...(saved as any), id: (saved as any).id || (saved as any)._id });
        toast.success('O\'quvchi muvaffaqiyatli qo\'shildi!', {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        });
        setFormData({
          fullName: '',
          birthDate: '',
          class: '',
          illnessType: '',
          conclusionDate: '',
          conclusionFile: null,
          phone: '',
          address: '',
          academicYear: '2025-2026',
          notes: '',
          accommodations: '',
          educationType: 'inklyuziv',
          teacherName: '',
          teacherPhone: '',
        });
      })
      .catch(() => {
        toast.error('Tarmoq xatosi. Iltimos, qaytadan urinib ko\'ring');
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, conclusionFile: file }));
  };

  

  return (
    <div className="space-y-6">
      <SimPageHeader
        title="O'quvchi qo'shish"
        subtitle="Yangi o'quvchi ma'lumotlarini to'ldiring"
        role={user?.role}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SimFormField label="F.I.Sh" required className="md:col-span-2">
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className={simInput}
              placeholder="To'liq ism sharifingizni kiriting"
              required
            />
          </SimFormField>

          {(user?.role === 'direktor' || user?.role === 'admin') && (
            <SimFormField label="Kasallik turi" className="md:col-span-2">
              <select
                id="illnessType"
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
          )}

          {(user?.role === 'direktor' || user?.role === 'admin') && selectedIllness && (
            <div className="md:col-span-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                Uyda yakka tartibda taʼlim muddati
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">{selectedIllness.label}</span>
                {' — '}
                <span className="font-semibold text-indigo-700">{selectedIllness.durationLabel}</span>
                {selectedIllness.duration === 'academic_year' && (
                  <span className="text-gray-500"> (2-sentabrdan 25-maygacha)</span>
                )}
              </p>
            </div>
          )}

          {(user?.role === 'direktor' || user?.role === 'admin') && (
            <>
              <SimFormField label="Xulosa berilgan sana">
                <input
                  id="conclusionDate"
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
                <label htmlFor="conclusionFile" className={simFileUpload}>
                  <FileText className="w-5 h-5 shrink-0" />
                  <span className="truncate">
                    {formData.conclusionFile
                      ? formData.conclusionFile.name
                      : 'PDF fayl tanlang'}
                  </span>
                </label>
                <input
                  id="conclusionFile"
                  name="conclusionFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </SimFormField>
            </>
          )}

          <SimFormField label="Tug'ilgan sana" required>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              className={simInput}
              required
            />
          </SimFormField>

          <SimFormField label="Sinf" required>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className={simSelect}
              required
            >
              <option value="">Tanlang</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <option key={num} value={`${num}-sinf`}>{num}-sinf</option>
              ))}
            </select>
          </SimFormField>

          {user?.role === 'direktor' && (
            <>
              <SimFormField label="O'qituvchi ismi">
                <input
                  id="teacherName"
                  name="teacherName"
                  type="text"
                  value={formData.teacherName}
                  onChange={handleChange}
                  className={simInput}
                  placeholder="O'qituvchi ismini kiriting"
                />
              </SimFormField>

              <SimFormField label="O'qituvchi telefoni">
                <input
                  id="teacherPhone"
                  name="teacherPhone"
                  type="tel"
                  value={formData.teacherPhone}
                  onChange={handleChange}
                  className={simInput}
                  placeholder="+998 90 123 45 67"
                />
              </SimFormField>
            </>
          )}

          <SimFormField label="Telefon" required>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={simInput}
              placeholder="+998 90 123 45 67"
              required
            />
          </SimFormField>

          <SimFormField label="Ta'lim turi" required>
            <select
              id="educationType"
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
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={simInput}
              placeholder="To'liq manzilni kiriting"
              required
            />
          </SimFormField>

          <SimFormField label="O'quv yili" required>
            <select
              id="academicYear"
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
              id="accommodations"
              name="accommodations"
              type="text"
              value={formData.accommodations}
              onChange={handleChange}
              className={simInput}
              placeholder="Kerakli qulayliklar"
            />
          </SimFormField>

          <SimFormField label="Izoh" className="md:col-span-2">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={simTextarea}
              placeholder="Qo'shimcha ma'lumotlar"
            />
          </SimFormField>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className={`${simBtnPrimary} bg-gradient-to-r ${theme.gradient} ${theme.gradientHover} hover:shadow-lg`}
          >
            <UserPlus className="w-5 h-5" />
            O&apos;quvchi qo&apos;shish
          </button>
        </div>
      </form>
    </div>
  );
}
