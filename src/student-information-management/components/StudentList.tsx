import { useState, useMemo } from 'react';
import { Student } from '../types/student';
import { useSimAuth } from '../contexts/SimAuthContext';
import { SimPageHeader } from './SimPageHeader';
import { SimEmptyState } from './SimEmptyState';
import { Search, Download, FileText, Eye, Trash2, Users, X } from 'lucide-react';
import { simInput, simSelect, simLabelSm, simBtnPrimary } from '../sim-ui';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface StudentListProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentList({ students, onViewStudent, onDeleteStudent }: StudentListProps) {
  const { user } = useSimAuth();
  const isAdmin = user?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [illnessFilter, setIllnessFilter] = useState('all');

  const handleDelete = (id: string) => {
    if (confirm('O\'quvchini o\'chirishni xohlaysizmi?')) {
      onDeleteStudent(id);
      toast.success('O\'quvchi o\'chirildi');
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
  }, [students, searchTerm, yearFilter, classFilter, schoolFilter]);

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
    return Array.from(new Set(students.map(s => s.illnessType).filter(Boolean))).sort();
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
      base['Kasallik turi'] = student.illnessType || '';
      base['Xulosa sanasi'] = student.conclusionDate || '';

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
    headers.push('Kasallik turi', 'Xulosa sanasi');

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
      row.push(student.illnessType || '', student.conclusionDate || '');

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
  };


  return (
    <div className="space-y-5">
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
              className={`${simBtnPrimary} bg-green-600 hover:bg-green-700 px-5`}
            >
              <Download className="w-5 h-5" />
              Excel yuklab olish
            </button>
            <button
              onClick={exportToPDF}
              className={`${simBtnPrimary} bg-red-500 hover:bg-red-600 px-5`}
            >
              <FileText className="w-5 h-5" />
              PDF yuklab olish
            </button>
          </>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter toolbar */}
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold text-gray-700">Qidiruv va filtrlar</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5" />
                Filtrlarni tozalash
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
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
                      <option key={`${ill}-${i}`} value={ill}>{ill}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-1">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">F.I.Sh</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Sinf</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Maktab</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Ta&apos;lim turi</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">O&apos;quv yili</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Amallar</th>
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
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-b border-gray-100 transition-all ${
                      user?.role === 'admin'
                        ? 'hover:bg-indigo-50/50'
                        : 'hover:bg-emerald-50/50'
                    }`}
                  >
                    <td className="py-4 px-5 font-medium text-gray-900 text-base">{student.fullName}</td>
                    <td className="py-4 px-5 text-gray-700 text-base">{student.class}</td>
                    <td className="py-4 px-5 text-gray-700 text-base">{student.schoolName}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex px-3 py-1.5 rounded-xl font-semibold text-sm ${
                        student.educationType === 'inklyuziv'
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                      }`}>
                        {student.educationType === 'inklyuziv' ? 'Inklyuziv' : 'Uyda'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-700 text-base">{student.academicYear}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewStudent(student)}
                          className={`inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl text-base font-medium transition-all ${
                            isAdmin
                              ? 'text-indigo-600 hover:bg-indigo-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          <Eye className="w-5 h-5" />
                          Ko&apos;rish
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-xl text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
