interface NavbarProps {
  searchPlaceholder: string;
  pageTitle: string;
}

export default function Navbar({ searchPlaceholder, pageTitle }: NavbarProps) {
  return (
    <nav className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      {/* Bagian Kiri: Judul Halaman Dinamis */}
      <h2 className="text-lg font-bold text-slate-800 min-w-[150px]">
        {pageTitle}
      </h2>

      {/* Bagian Tengah: Search Bar */}
      <div className="relative w-full max-w-md mx-6">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">🔍</span>
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
        />
      </div>

      {/* Bagian Kanan: Notifikasi & Profil */}
      {/* Bagian Kanan: Notifikasi saja */}
<div className="flex items-center gap-4">
  <button className="relative p-2 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-all">
    🔔
    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
  </button>
</div>
    </nav>
  );
}