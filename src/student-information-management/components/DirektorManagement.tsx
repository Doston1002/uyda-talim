import { useState, useMemo } from 'react';
import { useSimAuth } from '../contexts/SimAuthContext';
import { Direktor } from '../types/direktor';
import { regions, districtsData } from '../data/uzbekistan-regions';
import { getSimRoleTheme } from '../theme';
import { SimPageHeader } from './SimPageHeader';
import { SimEmptyState } from './SimEmptyState';
import { SimModal } from './SimModal';
import { SimFormField, simBaseInputClass } from './SimFormField';
import { simSelect, simBtnPrimary, simBtnSecondary } from '../sim-ui';
import { UserPlus, Edit2, Trash2, UserCog, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function DirektorManagement() {
  const { direktorlar, addDirektor, updateDirektor, deleteDirektor } = useSimAuth();
  const theme = getSimRoleTheme('admin');
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    schoolName: '',
    phone: '',
    region: '',
    districtOrCity: '',
  });

  const availableDistricts = useMemo(() => {
    if (!selectedRegionId) return [];
    return districtsData[selectedRegionId] || [];
  }, [selectedRegionId]);

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      schoolName: '',
      phone: '',
      region: '',
      districtOrCity: '',
    });
    setSelectedRegionId(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const existingDirektor = direktorlar.find(d => d.id === editingId);
      await updateDirektor(editingId, {
        ...formData,
        id: editingId,
        createdAt: existingDirektor?.createdAt || new Date().toISOString(),
      });
      resetForm();
      return;
    }

    const newDirektor: Direktor = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    await addDirektor(newDirektor);
    resetForm();
  };

  const handleEdit = (direktor: Direktor) => {
    const region = regions.find(r => r.name === direktor.region);
    setFormData({
      fullName: direktor.fullName,
      email: direktor.email,
      password: direktor.password,
      schoolName: direktor.schoolName,
      phone: direktor.phone,
      region: direktor.region,
      districtOrCity: direktor.districtOrCity,
    });
    setSelectedRegionId(region?.id || null);
    setEditingId(direktor.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Direktorni o\'chirishni xohlaysizmi?')) {
      deleteDirektor(id);
      toast.success('Direktor o\'chirildi');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = parseInt(e.target.value);
    const region = regions.find(r => r.id === regionId);
    setSelectedRegionId(regionId);
    setFormData(prev => ({
      ...prev,
      region: region?.name || '',
      districtOrCity: ''
    }));
  };

  return (
    <div className="space-y-6">
      <SimPageHeader
        title="Direktorlar boshqaruvi"
        subtitle="Maktab direktorlarini qo'shish va tahrirlash"
        role="admin"
        count={direktorlar.length}
        countLabel="ta direktor"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className={`${simBtnPrimary} bg-gradient-to-r ${theme.gradient} ${theme.gradientHover}`}
          >
            <UserPlus className="w-5 h-5" />
            Direktor qo&apos;shish
          </button>
        }
      />

      {showForm && (
        <SimModal
          title={editingId ? 'Direktorni tahrirlash' : "Direktor qo'shish"}
          onClose={resetForm}
          maxWidth="max-w-3xl"
          footer={
            <>
              <button
                type="button"
                onClick={resetForm}
                className={simBtnSecondary}
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                form="direktor-form"
                className={`${simBtnPrimary} bg-gradient-to-r ${theme.gradient} ${theme.gradientHover}`}
              >
                {editingId ? 'Yangilash' : "Qo'shish"}
              </button>
            </>
          }
        >
          <form id="direktor-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimFormField label="F.I.Sh" required className="md:col-span-2">
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={simBaseInputClass}
                  required
                />
              </SimFormField>

              <SimFormField label="Viloyat" required>
                <select
                  value={selectedRegionId || ''}
                  onChange={handleRegionChange}
                  className={simSelect}
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
                  className={simSelect}
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

              <SimFormField label="Maktab nomi" required>
                <input
                  name="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className={simBaseInputClass}
                  required
                />
              </SimFormField>

              <SimFormField label="Telefon" required>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={simBaseInputClass}
                  placeholder="+998 90 123 45 67"
                  required
                />
              </SimFormField>

              <SimFormField label="Email" required>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={simBaseInputClass}
                  placeholder="email@example.com"
                  required
                />
              </SimFormField>

              <SimFormField label="Parol" required>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`${simBaseInputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </SimFormField>
            </div>
          </form>
        </SimModal>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">F.I.Sh</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Email</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Maktab</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Viloyat</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Tuman/Shahar</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Telefon</th>
                <th className="text-left py-4 px-5 font-bold text-gray-800 text-base">Amallar</th>
              </tr>
            </thead>
            <tbody>
                {direktorlar.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <SimEmptyState
                      icon={UserCog}
                      title="Direktorlar yo'q"
                      description="Yangi direktor qo'shish uchun yuqoridagi tugmani bosing"
                    />
                  </td>
                </tr>
              ) : (
                direktorlar.map((direktor, i) => (
                  <tr key={direktor.id || direktor.email || `direktor-${i}`} className="border-b border-gray-100 hover:bg-indigo-50/50 transition-all">
                    <td className="py-4 px-5 font-medium text-gray-900 text-base">{direktor.fullName}</td>
                    <td className="py-4 px-5 text-gray-700 text-base">{direktor.email}</td>
                    <td className="py-4 px-5 text-gray-700 text-base">{direktor.schoolName}</td>
                    <td className="py-4 px-5 text-gray-700 text-base">{direktor.region}</td>
                    <td className="py-4 px-5 text-gray-700 text-base">{direktor.districtOrCity}</td>
                    <td className="py-4 px-5 text-gray-700 text-base">{direktor.phone}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(direktor)}
                          className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(direktor.id)}
                          className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-xl text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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
