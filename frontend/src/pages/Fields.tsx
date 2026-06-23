//test


import { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { fetchFields } from '../services/api';

export default function Fields() {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ field_name: '', price_per_hour: 100000, capacity: 10, field_type: 'Vinyl' });

  const loadFields = async () => {
  setLoading(true);

  try {
    const data = await fetchFields();

    console.log("FIELDS API:", data);

    setFields(
      Array.isArray(data)
        ? data
        : data.data || []
    );

  } catch (err) {

    console.error("Failed to load fields", err);

    setFields([]);

  } finally {

    setLoading(false);

  }
};

  useEffect(() => {
    loadFields();
  }, []);

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ field_name: '', price_per_hour: 100000, capacity: 10, field_type: 'Vinyl' });
        loadFields();
      } else {
        alert('Gagal menambah lapangan');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <SidebarLayout 
      pageTitle="Manajemen Lapangan" 
      searchPlaceholder="Cari berdasarkan tipe lantai atau nomor lapangan..."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Daftar Lapangan Futsal</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            + Tambah Lapangan
          </button>
        </div>

        {/* Modal Tambah Lapangan */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
              <h3 className="text-lg font-bold mb-4">Tambah Lapangan Baru</h3>
              <form onSubmit={handleAddField} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nama Lapangan</label>
                  <input type="text" required value={formData.field_name} onChange={e => setFormData({...formData, field_name: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" placeholder="Contoh: Lapangan A" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tipe Lapangan</label>
                  <select value={formData.field_type} onChange={e => setFormData({...formData, field_type: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm">
                    <option value="Vinyl">Vinyl</option>
                    <option value="Sintetis">Rumput Sintetis</option>
                    <option value="Interlock">Interlock</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Harga / Jam</label>
                    <input type="number" required value={formData.price_per_hour} onChange={e => setFormData({...formData, price_per_hour: Number(e.target.value)})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Kapasitas</label>
                    <input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <p>Memuat data...</p>
          ) : fields.length === 0 ? (
            <p>Belum ada lapangan.</p>
          ) : (
            fields.map((f:any)=>(
              <div key={f.field_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                <div className="h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-3xl">
                  {f.field_type?.toLowerCase().includes('sintetis') ? '🌿' : '⚽'}
                </div>
                <h4 className="font-bold text-lg text-slate-900">{f.field_name}</h4>
                <p className="text-sm text-slate-500 mb-3">{f.field_type} - Rp {Number(f.price_per_hour).toLocaleString()}/jam</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {f.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded">ID: {f.field_id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
