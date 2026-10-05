import { useMemo } from 'react';
import { FileText, CalendarClock } from 'lucide-react';
import { SimFormField } from './SimFormField';
import { simInput, simSelect, simFileUpload } from '../sim-ui';
import { ILLNESS_TYPES, type IllnessTypeOption, groupByCategory } from '../data/illness-types';
import { UYDA_ILLNESS_TYPES, type UydaIllnessTypeOption } from '../data/uyda-illness-types';
import { calculateIllnessPeriod, formatIllnessPeriodDisplay } from '../utils/illness-duration';

export type EducationTypeValue = '' | 'inklyuziv' | 'uyda';

interface SimEducationMedicalFieldsProps {
  educationType: EducationTypeValue;
  illnessType: string;
  conclusionDate: string;
  validityPeriod: string;
  conclusionFile: File | null;
  academicYear: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputId: string;
  filePlaceholder: string;
}

export function SimEducationMedicalFields({
  educationType,
  illnessType,
  conclusionDate,
  validityPeriod,
  conclusionFile,
  academicYear,
  onChange,
  onFileChange,
  fileInputId,
  filePlaceholder,
}: SimEducationMedicalFieldsProps) {
  const isInklyuziv = educationType === 'inklyuziv';
  const isUyda = educationType === 'uyda';

  const illnessPeriod = useMemo(() => {
    if (!isInklyuziv || !illnessType || !conclusionDate) return null;
    return calculateIllnessPeriod(illnessType, conclusionDate, academicYear);
  }, [isInklyuziv, illnessType, conclusionDate, academicYear]);

  const selectedIllness = useMemo(
    () => (isInklyuziv ? ILLNESS_TYPES.find(item => item.id === illnessType) : undefined),
    [isInklyuziv, illnessType],
  );

  if (!isInklyuziv && !isUyda) return null;

  return (
    <>
      <SimFormField label="Kasallik turi" className="md:col-span-2 !text-gray-600">
        <select
          id="illnessType"
          name="illnessType"
          value={illnessType}
          onChange={onChange}
          className={`${simSelect} !pl-4`}
        >
          <option value="">Tanlang</option>
          {isInklyuziv
            ? groupByCategory(ILLNESS_TYPES).map((group, groupIndex) => (
                <optgroup key={group.category} label={`${groupIndex + 1}. ${group.category}`}>
                  {group.items.map((item: IllnessTypeOption) => (
                    <option key={item.id} value={item.id}>
                      {item.label} ({item.durationLabel})
                    </option>
                  ))}
                </optgroup>
              ))
            : groupByCategory(UYDA_ILLNESS_TYPES).map((group, groupIndex) => (
                <optgroup key={group.category} label={`${groupIndex + 1}. ${group.category}`}>
                  {group.items.map((item: UydaIllnessTypeOption) => (
                    <option key={item.id} value={item.id}>
                      {item.number}. {item.label} ({item.icd10})
                    </option>
                  ))}
                </optgroup>
              ))}
        </select>
      </SimFormField>

      {isInklyuziv && selectedIllness && (
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

      {isInklyuziv ? (
        <SimFormField label="Xulosa berilgan sana">
          <input
            id="conclusionDate"
            name="conclusionDate"
            type="date"
            value={conclusionDate}
            onChange={onChange}
            className={`${simInput} !pl-4 !placeholder-gray-600 !text-gray-600`}
          />
        </SimFormField>
      ) : (
        <SimFormField label="Amal qilish muddati">
          <input
            id="validityPeriod"
            name="validityPeriod"
            type="text"
            value={validityPeriod}
            onChange={onChange}
            className={`${simInput} !pl-4 !placeholder-gray-600`}
            placeholder="Amal qilish muddatini kiriting"
          />
        </SimFormField>
      )}

      {isInklyuziv && illnessPeriod && (
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

      <SimFormField label="Xulosa (PDF)" className={isInklyuziv && illnessPeriod ? '' : 'md:col-span-1'}>
        <label htmlFor={fileInputId} className={simFileUpload}>
          <FileText className="w-5 h-5 shrink-0" />
          <span className="truncate">
            {conclusionFile ? conclusionFile.name : filePlaceholder}
          </span>
        </label>
        <input
          id={fileInputId}
          name="conclusionFile"
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          className="sr-only"
        />
      </SimFormField>
    </>
  );
}
