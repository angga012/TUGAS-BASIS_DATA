const customerSeed = [
  { id: 'CU-001', name: 'Bima Hartono', email: 'bima@mail.com', phone: '081234567890', status: 'Member', address: 'Bandung' },
  { id: 'CU-002', name: 'Raka Putra', email: 'raka@mail.com', phone: '081234567891', status: 'Regular', address: 'Bekasi' },
  { id: 'CU-003', name: 'Sinta Wijaya', email: 'sinta@mail.com', phone: '081234567892', status: 'VIP', address: 'Depok' },
];

let customers = [...customerSeed];
let activeStatus = 'All';

function getStatusBadge(status) {
  const map = { Member: 'success', Regular: 'warning', VIP: 'info' };
  return `<span class="badge ${map[status] || 'info'}">${status}</span>`;
}

function renderCustomers() {
  const query = document.getElementById('customerSearch')?.value.toLowerCase() || '';
  const rows = customers.filter(item =>
    (activeStatus === 'All' || item.status === activeStatus) &&
    [item.name, item.email, item.phone, item.status].some(val => val.toLowerCase().includes(query))
  );

  const body = document.getElementById('customerTableBody');
  if (!body) return;
  body.innerHTML = rows.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.phone}</td>
      <td>${getStatusBadge(item.status)}</td>
      <td>
        <button class="btn btn-info" onclick="editCustomer('${item.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteCustomer('${item.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function editCustomer(id) {
  const item = customers.find(x => x.id === id);
  if (!item) return;
  document.getElementById('customerId').value = item.id;
  document.getElementById('customerName').value = item.name;
  document.getElementById('customerPhone').value = item.phone;
  document.getElementById('customerEmail').value = item.email;
  document.getElementById('customerStatus').value = item.status;
  document.getElementById('customerAddress').value = item.address || '';
  window.showToast?.('Customer', 'Form berhasil diisi untuk edit data.', 'info');
}

function deleteCustomer(id) {
  if (!confirm('Yakin ingin menghapus data customer ini?')) return;
  customers = customers.filter(x => x.id !== id);
  renderCustomers();
  window.showToast?.('Customer', 'Customer berhasil dihapus.', 'danger');
}

function addOrUpdateCustomer(event) {
  event.preventDefault();
  const id = document.getElementById('customerId').value;
  const payload = {
    id: id || `CU-${String(customers.length + 1).padStart(3, '0')}`,
    name: document.getElementById('customerName').value.trim(),
    phone: document.getElementById('customerPhone').value.trim(),
    email: document.getElementById('customerEmail').value.trim(),
    status: document.getElementById('customerStatus').value,
    address: document.getElementById('customerAddress').value.trim(),
  };
  if (!payload.name || !payload.phone || !payload.email) {
    window.showToast?.('Validasi', 'Nama, telepon, dan email wajib diisi.', 'warning');
    return;
  }
  if (id) {
    customers = customers.map(x => x.id === id ? payload : x);
    window.showToast?.('Customer', 'Data customer berhasil diperbarui.', 'success');
  } else {
    customers.unshift(payload);
    window.showToast?.('Customer', 'Customer baru berhasil ditambahkan.', 'success');
  }
  document.getElementById('customerForm').reset();
  renderCustomers();
}

window.addEventListener('DOMContentLoaded', () => {
  renderCustomers();
  document.getElementById('customerForm')?.addEventListener('submit', addOrUpdateCustomer);
  document.getElementById('customerSearch')?.addEventListener('input', renderCustomers);
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      activeStatus = btn.dataset.status || 'All';
      renderCustomers();
    });
  });
});
