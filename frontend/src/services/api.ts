const API_URL = 'http://localhost:5000/api';

export const fetchSummary = async () => {
  const res = await fetch(`${API_URL}/dashboard-summary`);
  return res.json();
};

export const fetchCustomers = async () => {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${API_URL}/customers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.status === 401 || res.status === 403) {
      return [];
  }
  return res.json();
};

export const fetchBookings = async () => {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${API_URL}/bookings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const fetchFields = async () => {
  const res = await fetch(`${API_URL}/fields`);
  return res.json();
};

export const fetchSchedules = async () => {
  const res = await fetch(`${API_URL}/schedules`);
  return res.json();
};



export const loginAndGetToken = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) throw new Error("Login gagal");
  
  const data = await res.json();
  // Simpan token ke localStorage agar aplikasi tahu kamu sudah login
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};  
