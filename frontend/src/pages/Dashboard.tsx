import { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard-summary');
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        setStats(data.statistics || []);
        setTransactions(data.recentTransactions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Memuat data...</div>;

  return (
    <SidebarLayout pageTitle="Ringkasan Venue" searchPlaceholder="Cari reservasi, pelanggan...">
      <div className="space-y-6">
        {/* 5 KPI CARDS - Grid system disesuaikan dengan PRD Section 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((item, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-3xl border border-slate-100 shadow-sm ${item.color === 'bg-slate-950 text-white' ? 'bg-slate-900 text-white' : 'bg-white'}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </p>
              <h2 className="text-3xl font-extrabold mt-2">{item.val}</h2>
              <p className={`text-[11px] font-medium mt-3 ${item.color === 'bg-slate-950 text-white' ? 'text-slate-300' : 'text-slate-500'}`}>
                {item.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Tabel Transaksi - PRD Section 8 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-800">Transaksi Terbaru</h4>
            <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua →</a>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-50">
                <th className="pb-4">Pelanggan</th>
                <th className="pb-4">Lapangan</th>
                <th className="pb-4">Waktu</th>
                <th className="pb-4">Jumlah</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx, i) => (
                <tr key={i} className="text-xs">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                      {tx.initial}
                    </div>
                    <span className="font-bold text-slate-800">{tx.name}</span>
                  </td>
                  <td className="py-4 text-slate-500">{tx.field}</td>
                  <td className="py-4 text-slate-400">{tx.time}</td>
                  <td className="py-4 font-bold text-slate-800">{tx.amount}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 font-bold rounded-lg text-[9px] ${tx.statusColor}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}