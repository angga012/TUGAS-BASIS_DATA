const scheduleSeed = [
  { id: 'JD-001', field: 'A1', date: '2026-06-07', start: '18:00', end: '19:00', status: 'Available' },
  { id: 'JD-002', field: 'B2', date: '2026-06-07', start: '19:00', end: '20:00', status: 'Booked' },
];

let schedules = [...scheduleSeed];

function renderSchedules() {
  const filterDate = document.getElementById('scheduleFilter')?.value || '';
  const rows = schedules.filter(item => !filterDate || item.date === filterDate);
  const body = document.getElementById('scheduleTableBody');
  if (!body) return;
  body.innerHTML = rows.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.field}</td>
      <td>${item.date}</td>
      <td>${item.start}</td>
      <td>${item.end}</td>
      <td><span class="badge ${item.status === 'Booked' ? 'warning' : 'success'}">${item.status}</span></td>
      <td>
        <button class="btn btn-info" onclick="editSchedule('${item.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteSchedule('${item.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function editSchedule(id) {
  const item = schedules.find(x => x.id === id);
  if (!item) return;
  document.getElementById('scheduleId').value = item.id;
  document.getElementById('scheduleField').value = item.field;
  document.getElementById('scheduleDate').value = item.date;
  document.getElementById('scheduleStart').value = item.start;
  document.getElementById('scheduleEnd').value = item.end;
  document.getElementById('scheduleStatus').value = item.status;
}

function deleteSchedule(id) {
  if (!confirm('Hapus jadwal ini?')) return;
  schedules = schedules.filter(x => x.id !== id);
  renderSchedules();
  window.showToast?.('Jadwal', 'Jadwal berhasil dihapus.', 'danger');
}

function addOrUpdateSchedule(event) {
  event.preventDefault();
  const id = document.getElementById('scheduleId').value;
  const payload = {
    id: id || `JD-${String(schedules.length + 1).padStart(3, '0')}`,
    field: document.getElementById('scheduleField').value,
    date: document.getElementById('scheduleDate').value,
    start: document.getElementById('scheduleStart').value,
    end: document.getElementById('scheduleEnd').value,
    status: document.getElementById('scheduleStatus').value,
  };
  if (!payload.date || !payload.start || !payload.end) {
    window.showToast?.('Validasi', 'Tanggal dan jam wajib diisi.', 'warning');
    return;
  }
  if (id) {
    schedules = schedules.map(x => x.id === id ? payload : x);
    window.showToast?.('Jadwal', 'Jadwal berhasil diperbarui.', 'success');
  } else {
    schedules.unshift(payload);
    window.showToast?.('Jadwal', 'Jadwal baru berhasil ditambahkan.', 'success');
  }
  document.getElementById('scheduleForm').reset();
  renderSchedules();
}

window.addEventListener('DOMContentLoaded', () => {
  renderSchedules();
  document.getElementById('scheduleForm')?.addEventListener('submit', addOrUpdateSchedule);
  document.getElementById('scheduleFilter')?.addEventListener('change', renderSchedules);
});
