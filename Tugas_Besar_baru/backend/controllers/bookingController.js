const db = require('../config/db');

async function getAllBookings(req, res) {
	try {
		const q = `SELECT id, customer, field, date, time, duration, total, status FROM tb_booking ORDER BY id DESC LIMIT 100`;
		const { rows } = await db.query(q);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal mengambil data booking' });
	}
}

async function getBookingById(req, res) {
	try {
		const { id } = req.params;
		const q = `SELECT id, customer, field, date, time, duration, total, status FROM tb_booking WHERE id = $1`;
		const { rows } = await db.query(q, [id]);
		if (!rows.length) return res.status(404).json({ error: 'Booking tidak ditemukan' });
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal mengambil booking' });
	}
}

async function createBooking(req, res) {
	try {
		const { customer, field, date, time, duration, total, status } = req.body;
		const q = `INSERT INTO tb_booking (customer, field, date, time, duration, total, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, customer, field, date, time, duration, total, status`;
		const { rows } = await db.query(q, [customer, field, date, time, duration, total, status]);
		res.status(201).json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal membuat booking' });
	}
}

async function updateBooking(req, res) {
	try {
		const { id } = req.params;
		const { customer, field, date, time, duration, total, status } = req.body;
		const q = `UPDATE tb_booking SET customer=$1, field=$2, date=$3, time=$4, duration=$5, total=$6, status=$7 WHERE id=$8 RETURNING id, customer, field, date, time, duration, total, status`;
		const { rows } = await db.query(q, [customer, field, date, time, duration, total, status, id]);
		if (!rows.length) return res.status(404).json({ error: 'Booking tidak ditemukan' });
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal memperbarui booking' });
	}
}

async function deleteBooking(req, res) {
	try {
		const { id } = req.params;
		const q = `DELETE FROM tb_booking WHERE id=$1 RETURNING id`;
		const { rows } = await db.query(q, [id]);
		if (!rows.length) return res.status(404).json({ error: 'Booking tidak ditemukan' });
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Gagal menghapus booking' });
	}
}

module.exports = { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking };
