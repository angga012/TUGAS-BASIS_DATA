const db = require('../config/db');

async function getAllPayments(req, res) {
	try {
		const q = `SELECT id, booking_id as booking, method, date, amount, status FROM tb_payment ORDER BY id DESC LIMIT 100`;
		const { rows } = await db.query(q);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal mengambil data pembayaran' });
	}
}

async function getPaymentById(req, res) {
	try {
		const { id } = req.params;
		const q = `SELECT id, booking_id as booking, method, date, amount, status FROM tb_payment WHERE id=$1`;
		const { rows } = await db.query(q, [id]);
		if (!rows.length) return res.status(404).json({ error: 'Pembayaran tidak ditemukan' });
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal mengambil pembayaran' });
	}
}

async function createPayment(req, res) {
	try {
		const { booking, method, date, amount, status } = req.body;
		const q = `INSERT INTO tb_payment (booking_id, method, date, amount, status) VALUES ($1,$2,$3,$4,$5) RETURNING id, booking_id as booking, method, date, amount, status`;
		const { rows } = await db.query(q, [booking, method, date, amount, status]);
		res.status(201).json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal membuat pembayaran' });
	}
}

async function updatePayment(req, res) {
	try {
		const { id } = req.params;
		const { booking, method, date, amount, status } = req.body;
		const q = `UPDATE tb_payment SET booking_id=$1, method=$2, date=$3, amount=$4, status=$5 WHERE id=$6 RETURNING id, booking_id as booking, method, date, amount, status`;
		const { rows } = await db.query(q, [booking, method, date, amount, status, id]);
		if (!rows.length) return res.status(404).json({ error: 'Pembayaran tidak ditemukan' });
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal memperbarui pembayaran' });
	}
}

async function deletePayment(req, res) {
	try {
		const { id } = req.params;
		const q = `DELETE FROM tb_payment WHERE id=$1 RETURNING id`;
		const { rows } = await db.query(q, [id]);
		if (!rows.length) return res.status(404).json({ error: 'Pembayaran tidak ditemukan' });
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal menghapus pembayaran' });
	}
}

module.exports = { getAllPayments, getPaymentById, createPayment, updatePayment, deletePayment };

