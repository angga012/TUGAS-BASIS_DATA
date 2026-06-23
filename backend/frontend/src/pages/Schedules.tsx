import { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { fetchSchedules } from '../services/api';

export default function Schedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ field_id: '', available_date: '', start_time: '', end_time: '' });

const loadSchedules = async () => {
  setLoading(true);
  try {
    const data = await fetchSchedules(); 
    console.log("DEBUG API:", data);
    
    const result = Array.isArray(data) ? data : (data.data || []);
    setSchedules(result);
  } catch (err) {
    console.error("Failed to load schedules", err);
    setSchedules([]); 
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API expects available_date (DATE), start_time (TIMESTAMP), end_time (TIMESTAMP)
      // We will combine date and time for timestamps
      const startDateTime = `${formData.available_date}T${formData.start_time}:00`;
      const endDateTime = `${formData.available_date}T${formData.end_time}:00`;
      
      const payload = {
        field_id: Number(formData.field_id),
        available_date: formData.available_date,
        start_time: startDateTime,
        end_time: endDateTime
      };

      const res = await fetch('http://localhost:5000/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ field_id: '', available_date: '', start_time: '', end_time: '' });
        loadSchedules();
      } else {
        alert('Gagal menambah jadwal');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <SidebarLayout 
      pageTitle="Manajemen Jadwal" 
      searchPlaceholder="Cari jadwal..."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Jadwal Lapangan</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            + Tambah Jadwal
          </button>
        </div>

        {/* Modal Tambah Jadwal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
              <h3 className="text-lg font-bold mb-4">Tambah Jadwal Baru</h3>
              <form onSubmit={handleAddSchedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">ID Lapangan</label>
                  <input type="number" required value={formData.field_id} onChange={e => setFormData({...formData, field_id: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" placeholder="Contoh: 1" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tanggal</label>
                  <input type="date" required value={formData.available_date} onChange={e => setFormData({...formData, available_date: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Jam Mulai</label>
                    <input type="time" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Jam Selesai</label>
                    <input type="time" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" />
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

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-50">
                <th className="pb-4">Tanggal</th>
                <th className="pb-4">Waktu</th>
                <th className="pb-4">Lapangan</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-4 text-center">Memuat data...</td></tr>
              ) : schedules.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-center">Belum ada jadwal.</td></tr>
              ) : (
                (schedules || []).map((s:any)=>(
                  <tr key={s.schedule_id} className="text-xs">
                    <td className="py-4 font-bold text-slate-800">{new Date(s.available_date).toLocaleDateString()}</td>
                    <td className="py-4 text-slate-500">
                      {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(s.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 text-slate-500">
                      Field ID: {s.field_id} {/* Ideally join with field name in backend */}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 font-bold rounded-lg text-[9px] ${s.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
