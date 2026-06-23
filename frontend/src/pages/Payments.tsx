import { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { fetchBookings } from '../services/api';

export default function Payments() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await fetchBookings();
        if (response.success) {
          setBookings(response.data || []);
        } else {
          setBookings(response || []);
        }
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  return (
    <SidebarLayout 
      pageTitle="Pembayaran"
      searchPlaceholder="Cari transaksi..."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Riwayat Reservasi & Pembayaran</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-50">
                <th className="pb-4">Booking ID</th>
                <th className="pb-4">Pelanggan</th>
                <th className="pb-4">Lapangan & Waktu</th>
                <th className="pb-4">Pembayaran</th>
                <th className="pb-4">Metode</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="py-4 text-center text-sm text-slate-500">Memuat data...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="py-4 text-center text-sm text-slate-500">Belum ada riwayat transaksi.</td></tr>
              ) : (
                bookings.map((b: any) => (
                  <tr key={b.booking_id} className="text-xs">
                    <td className="py-4 font-bold text-slate-800">#{b.booking_id}</td>
                    <td className="py-4">
                      <span className="font-bold text-slate-800">{b.customer_name}</span><br />
                      <span className="text-slate-500">{b.email}</span>
                    </td>
                    <td className="py-4 text-slate-600">
                      <span className="font-bold">{b.field_name}</span><br />
                      {new Date(b.booking_date).toLocaleDateString()} at {new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-emerald-600">Rp {Number(b.amount).toLocaleString()}</span><br />
                      {b.discount > 0 && <span className="text-[9px] text-indigo-500">Diskon: Rp {Number(b.discount).toLocaleString()}</span>}
                    </td>
                    <td className="py-4 font-bold text-slate-700">{b.payment_method}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 font-bold rounded-lg text-[9px] bg-emerald-50 text-emerald-600`}>
                        LUNAS
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
