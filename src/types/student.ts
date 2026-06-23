export interface Student {
  id: string;
  fullName: string;
  birthDate: string;
  class: string;
  schoolName: string;
  phone: string;
  address: string;
  academicYear: string;
  notes: string;
  accommodations: string;
  educationType: 'inklyuziv' | 'uyda';
  region?: string;
  districtOrCity?: string;
  teacherName?: string;
  teacherPhone?: string;
  illnessType?: string;
  conclusionDate?: string;
  illnessEndDate?: string;
  illnessEndDateMax?: string;
  uploadedFiles?: Array<{ originalname?: string; filename: string; path?: string; url?: string; mimetype?: string; size?: number }>;
  createdBy: string;
  createdAt: string;
}
