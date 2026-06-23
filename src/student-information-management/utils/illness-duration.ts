import type { IllnessDurationType } from '../data/illness-types';
import { getIllnessById } from '../data/illness-types';
import type { Student } from '../types/student';

export interface IllnessPeriodResult {
  startDate: string;
  endDate: string;
  endDateMax?: string;
  durationLabel: string;
  isRange: boolean;
}

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDateUz(date: Date): string {
  return date.toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/** O'quv yili: 2-sentabrdan 25-maygacha */
export function getAcademicYearBounds(academicYear: string): { start: Date; end: Date } | null {
  const match = academicYear.match(/^(\d{4})-(\d{4})$/);
  if (!match) return null;

  const startYear = Number(match[1]);
  const endYear = Number(match[2]);
  if (endYear !== startYear + 1) return null;

  return {
    start: new Date(startYear, 8, 2),
    end: new Date(endYear, 4, 25),
  };
}

function resolveAcademicYearEnd(conclusionDate: Date, academicYear?: string): Date {
  if (academicYear) {
    const bounds = getAcademicYearBounds(academicYear);
    if (bounds) {
      if (conclusionDate <= bounds.end) {
        return bounds.end;
      }
      const nextYear = `${bounds.end.getFullYear()}-${bounds.end.getFullYear() + 1}`;
      const nextBounds = getAcademicYearBounds(nextYear);
      if (nextBounds) return nextBounds.end;
    }
  }

  const year = conclusionDate.getFullYear();
  const month = conclusionDate.getMonth();
  const day = conclusionDate.getDate();

  // Sentabr 2 dan keyin yoki 2-sentabr — joriy o'quv yili tugashi keyingi yil 25-may
  if (month > 8 || (month === 8 && day >= 2)) {
    return new Date(year + 1, 4, 25);
  }

  // 25-maygacha — shu yilning 25-mayi
  if (month < 4 || (month === 4 && day <= 25)) {
    return new Date(year, 4, 25);
  }

  // Yozgi ta'til: keyingi o'quv yili tugashi
  return new Date(year + 1, 4, 25);
}

export function calculateIllnessPeriod(
  illnessTypeId: string,
  conclusionDate: string,
  academicYear?: string,
): IllnessPeriodResult | null {
  const illness = getIllnessById(illnessTypeId);
  const start = parseDateInput(conclusionDate);
  if (!illness || !start) return null;

  return calculatePeriodByDuration(illness.duration, illness.durationLabel, start, academicYear);
}

function calculatePeriodByDuration(
  duration: IllnessDurationType,
  durationLabel: string,
  start: Date,
  academicYear?: string,
): IllnessPeriodResult {
  const startIso = toIsoDate(start);

  if (duration === '6_months') {
    const end = addMonths(start, 6);
    return {
      startDate: startIso,
      endDate: toIsoDate(end),
      durationLabel,
      isRange: false,
    };
  }

  if (duration === 'academic_year') {
    const end = resolveAcademicYearEnd(start, academicYear);
    return {
      startDate: startIso,
      endDate: toIsoDate(end),
      durationLabel,
      isRange: false,
    };
  }

  const endMin = addMonths(start, 6);
  const endMax = addMonths(start, 12);
  return {
    startDate: startIso,
    endDate: toIsoDate(endMin),
    endDateMax: toIsoDate(endMax),
    durationLabel,
    isRange: true,
  };
}

export function formatIllnessPeriodDisplay(period: IllnessPeriodResult): string {
  const start = formatDateUz(parseDateInput(period.startDate)!);
  if (period.isRange && period.endDateMax) {
    const endMin = formatDateUz(parseDateInput(period.endDate)!);
    const endMax = formatDateUz(parseDateInput(period.endDateMax)!);
    return `${start} — ${endMin} / ${endMax} (${period.durationLabel})`;
  }
  const end = formatDateUz(parseDateInput(period.endDate)!);
  return `${start} — ${end} (${period.durationLabel})`;
}

export function getStudentPeriodEnd(student: Student): Date | null {
  let endIso: string | null = null;

  if (student.illnessEndDateMax) {
    endIso = student.illnessEndDateMax;
  } else if (student.illnessEndDate) {
    endIso = student.illnessEndDate;
  } else if (student.illnessType && student.conclusionDate) {
    const period = calculateIllnessPeriod(
      student.illnessType,
      student.conclusionDate,
      student.academicYear,
    );
    if (period) {
      endIso = period.endDateMax || period.endDate;
    }
  }

  const parsed = endIso ? parseDateInput(endIso) : null;
  if (!parsed) return null;

  parsed.setHours(23, 59, 59, 999);
  return parsed;
}

/** Amal qilish muddati tugashiga 1 oydan kam qolgan yoki muddati o'tgan */
export function isStudentPeriodExpiringSoon(student: Student, now = new Date()): boolean {
  const endDate = getStudentPeriodEnd(student);
  if (!endDate) return false;

  const diffMs = endDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}

export function getStudentPeriodDaysRemaining(student: Student, now = new Date()): number | null {
  const endDate = getStudentPeriodEnd(student);
  if (!endDate) return null;

  const diffMs = endDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
