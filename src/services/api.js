// ======================================================
// === api.js
// Instance axios yang dipakai di seluruh aplikasi
// untuk berkomunikasi dengan backend Laravel.
//
// Cara pakai:
//   import api from "../../services/api";
//   const res = await api.get("/department");
// ======================================================

import axios from "axios";

export const BASE_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL + "/api/",
});

// ======================================================
// === INTERCEPTOR REQUEST
// Dijalankan otomatis sebelum setiap request dikirim.
// Tugasnya: tambahkan token dan header Accept ke setiap request
// agar tidak perlu menulis ulang di setiap pemanggilan API.
// ======================================================

api.interceptors.request.use((config) => {

  // ambil token dari localStorage — disimpan saat login berhasil
  const token = localStorage.getItem("token");

  if (token) {
    // tambahkan token ke header Authorization
    // format Bearer diperlukan oleh Laravel Sanctum
    config.headers.Authorization = `Bearer ${token}`;
  }

  // beritahu backend bahwa kita mengharapkan response dalam format JSON
  config.headers.Accept = "application/json";

  return config; // kembalikan config yang sudah dimodifikasi
});


export default api;