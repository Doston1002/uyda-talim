import { useState, useMemo, useEffect } from 'react';
import { Student } from '../types/student';
import { useSimAuth } from '../contexts/SimAuthContext';
import { SimPageHeader } from './SimPageHeader';
import { SimEmptyState } from './SimEmptyState';
import { Search, Download, FileText, Eye, Trash2, Users, X, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { simInput, simSelect, simLabelSm, simBtnPrimary } from '../sim-ui';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getIllnessLabel } from '../data/illness-types';
import { calculateIllnessPeriod, isStudentPeriodExpiringSoon, getStudentPeriodDaysRemaining } from '../utils/illness-duration';
import { EditStudent } from './EditStudent';

interface StudentListProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStudent: (student: Student) => void;
}

const PAGE_SIZE = 10;

export function StudentList({ students, onViewStudent, onDeleteStudent, onUpdateStudent }: StudentListProps) {
  const { user } = useSimAuth();
  const isAdmin = user?.role === 'admin';
  const canSeeExpiryHighlight = user?.role === 'admin' || user?.role === 'direktor';
  const canManageStudents = canSeeExpiryHighlight;
  const canPaginate = canSeeExpiryHighlight;
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [illnessFilter, setIllnessFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const getIllnessEndDisplay = (student: Student): string => {
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
      if (!period) return '';
      if (period.isRange && period.endDateMax) {
        return `${period.endDate} — ${period.endDateMax}`;
      }
      return period.endDate;
    }
    return '';
  };

  const handleDelete = (id: string) => {
    if (confirm('O\'quvchini o\'chirishni xohlaysizmi?')) {
      onDeleteStudent(id);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = (student.fullName || '').toString();
      const school = (student.schoolName || '').toString();
      const cls = (student.class || '').toString();

      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear = yearFilter === 'all' || student.academicYear === yearFilter;
      const matchesClass = classFilter === 'all' || (student.class || '') === classFilter;
      const matchesRegion = regionFilter === 'all' || (student.region || '') === regionFilter;
      const matchesDistrict = districtFilter === 'all' || (student.districtOrCity || '') === districtFilter;
      const matchesIllness = illnessFilter === 'all' || (student.illnessType || '') === illnessFilter;
      const matchesSchool = schoolFilter === 'all' || (student.schoolName || '') === schoolFilter;

      return matchesSearch && matchesYear && matchesClass && matchesSchool && matchesRegion && matchesDistrict && matchesIllness;
    });
  }, [students, searchTerm, yearFilter, classFilter, schoolFilter, regionFilter, districtFilter, illnessFilter]);

  const totalPages = canPaginate ? Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE)) : 1;

  useEffect(() => {
    setPage(1);
  }, [searchTerm, yearFilter, classFilter, schoolFilter, regionFilter, districtFilter, illnessFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const displayedStudents = useMemo(() => {
    if (!canPaginate) return filteredStudents;
    const start = (page - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [canPaginate, filteredStudents, page]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
    return Array.from(pages)
      .filter(p => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  }, [page, totalPages]);

  const uniqueYears = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicYear))).sort();
  }, [students]);

  const uniqueClasses = useMemo(() => {
    return Array.from(new Set(students.map(s => s.class))).sort();
  }, [students]);

  const uniqueSchools = useMemo(() => {
    return Array.from(new Set(students.map(s => s.schoolName))).sort();
  }, [students]);

  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(students.map(s => s.region).filter(Boolean))).sort();
  }, [students]);

  const availableDistricts = useMemo(() => {
    const all = students.map(s => s.districtOrCity).filter(Boolean);
    if (regionFilter === 'all') return Array.from(new Set(all)).sort();
    return Array.from(new Set(students.filter(s => s.region === regionFilter).map(s => s.districtOrCity).filter(Boolean))).sort();
  }, [students, regionFilter]);

  const uniqueIllnesses = useMemo(() => {
    return Array.from(
      new Set(students.map(s => s.illnessType).filter((v): v is string => Boolean(v))),
    ).sort();
  }, [students]);

  

  const exportToExcel = () => {
    const data = filteredStudents.map((student) => {
      const isDirektor = user?.role === 'direktor';
      const base: any = {
        'F.I.Sh': student.fullName,
        'Tug\'ilgan sana': student.birthDate,
        'Sinf': student.class,
        'Ta\'lim turi': student.educationType === 'inklyuziv' ? 'Inklyuziv' : 'Uyda',
        'O\'quv yili': student.academicYear,
        'Telefon': student.phone,
        "O'qituvchi": student.teacherName || '',
        "O'qituvchi telefoni": student.teacherPhone || '',
        'Manzil': student.address,
        'Izoh': student.notes,
      };

      // include school/region/district only for admin
      if (!isDirektor) {
        base['Maktab'] = student.schoolName;
      }

      if (user?.role === 'admin') {
        base['Viloyat'] = student.region || '';
        base['Tuman/Shahar'] = student.districtOrCity || '';
      }

      // include medical fields for both roles
      base['Kasallik turi'] = student.illnessType ? getIllnessLabel(student.illnessType) : '';
      base['Xulosa sanasi'] = student.conclusionDate || '';
      base['Muddat tugash sanasi'] = getIllnessEndDisplay(student);

      return base;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'O\'quvchilar');
    XLSX.writeFile(wb, 'oquvchilar.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('O\'quvchilar ro\'yxati', 14, 20);

    const isDirektor = user?.role === 'direktor';

    // build headers per role
    const headers: string[] = ['F.I.Sh', 'Sinf', 'Ta\'lim turi', 'O\'quv yili'];
    if (!isDirektor) headers.splice(2, 0, 'Maktab'); // insert Maktab for non-direktor

    // teacher columns always included
    headers.push("O'qituvchi", "O'qituvchi telefoni");

    // admin gets location and medical columns appended
    if (user?.role === 'admin') {
      headers.push('Viloyat', 'Tuman/Shahar');
    }
    // medical fields appended for both roles
    headers.push('Kasallik turi', 'Xulosa sanasi', 'Muddat tugash sanasi');

    const tableData = filteredStudents.map((student) => {
      const row: any[] = [
        student.fullName,
        student.class,
      ];

      if (!isDirektor) row.push(student.schoolName);

      row.push(student.educationType === 'inklyuziv' ? 'Inklyuziv' : 'Uyda', student.academicYear);

      // teacher info
      row.push(student.teacherName || '', student.teacherPhone || '');

      if (user?.role === 'admin') {
        row.push(student.region || '', student.districtOrCity || '');
      }

      // medical
      row.push(
        student.illnessType ? getIllnessLabel(student.illnessType) : '',
        student.conclusionDate || '',
        getIllnessEndDisplay(student),
      );

      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 30,
    });

    doc.save('oquvchilar.pdf');
  };

  const hasActiveFilters =
    searchTerm ||
    yearFilter !== 'all' ||
    classFilter !== 'all' ||
    schoolFilter !== 'all' ||
    regionFilter !== 'all' ||
    districtFilter !== 'all' ||
    illnessFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setYearFilter('all');
    setClassFilter('all');
    setSchoolFilter('all');
    setRegionFilter('all');
    setDistrictFilter('all');
    setIllnessFilter('all');
    setPage(1);
  };


  return (
    <div className="space-y-5">
      {editingStudent && (
        <EditStudent
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdateStudent={updated => {
            onUpdateStudent(updated);
            setEditingStudent(null);
          }}
        />
      )}
      <SimPageHeader
        title="O'quvchilar ro'yxati"
        subtitle={isAdmin ? "Barcha maktablar bo'yicha" : "Maktabingiz bo'yicha"}
        role={user?.role}
        count={filteredStudents.length}
        countLabel="ta o'quvchi topildi"
        actions={
          <>
            <button
              onClick={exportToExcel}
              className={`${simBtnPrimary} bg-green-600 hover:bg-green-700 shadow-sm min-w-[200px] justify-center`}
            >
              <Download className="w-5 h-5" />
              Excel yuklab olish
            </button>
            <button
              onClick={exportToPDF}
              className={`${simBtnPrimary} bg-red-500 hover:bg-red-600 shadow-sm min-w-[200px] justify-center`}
            >
              <FileText className="w-5 h-5" />
              PDF yuklab olish
            </button>
          </>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <p className="text-lg font-bold text-gray-800">Qidiruv va filtrlar</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 rounded-xl text-base font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors w-full sm:w-auto"
              >
                <X className="w-5 h-5" />
                Filtrlarni tozalash
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="md:col-span-2 xl:col-span-3">
              <label className={simLabelSm}>Qidirish</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ism, maktab yoki sinf bo'yicha..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${simInput} pl-12`}
                />
              </div>
            </div>

            <div>
              <label className={simLabelSm}>O&apos;quv yili</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className={simSelect}>
                <option value="all">Barcha yillar</option>
                {uniqueYears.map((year, i) => (
                  <option key={`${year}-${i}`} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={simLabelSm}>Sinf</label>
              <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className={simSelect}>
                <option value="all">Barcha sinflar</option>
                {uniqueClasses.map((cls, i) => (
                  <option key={`${cls}-${i}`} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={simLabelSm}>Maktab</label>
              <select value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)} className={simSelect}>
                <option value="all">Barcha maktablar</option>
                {uniqueSchools.map((s, i) => (
                  <option key={`${s}-${i}`} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {isAdmin && (
              <>
                <div>
                  <label className={simLabelSm}>Viloyat</label>
                  <select
                    value={regionFilter}
                    onChange={e => { setRegionFilter(e.target.value); setDistrictFilter('all'); }}
                    className={simSelect}
                  >
                    <option value="all">Barcha viloyatlar</option>
                    {uniqueRegions.map((r, i) => (
                      <option key={`${r}-${i}`} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={simLabelSm}>Tuman/Shahar</label>
                  <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} className={simSelect}>
                    <option value="all">Barcha tuman/shahar</option>
                    {availableDistricts.map((d, i) => (
                      <option key={`${d}-${i}`} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={simLabelSm}>Kasallik turi</label>
                  <select value={illnessFilter} onChange={e => setIllnessFilter(e.target.value)} className={simSelect}>
                    <option value="all">Barcha kasalliklar</option>
                    {uniqueIllnesses.map((ill, i) => (
                      <option key={`${ill}-${i}`} value={ill}>{getIllnessLabel(ill)}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        {canSeeExpiryHighlight && filteredStudents.some(s => isStudentPeriodExpiringSoon(s)) && (
          <div className="mx-5 sm:mx-6 mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            <span className="inline-block w-3 h-3 rounded-sm bg-red-200 border border-red-400 shrink-0" />
            Qizil rang bilan belgilangan qatorlar — amal qilish muddati tugashiga 1 oydan kam vaqt qolgan yoki muddati o&apos;tgan.
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-bold text-gray-800 text-base whitespace-nowrap">F.I.Sh</th>
                <th className="text-left py-4 px-6 font-bold text-gray-800 text-base whitespace-nowrap">Sinf</th>
                <th className="text-left py-4 px-6 font-bold text-gray-800 text-base whitespace-nowrap">Maktab</th>
                <th className="text-left py-4 px-6 font-bold text-gray-800 text-base whitespace-nowrap">Ta&apos;lim turi</th>
                <th className="text-left py-4 px-6 font-bold text-gray-800 text-base whitespace-nowrap">O&apos;quv yili</th>
                <th className="text-left py-4 px-6 font-bold text-gray-800 text-base whitespace-nowrap">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <SimEmptyState
                      icon={Users}
                      title="O'quvchi topilmadi"
                      description="Qidiruv yoki filtrlarni o'zgartirib ko'ring"
                    />
                  </td>
                </tr>
              ) : (
                displayedStudents.map(student => {
                  const isExpiringSoon = canSeeExpiryHighlight && isStudentPeriodExpiringSoon(student);
                  const daysRemaining = isExpiringSoon ? getStudentPeriodDaysRemaining(student) : null;

                  return (
                  <tr
                    key={student.id}
                    className={`border-b transition-all ${
                      isExpiringSoon
                        ? 'bg-red-50 border-red-200 ring-1 ring-inset ring-red-200'
                        : `border-gray-100 ${user?.role === 'admin' ? 'hover:bg-indigo-50/50' : 'hover:bg-emerald-50/50'}`
                    }`}
                    title={
                      isExpiringSoon && daysRemaining !== null
                        ? daysRemaining > 0
                          ? `Amal qilish muddati tugashiga ${daysRemaining} kun qoldi`
                          : 'Amal qilish muddati tugagan'
                        : undefined
                    }
                  >
                    <td className="py-4 px-6 font-semibold text-gray-900 text-base">{student.fullName}</td>
                    <td className="py-4 px-6 text-gray-700 text-base">{student.class}</td>
                    <td className="py-4 px-6 text-gray-700 text-base">{student.schoolName}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-xl font-semibold text-sm ${
                          student.educationType === 'inklyuziv'
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                            : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                        }`}
                      >
                        {student.educationType === 'inklyuziv' ? 'Inklyuziv' : 'Uyda'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-base">{student.academicYear}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isExpiringSoon && daysRemaining !== null && (
                          <span className="inline-flex px-2 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">
                            {daysRemaining > 0 ? `${daysRemaining} kun` : 'Muddati tugagan'}
                          </span>
                        )}
                        <button
                          onClick={() => onViewStudent(student)}
                          className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-base font-semibold transition-all ${
                            isAdmin
                              ? 'text-indigo-600 hover:bg-indigo-50 border border-indigo-100'
                              : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-100'
                          }`}
                        >
                          <Eye className="w-5 h-5" />
                          Ko&apos;rish
                        </button>
                        {canManageStudents && (
                          <>
                            <button
                              onClick={() => setEditingStudent(student)}
                              className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-base font-semibold transition-all ${
                                isAdmin
                                  ? 'text-amber-600 hover:bg-amber-50 border border-amber-100'
                                  : 'text-amber-600 hover:bg-amber-50 border border-amber-100'
                              }`}
                            >
                              <Pencil className="w-5 h-5" />
                              Tahrirlash
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 border border-red-100 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                              O&apos;chirish
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {canPaginate && filteredStudents.length > PAGE_SIZE && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredStudents.length)}
              </span>
              {' '}/ {filteredStudents.length} ta o&apos;quvchi
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isAdmin
                    ? 'text-indigo-600 border-indigo-100 hover:bg-indigo-50'
                    : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Oldingi
              </button>

              <div className="flex items-center gap-1">
                {pageNumbers.map((pageNum, index) => {
                  const prev = pageNumbers[index - 1];
                  const showEllipsis = prev !== undefined && pageNum - prev > 1;

                  return (
                    <span key={pageNum} className="flex items-center gap-1">
                      {showEllipsis && (
                        <span className="px-1 text-gray-400 text-sm">…</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`min-w-[40px] min-h-[40px] px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                          pageNum === page
                            ? isAdmin
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-emerald-600 text-white border-emerald-600'
                            : isAdmin
                              ? 'text-indigo-600 border-indigo-100 hover:bg-indigo-50'
                              : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    </span>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isAdmin
                    ? 'text-indigo-600 border-indigo-100 hover:bg-indigo-50'
                    : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                }`}
              >
                Keyingi
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
