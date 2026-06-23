const menuItems = [
  { label: 'Dashboard', icon: 'fa-house', href: '/index.html', page: 'dashboard' },
  { label: 'Customer', icon: 'fa-users', href: '/pages/customer.html', page: 'customer' },
  { label: 'Lapangan', icon: 'fa-futbol', href: '/pages/field.html', page: 'field' },
  { label: 'Jadwal', icon: 'fa-calendar-alt', href: '/pages/schedule.html', page: 'schedule' },
  { label: 'Booking', icon: 'fa-clipboard-list', href: '/pages/booking.html', page: 'booking' },
  { label: 'Pembayaran', icon: 'fa-credit-card', href: '/pages/payment.html', page: 'payment' },
  { label: 'Laporan', icon: 'fa-chart-line', href: '/pages/report.html', page: 'report' },
  { label: 'Logout', icon: 'fa-right-from-bracket', href: '/index.html', page: 'logout' },
];

function renderLayout() {
  const currentPage = document.body.dataset.page || 'dashboard';
  const shell = document.querySelector('.app-shell');
  if (!shell) return;

  const sidebarMarkup = `
    <aside class="sidebar" id="sidebar">
      <div class="brand-box">
        <div class="brand-badge"><i class="fa-solid fa-futbol"></i></div>
        <div>
          <div class="brand-title">Futsal Admin</div>
          <div class="brand-sub">Sistem Booking Lapangan</div>
        </div>
      </div>
      <nav class="nav-links">
        ${menuItems.map(item => `
          <a class="nav-link ${item.page === currentPage ? 'active' : ''}" href="${item.href}">
            <i class="fa-solid ${item.icon}"></i>
            <span>${item.label}</span>
          </a>`).join('')}
      </nav>
      <div class="sidebar-footer">Update cepat • REST API siap terhubung</div>
    </aside>
    <main class="content-panel">
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-btn" id="menuBtn" aria-label="Buka menu"><i class="fa-solid fa-bars"></i></button>
          <div class="page-title">
            <h1 id="pageHeading">Sistem Booking Lapangan Futsal</h1>
            <p id="pageSubheading">Dashboard admin modern, profesional, dan responsif.</p>
          </div>
        </div>
        <div class="topbar-right">
          <span class="info-pill"><i class="fa-solid fa-calendar-days"></i> <span id="todayLabel"></span></span>
          <span class="info-pill"><i class="fa-solid fa-clock"></i> <span id="clockLabel"></span></span>
          <span class="user-chip info-pill">
            <img class="avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Admin profile" />
            <strong>Admin Futsal</strong>
          </span>
        </div>
      </header>
      <section class="main-content">
        ${document.querySelector('.page-shell')?.innerHTML || ''}
      </section>
    </main>
  `;

  shell.innerHTML = sidebarMarkup;
  attachEvents();
  updateClock();
}

function attachEvents() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (event) => {
      if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) sidebar.classList.remove('open');
    });
  }

  document.querySelectorAll('[data-toast]').forEach(button => {
    button.addEventListener('click', () => {
      showToast(button.dataset.toastTitle || 'Informasi', button.dataset.toastText || 'Aksi berhasil dijalankan.', button.dataset.toastType || 'success');
    });
  });
}

function updateClock() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  document.getElementById('todayLabel').textContent = dateLabel;
  document.getElementById('clockLabel').textContent = today.toLocaleTimeString('id-ID');
  setTimeout(updateClock, 1000);
}

function showToast(title, text, type = 'success') {
  const stack = document.querySelector('.toast-stack') || createToastStack();
  const toast = document.createElement('article');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<strong>${title}</strong>${text}`;
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function createToastStack() {
  const stack = document.createElement('div');
  stack.className = 'toast-stack';
  document.body.appendChild(stack);
  return stack;
}

window.addEventListener('DOMContentLoaded', () => {
  const pageShell = document.querySelector('.page-shell');
  if (pageShell) {
    renderLayout();
  }
});
