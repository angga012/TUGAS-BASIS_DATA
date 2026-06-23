import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'STAFF'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Pendaftaran berhasil! Mengalihkan ke login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Gagal mendaftar. Email mungkin sudah terdaftar.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 text-3xl mb-4 shadow-sm">
            ⚽
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Buat Akun</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Daftar sebagai staf atau admin</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-600 text-sm font-bold p-4 rounded-xl mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
  <label className="block text-sm font-bold text-slate-700 mb-2">
    Password
  </label>

  <input
    type="password"
    value={formData.password}
    onChange={(e) =>
      setFormData({
        ...formData,
        password: e.target.value,
      })
    }
    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
    placeholder="••••••••"
    required
  />
</div>
          <div>
  <label className="block text-sm font-bold text-slate-700 mb-2">
    Pilih Role
  </label>

  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() =>
        setFormData({
          ...formData,
          role: 'ADMIN'
        })
      }
      className={`p-4 rounded-xl border-2 transition-all ${
        formData.role === 'ADMIN'
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="text-2xl mb-1">👑</div>
      <div className="font-bold text-sm">ADMIN</div>
    </button>

    <button
      type="button"
      onClick={() =>
        setFormData({
          ...formData,
          role: 'STAFF'
        })
      }
      className={`p-4 rounded-xl border-2 transition-all ${
        formData.role === 'STAFF'
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="text-2xl mb-1">👨‍💼</div>
      <div className="font-bold text-sm">STAFF</div>
    </button>
  </div>

  <p className="text-xs text-slate-500 mt-2">
    Role terpilih: <span className="font-bold">{formData.role}</span>
  </p>
</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-emerald-500 hover:underline font-bold">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
