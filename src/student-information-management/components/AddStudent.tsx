import { useMemo, useState } from 'react';
import { Student } from '../types/student';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { SimPageHeader } from './SimPageHeader';
import { SimFormField } from './SimFormField';
import { getSimApiUrl } from '../api';
import { simInput, simSelect, simBtnPrimary } from '../sim-ui';
import { UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { calculateIllnessPeriod } from '../utils/illness-duration';
import { SimEducationMedicalFields, type EducationTypeValue } from './SimEducationMedicalFields';
import { regions, districtsData } from '../data/uzbekistan-regions';

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
    validityPeriod: '',
    conclusionFile: null as File | null,
    phone: '',
    address: '',
    academicYear: '2025-2026',
    notes: '',
    accommodations: '',
    educationType: '' as EducationTypeValue,
    teacherName: '',
    teacherPhone: '',
    region: '',
    districtOrCity: '',
  }));
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  const availableDistricts = useMemo(() => {
    if (!selectedRegionId) return [];
    return districtsData[selectedRegionId] || [];
  }, [selectedRegionId]);

  const illnessPeriod = useMemo(() => {
    if (formData.educationType !== 'inklyuziv' || !formData.illnessType || !formData.conclusionDate) return null;
    return calculateIllnessPeriod(
      formData.illnessType,
      formData.conclusionDate,
      formData.academicYear,
    );
  }, [formData.educationType, formData.illnessType, formData.conclusionDate, formData.academicYear]);

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
    fd.append('region', formData.region || '');
    fd.append('districtOrCity', formData.districtOrCity || '');
    fd.append('illnessType', formData.illnessType || '');
    if (formData.educationType === 'uyda') {
      fd.append('conclusionDate', '');
      fd.append('illnessEndDate', formData.validityPeriod || '');
      fd.append('illnessEndDateMax', '');
    } else {
      fd.append('conclusionDate', formData.conclusionDate || '');
      if (illnessPeriod) {
        fd.append('illnessEndDate', illnessPeriod.endDate);
        if (illnessPeriod.endDateMax) fd.append('illnessEndDateMax', illnessPeriod.endDateMax);
      }
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
          validityPeriod: '',
          conclusionFile: null,
          phone: '',
          address: '',
          academicYear: '2025-2026',
          notes: '',
          accommodations: '',
          educationType: '',
          teacherName: '',
          teacherPhone: '',
          region: '',
          districtOrCity: '',
        });
        setSelectedRegionId(null);
      })
      .catch(() => {
        toast.error('Tarmoq xatosi. Iltimos, qaytadan urinib ko\'ring');
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'educationType') {
      setFormData(prev => ({
        ...prev,
        educationType: value as EducationTypeValue,
        illnessType: '',
        conclusionDate: '',
        validityPeriod: '',
        conclusionFile: null,
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = parseInt(e.target.value, 10);
    const region = regions.find(r => r.id === regionId);
    setSelectedRegionId(Number.isNaN(regionId) ? null : regionId);
    setFormData(prev => ({
      ...prev,
      region: region?.name || '',
      districtOrCity: '',
    }));
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !text-gray-600">
          <SimFormField label="F.I.Sh" required className=" !text-gray-600">
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className={`${simInput} !pl-4 !text-gray-600 !placeholder-gray-600`}
              placeholder="To'liq ism sharifingizni kiriting"
              required
            />
          </SimFormField>
          <SimFormField label="Ta'lim turi" required>
            <select
              id="educationType"
              name="educationType"
              value={formData.educationType}
              onChange={handleChange}
              className={`${simSelect} !pl-4`}
              required
            >
              <option value="">Tanlang</option>
              <option value="uyda">Inklyuziv ta'lim</option>
              <option value="inklyuziv">Uyda ta'lim</option>

            </select>
          </SimFormField>

          {(user?.role === 'direktor' || user?.role === 'admin') && (
            <SimEducationMedicalFields
              educationType={formData.educationType}
              illnessType={formData.illnessType}
              conclusionDate={formData.conclusionDate}
              validityPeriod={formData.validityPeriod}
              conclusionFile={formData.conclusionFile}
              academicYear={formData.academicYear}
              onChange={handleChange}
              onFileChange={handleFileChange}
              fileInputId="conclusionFile"
              filePlaceholder="PDF fayl tanlang"
            />
          )}

          <SimFormField label="Tug'ilgan sana" required>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              className={`${simInput} !pl-4`}
              required
            />
          </SimFormField>

          <SimFormField label="Sinf" required>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className={`${simSelect} !pl-4`}
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
                  className={`${simInput} !pl-4 !placeholder-gray-600`}
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
                  className={`${simInput} !pl-4 !placeholder-gray-600`}
                  placeholder="+998 90 123 45 67"
                />
              </SimFormField>
            </>
          )}

          <SimFormField label="Ota-ona yoki oʻrnini bosuvchi shaxs telefon raqami" required>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`${simInput} !pl-4 !placeholder-gray-600`}
              placeholder="+998 90 123 45 67"
              required
            />
          </SimFormField>

        

          {user?.role === 'direktor' && (
            <>
              <SimFormField label="Viloyat" required className="md:col-start-1">
                <select
                  value={selectedRegionId || ''}
                  onChange={handleRegionChange}
                  className={`${simSelect} !pl-4`}
                  required
                >
                  <option value="">Viloyatni tanlang</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </SimFormField>

              <SimFormField label="Tuman/Shahar" required>
                <select
                  name="districtOrCity"
                  value={formData.districtOrCity}
                  onChange={handleChange}
                  className={`${simSelect} !pl-4`}
                  required
                  disabled={!selectedRegionId}
                >
                  <option value="">
                    {selectedRegionId ? 'Tuman/Shaharni tanlang' : 'Avval viloyatni tanlang'}
                  </option>
                  {availableDistricts.map((district, i) => (
                    <option key={`${district}-${i}`} value={district}>{district}</option>
                  ))}
                </select>
              </SimFormField>
            </>
          )}

          <SimFormField label="Manzil" required className="md:col-span-2">
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={`${simInput} !pl-4 !placeholder-gray-600`}
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
              className={`${simSelect} !pl-4`}
              required
            >
              <option value="2026-2027">2026-2027</option>
            </select>
          </SimFormField>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className={`${simBtnPrimary} bg-gradient-to-r ${theme.gradient} !text-gray-600 !p-4 ${theme.gradientHover} hover:shadow-lg`}
          >
            <UserPlus className="w-5 h-5" />
            O&apos;quvchi qo&apos;shish
          </button>
        </div>
      </form>
    </div>
  );
}
