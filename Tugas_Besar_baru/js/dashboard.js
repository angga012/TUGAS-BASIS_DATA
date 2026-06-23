document.addEventListener('DOMContentLoaded', () => {
  const bookingCtx = document.getElementById('bookingChart');
  const revenueCtx = document.getElementById('revenueChart');

  if (bookingCtx && window.Chart) {
    new Chart(bookingCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        datasets: [{
          label: 'Booking',
          data: [42, 55, 48, 63, 71, 68],
          backgroundColor: ['#22c55e', '#16a34a', '#22c55e', '#14532d', '#22c55e', '#2563eb'],
          borderRadius: 10
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }

  if (revenueCtx && window.Chart) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        datasets: [{
          label: 'Pendapatan (juta rupiah)',
          data: [5.2, 6.1, 5.8, 7.0, 7.8, 8.4],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.12)',
          fill: true,
          tension: 0.35
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }
});
