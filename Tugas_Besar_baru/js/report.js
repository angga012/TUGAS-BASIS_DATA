function refreshReport() {
  const overlay = document.querySelector('.loading-overlay');
  overlay?.classList.remove('hidden');
  setTimeout(() => {
    overlay?.classList.add('hidden');
    window.showToast?.('Laporan', 'Laporan berhasil disegarkan.', 'success');
  }, 500);
}

function initReportPage() {
  document.getElementById('refreshReportBtn')?.addEventListener('click', refreshReport);
  document.getElementById('reportSearch')?.addEventListener('input', (event) => {
    const value = event.target.value.toLowerCase();
    document.querySelectorAll('.stat-card, .summary-card, .activity-list li').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(value) ? '' : 'none';
    });
  });
}

window.addEventListener('DOMContentLoaded', initReportPage);
