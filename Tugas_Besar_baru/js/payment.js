const paymentSeed = [
	{ id: 'PY-001', booking: 'BK-1001', method: 'Transfer', date: '2026-06-06', amount: 'Rp 120.000', status: 'Lunas' },
	{ id: 'PY-002', booking: 'BK-1002', method: 'Cash', date: '2026-06-07', amount: 'Rp 70.000', status: 'DP' },
	{ id: 'PY-003', booking: 'BK-1003', method: 'E-Wallet', date: '2026-06-08', amount: 'Rp 150.000', status: 'Pending' },
];

let payments = [...paymentSeed];
let paymentPage = 1;
const paymentPerPage = 5;
let paymentMethodFilter = 'All';
const API_BASE = window.API_BASE || 'http://localhost:3000/api';

async function fetchPaymentsFromApi() {
	try {
		const res = await fetch(`${API_BASE}/payments`);
		if (!res.ok) throw new Error('API error');
		const data = await res.json();
		payments = data.map(r => ({
			id: r.id || r.payment_id || r.id_bayar,
			booking: r.booking || r.booking_id || r.id_booking,
			method: r.method || r.payment_method,
			date: r.date || r.tanggal_bayar,
			amount: r.amount || r.jumlah_bayar || 'Rp 0',
			status: r.status,
		}));
		paymentPage = 1;
		renderPayments();
	} catch (err) {
		console.warn('fetchPaymentsFromApi failed, using local data', err);
		renderPayments();
	}
}

async function apiSavePayment(payload, isUpdate) {
	try {
		const url = isUpdate ? `${API_BASE}/payments/${payload.id}` : `${API_BASE}/payments`;
		const method = isUpdate ? 'PUT' : 'POST';
		const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		if (!res.ok) throw new Error('API save failed');
		const data = await res.json();
		return data;
	} catch (err) {
		console.warn('apiSavePayment failed', err);
		return null;
	}
}

async function apiDeletePayment(id) {
	try {
		const res = await fetch(`${API_BASE}/payments/${id}`, { method: 'DELETE' });
		return res.ok;
	} catch (err) {
		console.warn('apiDeletePayment failed', err);
		return false;
	}
}

function getPaymentBadge(status) {
	const map = { Lunas: 'success', DP: 'warning', Pending: 'danger' };
	return `<span class="badge ${map[status] || 'info'}">${status}</span>`;
}

function formatPaymentRow(item) {
	return `
		<tr>
			<td>${item.id}</td>
			<td>${item.booking}</td>
			<td>${item.method}</td>
			<td>${item.date}</td>
			<td>${item.amount}</td>
			<td>${getPaymentBadge(item.status)}</td>
			<td>
				<button class="btn btn-info" onclick="editPayment('${item.id}')">Edit</button>
				<button class="btn btn-danger" onclick="deletePayment('${item.id}')">Hapus</button>
				<button class="btn btn-purple" onclick="viewPayment('${item.id}')">Detail</button>
			</td>
		</tr>`;
}

function renderPayments() {
	const query = document.getElementById('paymentSearch')?.value.toLowerCase() || '';
	const filtered = payments.filter(item => {
		const matchesSearch = [item.id, item.booking, item.method, item.date, item.status]
			.some(value => value.toLowerCase().includes(query));
		const matchesMethod = paymentMethodFilter === 'All' || item.method === paymentMethodFilter;
		return matchesSearch && matchesMethod;
	});

	const totalPages = Math.max(1, Math.ceil(filtered.length / paymentPerPage));
	if (paymentPage > totalPages) paymentPage = totalPages;
	const start = (paymentPage - 1) * paymentPerPage;
	const pageItems = filtered.slice(start, start + paymentPerPage);

	const body = document.getElementById('paymentTableBody');
	if (!body) return;
	body.innerHTML = pageItems.map(formatPaymentRow).join('') || '<tr><td colspan="7">Tidak ada data pembayaran.</td></tr>';
	renderPaymentPagination(totalPages);
}

function renderPaymentPagination(totalPages) {
	const pagination = document.getElementById('paymentPagination');
	if (!pagination) return;
	const buttons = [];
	for (let i = 1; i <= totalPages; i += 1) {
		buttons.push(`<button class="${i === paymentPage ? 'active' : ''}" onclick="setPaymentPage(${i})">${i}</button>`);
	}
	pagination.innerHTML = buttons.join('');
}

function setPaymentPage(page) {
	paymentPage = page;
	renderPayments();
}

function clearPaymentForm() {
	document.getElementById('paymentId').value = '';
	document.getElementById('paymentBooking').value = '';
	document.getElementById('paymentMethod').value = 'Cash';
	document.getElementById('paymentDate').value = '';
	document.getElementById('paymentAmount').value = '';
	document.getElementById('paymentStatus').value = 'Lunas';
}

function editPayment(id) {
	const item = payments.find(x => x.id === id);
	if (!item) return;
	document.getElementById('paymentId').value = item.id;
	document.getElementById('paymentBooking').value = item.booking;
	document.getElementById('paymentMethod').value = item.method;
	document.getElementById('paymentDate').value = item.date;
	document.getElementById('paymentAmount').value = item.amount;
	document.getElementById('paymentStatus').value = item.status;
	window.showToast?.('Pembayaran', 'Form berhasil diisi untuk edit pembayaran.', 'info');
}

function deletePayment(id) {
	if (!confirm('Yakin ingin menghapus pembayaran ini?')) return;
	(async () => {
		const ok = await apiDeletePayment(id);
		payments = payments.filter(x => x.id !== id);
		renderPayments();
		window.showToast?.('Pembayaran', ok ? 'Pembayaran berhasil dihapus.' : 'Pembayaran dihapus lokal (API tidak tersedia).', 'danger');
	})();
}

function viewPayment(id) {
	const item = payments.find(x => x.id === id);
	if (!item) return;
	window.showToast?.('Pembayaran', `Menampilkan detail ${id}.`, 'success');
}

function savePayment(event) {
	event.preventDefault();
	const id = document.getElementById('paymentId').value;
	const payload = {
		id: id || `PY-${String(payments.length + 1).padStart(3, '0')}`,
		booking: document.getElementById('paymentBooking').value.trim(),
		method: document.getElementById('paymentMethod').value,
		date: document.getElementById('paymentDate').value,
		amount: document.getElementById('paymentAmount').value.trim() || 'Rp 0',
		status: document.getElementById('paymentStatus').value,
	};

	if (!payload.booking || !payload.date || !payload.amount) {
		window.showToast?.('Validasi', 'Booking, tanggal, dan jumlah bayar wajib diisi.', 'warning');
		return;
	}

	if (id) {
		(async () => {
			const result = await apiSavePayment(payload, true);
			if (result) {
				payments = payments.map(x => x.id === id ? payload : x);
				window.showToast?.('Pembayaran', 'Data pembayaran berhasil diperbarui.', 'success');
				renderPayments();
			} else {
				payments = payments.map(x => x.id === id ? payload : x);
				window.showToast?.('Pembayaran', 'Perubahan disimpan secara lokal (API tidak tersedia).', 'warning');
				renderPayments();
			}
		})();
	} else {
		(async () => {
			const result = await apiSavePayment(payload, false);
			if (result) {
				payments.unshift({ ...payload, id: result.id || payload.id });
				window.showToast?.('Pembayaran', 'Pembayaran baru berhasil ditambahkan.', 'success');
				renderPayments();
			} else {
				payments.unshift(payload);
				window.showToast?.('Pembayaran', 'Pembayaran ditambahkan secara lokal (API tidak tersedia).', 'warning');
				renderPayments();
			}
		})();
	}
	clearPaymentForm();
}

function refreshPayment() {
	const overlay = document.querySelector('.loading-overlay');
	overlay?.classList.remove('hidden');
	setTimeout(() => {
		renderPayments();
		overlay?.classList.add('hidden');
		window.showToast?.('Pembayaran', 'Data pembayaran berhasil disegarkan.', 'info');
	}, 500);
}

window.addEventListener('DOMContentLoaded', () => {
	fetchPaymentsFromApi();
	document.getElementById('paymentSearch')?.addEventListener('input', () => { paymentPage = 1; renderPayments(); });
	document.querySelectorAll('.filter-chip').forEach(btn => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active'));
			btn.classList.add('active');
			paymentMethodFilter = btn.dataset.method || 'All';
			renderPayments();
		});
	});
	document.getElementById('savePaymentBtn')?.addEventListener('click', savePayment);
	document.getElementById('cancelPaymentBtn')?.addEventListener('click', (event) => {
		event.preventDefault();
		clearPaymentForm();
	});
	document.getElementById('refreshPaymentBtn')?.addEventListener('click', refreshPayment);
	document.getElementById('addPaymentBtn')?.addEventListener('click', () => {
		clearPaymentForm();
		window.showToast?.('Pembayaran', 'Form siap untuk tambah pembayaran baru.', 'success');
	});
});
