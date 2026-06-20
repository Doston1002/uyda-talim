import { useState } from 'react';
import { Student } from '../types/student';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { SimPageHeader } from './SimPageHeader';
import { SimFormField } from './SimFormField';
import { getSimApiUrl } from '../api';
import { simInput, simSelect, simTextarea, simFileUpload, simBtnPrimary } from '../sim-ui';
import { UserPlus, CheckCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
// regions/districts removed from this form — kept in direktor account

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
    fd.append('illnessType', (formData as any).illnessType || '');
    fd.append('conclusionDate', (formData as any).conclusionDate || '');
    if ((formData as any).conclusionFile) fd.append('file', (formData as any).conclusionFile as File);

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
                value={(formData as any).illnessType}
                onChange={handleChange}
                className={simSelect}
              >
                <option value="">Tanlang</option>
                <optgroup label="1. Somatik kasalliklar">
                  <option value="somatik:biriktiruvchi_toqima">Biriktiruvchi toʻqima tizimli shikastlanishi</option>
                  <option value="somatik:yurak_kasalligi">Yurak va qon aylanish tizimi tugʻma nuqsonlari</option>
                  <option value="somatik:tetrada_fallo">Ogʻir darajadagi tetrada Fallo</option>
                  <option value="somatik:opka_bronx">Oʻpka-bronx kasalliklari (II-III)</option>
                  <option value="somatik:asma">Astmaning ogʻir darajasi</option>
                  <option value="somatik:glom">Surunkali glomerulonefrit</option>
                  <option value="somatik:piyelonefrit">Surunkali piyelonefrit</option>
                  <option value="somatik:leykoz">Oʻtkir leykoz va kamqonliklar</option>
                  <option value="somatik:onkologiya">Turli organlar xavfli oʻsmalari</option>
                  <option value="somatik:mukovissidoz">Mukovissedoz (ogʻir)</option>
                </optgroup>
                <optgroup label="2. Psixonevrologik kasalliklar">
                  <option value="psix:ruhiy">Ruhiy holati buzilganligi (shizofreniya, psixoz)</option>
                  <option value="psix:epilepsiya">Epilepsiya (zoʻraygan davr)</option>
                  <option value="psix:avtizm">Bolalar autizmi</option>
                  <option value="psix:miopatiya">Miopatiya / Miastenia</option>
                </optgroup>
                <optgroup label="3. Xirurgik kasalliklar">
                  <option value="xir:orqa_miya">Orqa miya churrasi</option>
                  <option value="xir:siydik">Siydik pufagi ekstrofiyasi / incontinens</option>
                  <option value="xir:oyoqlar">Oyoqlarning falaji</option>
                </optgroup>
                <optgroup label="4. Teri kasalliklari">
                  <option value="teri:epidermoliz">Tugʻma bullezepidermoliz</option>
                  <option value="teri:ihtioz">Tugʻma ixtioz (zoʻraygan davr)</option>
                  <option value="teri:psoriaz">Psoriaz eritrodermiya / artropatik psoriaz</option>
                </optgroup>
              </select>
            </SimFormField>
          )}

          {(user?.role === 'direktor' || user?.role === 'admin') && (
            <>
              <SimFormField label="Xulosa berilgan sana">
                <input
                  id="conclusionDate"
                  name="conclusionDate"
                  type="date"
                  value={(formData as any).conclusionDate}
                  onChange={handleChange}
                  className={simInput}
                />
              </SimFormField>

              <SimFormField label="Xulosa (PDF)">
                <label htmlFor="conclusionFile" className={simFileUpload}>
                  <FileText className="w-5 h-5 shrink-0" />
                  <span className="truncate">
                    {(formData as any).conclusionFile
                      ? (formData as any).conclusionFile.name
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
