import { useMemo, useState } from 'react';
import { Student } from '../types/student';
import { useSimAuth } from '../contexts/SimAuthContext';
import { getSimRoleTheme } from '../theme';
import { SimModal } from './SimModal';
import { SimFormField } from './SimFormField';
import { getSimApiUrl } from '../api';
import { simInput, simSelect, simBtnPrimary, simBtnSecondary } from '../sim-ui';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { calculateIllnessPeriod } from '../utils/illness-duration';
import { SimEducationMedicalFields, type EducationTypeValue } from './SimEducationMedicalFields';
import { regions, districtsData } from '../data/uzbekistan-regions';

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
    validityPeriod: student.educationType === 'uyda' ? (student.illnessEndDate || '') : '',
    conclusionFile: null as File | null,
    phone: student.phone || '',
    address: student.address || '',
    academicYear: student.academicYear || '2025-2026',
    notes: student.notes || '',
    accommodations: student.accommodations || '',
    educationType: (student.educationType || '') as EducationTypeValue,
    teacherName: student.teacherName || '',
    teacherPhone: student.teacherPhone || '',
    region: student.region || '',
    districtOrCity: student.districtOrCity || '',
  }));
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(() => {
    const region = regions.find(r => r.name === student.region);
    return region?.id ?? null;
  });

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
      region: formData.region || '',
      districtOrCity: formData.districtOrCity || '',
    };

    if (formData.educationType === 'uyda') {
      payload.conclusionDate = '';
      payload.illnessEndDate = formData.validityPeriod || '';
      payload.illnessEndDateMax = '';
    } else if (illnessPeriod) {
      payload.conclusionDate = formData.conclusionDate || '';
      payload.illnessEndDate = illnessPeriod.endDate;
      if (illnessPeriod.endDateMax) payload.illnessEndDateMax = illnessPeriod.endDateMax;
    } else {
      payload.conclusionDate = formData.conclusionDate || '';
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
          <button type="button" onClick={onClose} className={`${simBtnSecondary} !text-gray-600 !p-3`} disabled={isSaving}>
            Bekor qilish
          </button>
          <button
            type="submit"
            form="edit-student-form"
            disabled={isSaving}
            className={`${simBtnPrimary} bg-gradient-to-r !text-gray-600 !p-3 ${theme.gradient} ${theme.gradientHover}`}
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </>
      }
    >
      <form id="edit-student-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SimFormField label="F.I.Sh" required className="!text-gray-600">
          <input
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="To'liq ism sharifingizni kiriting"
            className={`${simInput} !text-gray-600 !pl-4 !placeholder-gray-600`}
            required
          />
        </SimFormField>

        <SimFormField label="Ta'lim turi" required>
          <select
            name="educationType"
            value={formData.educationType}
            onChange={handleChange}
            className={`${simSelect} !pl-4 !text-gray-600 !placeholder-gray-600`}
            required
          >
            <option value="">Tanlang</option>
            <option value="inklyuziv">Uyda ta'lim</option>
            <option value="uyda">Inklyuziv ta'lim</option>
          </select>
        </SimFormField>

        <SimEducationMedicalFields
          educationType={formData.educationType}
          illnessType={formData.illnessType}
          conclusionDate={formData.conclusionDate}
          validityPeriod={formData.validityPeriod}
          conclusionFile={formData.conclusionFile}
          academicYear={formData.academicYear}
          onChange={handleChange}
          onFileChange={handleFileChange}
          fileInputId="editConclusionFile"
          filePlaceholder="Yangi PDF fayl (ixtiyoriy)"
        />

        <SimFormField label="Tug'ilgan sana" required>
          <input
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            className={`${simInput} !pl-4 !text-gray-600 !placeholder-gray-600`}
            required
          />
        </SimFormField>

        <SimFormField label="Sinf" required>
          <select name="class" value={formData.class} onChange={handleChange} className={`${simSelect} !pl-4 !text-gray-600 !placeholder-gray-600`} required>
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
                className={`${simInput} !pl-4 !text-gray-600 !placeholder-gray-600`}
              />
            </SimFormField>
            <SimFormField label="O'qituvchi telefoni">
              <input
                name="teacherPhone"
                type="number"
                value={formData.teacherPhone}
                onChange={handleChange}
                className={`${simInput} !pl-4 !text-gray-600 !placeholder-gray-600`}
              />
            </SimFormField>
          </>
        )}

        <SimFormField label="Ota-ona yoki oʻrnini bosuvchi shaxs telefon raqami" required>
          <input
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            className={`${simInput} !pl-4 !text-gray-600 !placeholder-gray-600`}
            required
          />
        </SimFormField>

        {user?.role === 'direktor' && (
          <>
            <SimFormField label="Yashash manzilingizni tanlang" required className="md:col-start-1">
              <select
                value={selectedRegionId || ''}
                onChange={handleRegionChange}
                className={`${simSelect} !pl-4 !text-gray-600`}
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
                className={`${simSelect} !pl-4 !text-gray-600`}
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
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={`${simInput} !pl-4 !text-gray-600 !placeholder-gray-600`}
            required
          />
        </SimFormField>

        <SimFormField label="O'quv yili" required>
          <select
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className={`${simSelect} !pl-4 !text-gray-600 !placeholder-gray-600`}
            required
          >
            <option value="2026-2027">2026-2027</option>
            </select>
          </SimFormField>
      </form>
    </SimModal>
  );
}
