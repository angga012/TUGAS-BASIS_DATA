import { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { fetchCustomers } from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Forms state
  const [addForm, setAddForm] = useState({ customer_name: '', email: '', address: '', phone_number: '' });
  const [memberForm, setMemberForm] = useState({ type: 'MEMBER', membership_level: 'GOLD', duration_months: 3 });
  const [formErrors, setFormErrors] = useState<any>({});
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomers();

      console.log("CUSTOMERS API:", data);

      setCustomers(data.data);
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors:any = {};


  if (!addForm.customer_name.trim()) {
    errors.customer_name = "Nama wajib diisi";
  }


  if (!addForm.email.trim()) {
    errors.email = "Email wajib diisi";
  }


  if (!addForm.phone_number.trim()) {
    errors.phone_number = "Nomor telepon wajib diisi";
  } 
  else if (addForm.phone_number.length < 10) {
    errors.phone_number = "Nomor telepon minimal 10 angka";
  }


  if (!addForm.address.trim()) {
    errors.address = "Alamat wajib diisi";
  }


  setFormErrors(errors);


  if (Object.keys(errors).length > 0) {
    return;
  }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(addForm)
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setAddForm({ customer_name: '', email: '', address: '', phone_number: '' });
        loadCustomers();
      } else {
        alert('Gagal menambah pelanggan');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { customer_id: selectedCustomerId, ...memberForm };
      const res = await fetch('http://localhost:5000/api/customers/set-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsMemberModalOpen(false);
        loadCustomers();
      } else {
        alert('Gagal mengatur membership');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openMemberModal = (id: string) => {
    setSelectedCustomerId(id);
    setIsMemberModalOpen(true);
  };

  return (
    <SidebarLayout 
      pageTitle="Manajemen Pelanggan" 
      searchPlaceholder="Cari pelanggan berdasarkan nama, email..."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Daftar Pelanggan</h3>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            + Tambah Pelanggan
          </button>
        </div>

        {/* Modal Tambah Pelanggan */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
              <h3 className="text-lg font-bold mb-4">Tambah Pelanggan Baru</h3>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
  <label className="block text-xs font-bold text-slate-600 mb-1">
    Nama
  </label>

  {formErrors.customer_name && (
    <p className="text-red-500 text-xs font-semibold mb-1">
      ⚠ {formErrors.customer_name}
    </p>
  )}

  <input 
    type="text"
    value={addForm.customer_name}
    onChange={e => 
      setAddForm({
        ...addForm,
        customer_name: e.target.value
      })
    }
    className="w-full bg-slate-50 border p-2 rounded-lg text-sm"
  />
</div>


<div>
  <label className="block text-xs font-bold text-slate-600 mb-1">
    Email
  </label>

  {formErrors.email && (
    <p className="text-red-500 text-xs font-semibold mb-1">
      ⚠ {formErrors.email}
    </p>
  )}

  <input 
    type="email"
    value={addForm.email}
    onChange={e => 
      setAddForm({
        ...addForm,
        email:e.target.value
      })
    }
    className="w-full bg-slate-50 border p-2 rounded-lg text-sm"
  />
</div>


<div>
  <label className="block text-xs font-bold text-slate-600 mb-1">
    Telepon
  </label>

  {formErrors.phone_number && (
    <p className="text-red-500 text-xs font-semibold mb-1">
      ⚠ {formErrors.phone_number}
    </p>
  )}

  <input 
    type="text"
    value={addForm.phone_number}
    onChange={e => 
      setAddForm({
        ...addForm,
        phone_number:e.target.value
      })
    }
    className="w-full bg-slate-50 border p-2 rounded-lg text-sm"
  />
</div>


<div>
  <label className="block text-xs font-bold text-slate-600 mb-1">
    Alamat
  </label>

  {formErrors.address && (
    <p className="text-red-500 text-xs font-semibold mb-1">
      ⚠ {formErrors.address}
    </p>
  )}

  <input 
    type="text"
    value={addForm.address}
    onChange={e => 
      setAddForm({
        ...addForm,
        address:e.target.value
      })
    }
    className="w-full bg-slate-50 border p-2 rounded-lg text-sm"
  />
</div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Set Membership */}
        {isMemberModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
              <h3 className="text-lg font-bold mb-4">Atur Keanggotaan</h3>
              <form onSubmit={handleSetMembership} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tipe</label>
                  <select value={memberForm.type} onChange={e => setMemberForm({...memberForm, type: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm">
                    <option value="MEMBER">Member Baru/Perpanjang</option>
                    <option value="REGULER">Jadikan Reguler</option>
                  </select>
                </div>
                {memberForm.type === 'MEMBER' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Level Membership</label>
                      <input type="text" value={memberForm.membership_level} onChange={e => setMemberForm({...memberForm, membership_level: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" placeholder="Contoh: GOLD" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Durasi (Bulan)</label>
                      <input type="number" required value={memberForm.duration_months} onChange={e => setMemberForm({...memberForm, duration_months: Number(e.target.value)})} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" />
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsMemberModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-bold">Terapkan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-50">
                <th className="pb-4">Nama Pelanggan</th>
                <th className="pb-4">Kontak</th>
                <th className="pb-4">Tipe Member</th>
                <th className="pb-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-4 text-center">Memuat data...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-center">Belum ada pelanggan.</td></tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c.customer_id} className="text-xs">
                    <td className="py-4 font-bold text-slate-800">{c.customer_name}</td>
                    <td className="py-4 text-slate-500">
                      {c.phone_number}<br/>
                      <span className="text-[10px]">{c.email}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 font-bold rounded-lg text-[9px] ${c.membership_status === 'MEMBER' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                        {c.membership_status || 'REGULER'}
                      </span>
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => openMemberModal(c.customer_id)}
                        className="text-[10px] font-bold text-indigo-500 hover:underline"
                      >
                        Atur Member
                      </button>
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
