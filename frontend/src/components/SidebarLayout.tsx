import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
  searchPlaceholder: string;
}

export default function SidebarLayout({ children, pageTitle, searchPlaceholder }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

const navLinks = [
  { name:'Dasbor', icon:'🏠', path:'/' },
  { name:'Pelanggan', icon:'👥', path:'/customers' },
  { name:'Lapangan', icon:'⚽', path:'/fields' },
  { name:'Jadwal', icon:'📅', path:'/schedules' },
  { name:'Reservasi', icon:'📝', path:'/bookings' },

  { name:'Pembayaran', icon:'💰', path:'/payments' },
  { name:'Laporan', icon:'📊', path:'/reports' },
];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* SIDEBAR */}
      <aside 
        onClick={() => { if (!isSidebarOpen) setIsSidebarOpen(true); }}
        className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between sticky top-0 h-screen z-20 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div>
          <div className="p-5 flex items-center justify-between border-b border-slate-100 min-h-[80px]">
            {isSidebarOpen ? (
              <>
                <div className="flex flex-col flex-1 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl bg-emerald-100 p-1.5 rounded-lg">⚽</span>
                    <h1 className="text-lg font-bold text-slate-900">FutsalPro</h1>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }} className="p-2 rounded-xl hover:bg-slate-100">☰</button>
              </>
            ) : (
              <div className="mx-auto text-xl bg-emerald-500 text-white p-2 rounded-xl font-bold">FP</div>
            )}
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((item, index) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={index} 
                  to={item.path} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium ${isActive ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <span>{item.icon}</span>
                  {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

       <div className="p-4 border-t border-slate-100 space-y-2">
  <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl">
    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
      AM
    </div>

    {isSidebarOpen && (
      <div>
        <p className="text-xs font-semibold text-slate-800">Admin</p>
        <p className="text-[10px] text-slate-400">Logged in</p>
      </div>
    )}
  </div>

  {/* LOGOUT BUTTON */}
  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }}
    className="w-full text-xs font-bold text-red-500 hover:bg-red-50 p-2 rounded-xl transition"
  >
    🚪 Logout
  </button>
</div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar searchPlaceholder={searchPlaceholder} pageTitle={pageTitle} />
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}