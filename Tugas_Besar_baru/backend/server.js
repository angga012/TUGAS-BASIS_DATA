const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
	res.status(404).json({ error: 'API endpoint not found' });
});

// Fallback untuk semua route lain (serve index.html untuk SPA)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
