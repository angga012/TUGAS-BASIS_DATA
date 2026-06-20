import { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';

export default function Bookings() {
  const [formData, setFormData] = useState({
    customer_id: '',
    field_id: '',
    booking_date: '',
    duration: 1,
    price_total: 150000,
    payment_method: 'Cash',
    bank_name: '',
    wallet_type: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Booking berhasil dibuat!');
      } else {
        setMessage(`Error: ${data.message || 'Gagal membuat booking'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout 
      pageTitle="Reservasi Baru" 
      searchPlaceholder="Cari..."
    >
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Formulir Reservasi</h3>
        {message && (
          <div className={`p-4 mb-6 rounded-xl font-medium text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Customer ID</label>
              <input 
                type="number" 
                required 
                value={formData.customer_id}
                onChange={e => setFormData({...formData, customer_id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Field ID</label>
              <input 
                type="number" 
                required 
                value={formData.field_id}
                onChange={e => setFormData({...formData, field_id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Booking</label>
            <input 
              type="date" 
              required 
              value={formData.booking_date}
              onChange={e => setFormData({...formData, booking_date: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Durasi (Jam)</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Harga Total Estimasi (Rp)</label>
              <input 
                type="number" 
                required 
                value={formData.price_total}
                onChange={e => setFormData({...formData, price_total: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Metode Pembayaran</label>
            <select 
              value={formData.payment_method}
              onChange={e => setFormData({...formData, payment_method: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer Bank</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          {formData.payment_method === 'Transfer' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Bank</label>
              <input 
                type="text" 
                required 
                value={formData.bank_name}
                onChange={e => setFormData({...formData, bank_name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
          )}

          {formData.payment_method === 'E-Wallet' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Wallet (Gopay/OVO/etc)</label>
              <input 
                type="text" 
                required 
                value={formData.wallet_type}
                onChange={e => setFormData({...formData, wallet_type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
          >
            {loading ? 'Memproses...' : 'Buat Reservasi Sekarang'}
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
}
