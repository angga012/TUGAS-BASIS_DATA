const bookingSeed = [
  { id: 'BK-1001', customer: 'Bima H', field: 'A1', date: '2026-06-06', time: '16:00', duration: 2, total: 'Rp 120.000', status: 'Confirmed' },
  { id: 'BK-1002', customer: 'Raka P', field: 'B2', date: '2026-06-07', time: '18:00', duration: 1, total: 'Rp 70.000', status: 'Booked' },
  { id: 'BK-1003', customer: 'Sinta W', field: 'C3', date: '2026-06-08', time: '20:00', duration: 2, total: 'Rp 150.000', status: 'Cancelled' },
];

let bookings = [...bookingSeed];
let bookingPage = 1;
const bookingPerPage = 5;
const API_BASE = window.API_BASE || 'http://localhost:3000/api';

async function fetchBookingsFromApi() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    bookings = data.map(r => ({
      id: r.id || r.id_booking || r.code || r.booking_code,
      customer: r.customer,
      field: r.field,
      date: r.date,
      time: r.time || r.jam || '',
      duration: r.duration || r.durasi || 1,
      total: r.total || r.total_price || r.harga || 'Rp 0',
      status: r.status,
    }));
    bookingPage = 1;
    renderBookings();
  } catch (err) {
    console.warn('fetchBookingsFromApi failed, using local data', err);
    renderBookings();
  }
}

async function apiSaveBooking(payload, isUpdate) {
  try {
    const url = isUpdate ? `${API_BASE}/bookings/${payload.id}` : `${API_BASE}/bookings`;
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('API save failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('apiSaveBooking failed', err);
    return null;
  }
}

async function apiDeleteBooking(id) {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.warn('apiDeleteBooking failed', err);
    return false;
  }
}

function getStatusBadge(status) {
  const map = { Confirmed: 'success', Booked: 'warning', Cancelled: 'danger' };
  return `<span class="badge ${map[status] || 'info'}">${status}</span>`;
}

function formatBookingRow(item) {
  return `
    <tr>
      <td>${item.id}</td>
      <td>${item.customer}</td>
      <td>${item.field}</td>
      <td>${item.date}</td>
      <td>${item.duration} jam</td>
      <td>${item.total}</td>
      <td>${getStatusBadge(item.status)}</td>
      <td>
        <button class="btn btn-info" onclick="editBooking('${item.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteBooking('${item.id}')">Hapus</button>
        <button class="btn btn-purple" onclick="viewBooking('${item.id}')">Detail</button>
      </td>
    </tr>`;
}

function renderBookings() {
  const query = document.getElementById('bookingSearch')?.value.toLowerCase() || '';
  const filtered = bookings.filter(item =>
    [item.id, item.customer, item.field, item.date, item.status]
      .some(value => value.toLowerCase().includes(query))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / bookingPerPage));
  if (bookingPage > totalPages) bookingPage = totalPages;

  const start = (bookingPage - 1) * bookingPerPage;
  const pageItems = filtered.slice(start, start + bookingPerPage);

  const body = document.getElementById('bookingTableBody');
  if (!body) return;
  body.innerHTML = pageItems.map(formatBookingRow).join('') || '<tr><td colspan="8">Tidak ada data booking.</td></tr>';
  renderBookingPagination(totalPages);
}

function renderBookingPagination(totalPages) {
  const pagination = document.getElementById('bookingPagination');
  if (!pagination) return;
  const buttons = [];

  for (let i = 1; i <= totalPages; i += 1) {
    buttons.push(`<button class="${i === bookingPage ? 'active' : ''}" onclick="setBookingPage(${i})">${i}</button>`);
  }
  pagination.innerHTML = buttons.join('');
}

function setBookingPage(page) {
  bookingPage = page;
  renderBookings();
}

function clearBookingForm() {
  document.getElementById('bookingId').value = '';
  document.getElementById('bookingCustomer').value = '';
  document.getElementById('bookingField').value = 'A1';
  document.getElementById('bookingDate').value = '';
  document.getElementById('bookingTime').value = '';
  document.getElementById('bookingDuration').value = '';
  document.getElementById('bookingStatus').value = 'Booked';
  document.getElementById('bookingTotal').value = '';
}

function showBookingDetail(item) {
  document.getElementById('bookingDetailCode').textContent = item.id;
  document.getElementById('bookingDetailCustomer').textContent = item.customer;
  document.getElementById('bookingDetailField').textContent = `${item.field} (${item.duration} jam)`;
  const badge = document.getElementById('bookingDetailStatus');
  badge.textContent = item.status;
  badge.className = `badge ${item.status === 'Confirmed' ? 'success' : item.status === 'Booked' ? 'warning' : 'danger'}`;
}

function editBooking(id) {
  const item = bookings.find(x => x.id === id);
  if (!item) return;
  document.getElementById('bookingId').value = item.id;
  document.getElementById('bookingCustomer').value = item.customer;
  document.getElementById('bookingField').value = item.field;
  document.getElementById('bookingDate').value = item.date;
  document.getElementById('bookingTime').value = item.time;
  document.getElementById('bookingDuration').value = item.duration;
  document.getElementById('bookingStatus').value = item.status;
  document.getElementById('bookingTotal').value = item.total;
  window.showToast?.('Booking', 'Form berhasil diisi untuk edit data.', 'info');
}

function deleteBooking(id) {
  if (!confirm('Yakin ingin menghapus booking ini?')) return;
  (async () => {
    const ok = await apiDeleteBooking(id);
    bookings = bookings.filter(x => x.id !== id);
    renderBookings();
    window.showToast?.('Booking', ok ? 'Booking berhasil dihapus.' : 'Booking dihapus lokal (API tidak tersedia).', 'danger');
  })();
}

function viewBooking(id) {
  const item = bookings.find(x => x.id === id);
  if (!item) return;
  showBookingDetail(item);
  window.showToast?.('Booking', `Menampilkan detail ${id}.`, 'success');
}

function saveBooking(event) {
  event.preventDefault();
  const id = document.getElementById('bookingId').value;
  const payload = {
    id: id || `BK-${String(bookings.length + 1001).padStart(4, '0')}`,
    customer: document.getElementById('bookingCustomer').value.trim(),
    field: document.getElementById('bookingField').value,
    date: document.getElementById('bookingDate').value,
    time: document.getElementById('bookingTime').value,
    duration: Number(document.getElementById('bookingDuration').value) || 1,
    total: document.getElementById('bookingTotal').value.trim() || 'Rp 0',
    status: document.getElementById('bookingStatus').value,
  };

  if (!payload.customer || !payload.date || !payload.time) {
    window.showToast?.('Validasi', 'Nama customer, tanggal, dan jam wajib diisi.', 'warning');
    return;
  }

  if (id) {
    (async () => {
      const result = await apiSaveBooking(payload, true);
      if (result) {
        bookings = bookings.map(x => x.id === id ? payload : x);
        window.showToast?.('Booking', 'Data booking berhasil diperbarui.', 'success');
        renderBookings();
      } else {
        bookings = bookings.map(x => x.id === id ? payload : x);
        window.showToast?.('Booking', 'Perubahan disimpan secara lokal (API tidak tersedia).', 'warning');
        renderBookings();
      }
    })();
  } else {
    (async () => {
      const result = await apiSaveBooking(payload, false);
      if (result) {
        bookings.unshift({ ...payload, id: result.id || payload.id });
        window.showToast?.('Booking', 'Booking baru berhasil ditambahkan.', 'success');
        renderBookings();
      } else {
        bookings.unshift(payload);
        window.showToast?.('Booking', 'Booking ditambahkan secara lokal (API tidak tersedia).', 'warning');
        renderBookings();
      }
    })();
  }
  clearBookingForm();
}

function refreshBooking() {
  const overlay = document.querySelector('.loading-overlay');
  overlay?.classList.remove('hidden');
  setTimeout(() => {
    renderBookings();
    overlay?.classList.add('hidden');
    window.showToast?.('Booking', 'Data booking berhasil disegarkan.', 'info');
  }, 500);
}

window.addEventListener('DOMContentLoaded', () => {
  fetchBookingsFromApi();
  document.getElementById('bookingSearch')?.addEventListener('input', () => { bookingPage = 1; renderBookings(); });
  document.getElementById('saveBookingBtn')?.addEventListener('click', saveBooking);
  document.getElementById('cancelBookingBtn')?.addEventListener('click', (event) => {
    event.preventDefault();
    clearBookingForm();
  });
  document.getElementById('refreshBookingBtn')?.addEventListener('click', refreshBooking);
  document.getElementById('addBookingBtn')?.addEventListener('click', () => {
    clearBookingForm();
    window.showToast?.('Booking', 'Form siap untuk tambah booking baru.', 'success');
  });
});
