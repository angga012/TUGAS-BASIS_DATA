import SidebarLayout from '../components/SidebarLayout';

export default function Reports() {
  return (
    <SidebarLayout
      pageTitle="Laporan"
      searchPlaceholder="Cari laporan..."
    >
      <div className="space-y-6">

        <h3 className="text-xl font-bold text-slate-800">
          Laporan FutsalPro
        </h3>

        <div className="bg-white p-6 rounded-3xl shadow-sm">

          <p className="text-sm text-slate-500">
            Rekap pendapatan dan aktivitas lapangan
          </p>

        </div>

      </div>
    </SidebarLayout>
  );
}