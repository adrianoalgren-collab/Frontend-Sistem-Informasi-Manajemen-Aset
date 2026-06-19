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


// buat instance axios dengan base URL backend
// semua request akan dikirim ke http://127.0.0.1:8000/api/...
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
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