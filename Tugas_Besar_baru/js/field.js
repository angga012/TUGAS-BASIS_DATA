const fieldSeed = [
  { id: 'FL-001', name: 'A1', price: 'Rp 120.000', capacity: 5, type: 'Indoor', status: 'Aktif', note: 'Lapangan sintetis baru' },
  { id: 'FL-002', name: 'B2', price: 'Rp 100.000', capacity: 7, type: 'Outdoor', status: 'Maintenance', note: 'Sedang perbaikan lampu' },
];

let fields = [...fieldSeed];

function renderFields() {
  const query = document.getElementById('fieldSearch')?.value.toLowerCase() || '';
  const rows = fields.filter(item => [item.name, item.type, item.status, item.price].some(val => String(val).toLowerCase().includes(query)));
  const body = document.getElementById('fieldTableBody');
  if (!body) return;
  body.innerHTML = rows.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.capacity}</td>
      <td>${item.type}</td>
      <td><span class="badge ${item.status === 'Aktif' ? 'success' : 'warning'}">${item.status}</span></td>
      <td>
        <button class="btn btn-info" onclick="editField('${item.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteField('${item.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function editField(id) {
  const item = fields.find(x => x.id === id);
  if (!item) return;
  document.getElementById('fieldId').value = item.id;
  document.getElementById('fieldName').value = item.name;
  document.getElementById('fieldPrice').value = item.price;
  document.getElementById('fieldCapacity').value = item.capacity;
  document.getElementById('fieldType').value = item.type;
  document.getElementById('fieldStatus').value = item.status;
  document.getElementById('fieldNote').value = item.note || '';
}

function deleteField(id) {
  if (!confirm('Hapus lapangan ini?')) return;
  fields = fields.filter(x => x.id !== id);
  renderFields();
  window.showToast?.('Lapangan', 'Lapangan berhasil dihapus.', 'danger');
}

function addOrUpdateField(event) {
  event.preventDefault();
  const id = document.getElementById('fieldId').value;
  const payload = {
    id: id || `FL-${String(fields.length + 1).padStart(3, '0')}`,
    name: document.getElementById('fieldName').value.trim(),
    price: document.getElementById('fieldPrice').value.trim(),
    capacity: Number(document.getElementById('fieldCapacity').value || 0),
    type: document.getElementById('fieldType').value,
    status: document.getElementById('fieldStatus').value,
    note: document.getElementById('fieldNote').value.trim(),
  };
  if (!payload.name || !payload.price) {
    window.showToast?.('Validasi', 'Nama lapangan dan harga wajib diisi.', 'warning');
    return;
  }
  if (id) {
    fields = fields.map(x => x.id === id ? payload : x);
    window.showToast?.('Lapangan', 'Data lapangan berhasil diperbarui.', 'success');
  } else {
    fields.unshift(payload);
    window.showToast?.('Lapangan', 'Lapangan baru berhasil ditambahkan.', 'success');
  }
  document.getElementById('fieldForm').reset();
  renderFields();
}

window.addEventListener('DOMContentLoaded', () => {
  renderFields();
  document.getElementById('fieldForm')?.addEventListener('submit', addOrUpdateField);
  document.getElementById('fieldSearch')?.addEventListener('input', renderFields);
});
