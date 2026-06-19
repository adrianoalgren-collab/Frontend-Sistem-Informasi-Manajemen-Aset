// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // service untuk panggil API backend


// ======================================================
// === HOOK: useUserForm
// Hook ini dipakai bersama oleh AddUser dan EditUser (via UserForm).
// Mengelola nilai form, perubahan input, ambil data lama (edit),
// daftar dropdown department & role, simpan, dan update data.
// ======================================================

export const useUserForm = ({ fetchList = true } = {}) => {

  // ambil ID dari URL — ada isinya kalau halaman edit, kosong kalau tambah
  const { id }   = useParams();

  // dipakai untuk redirect setelah simpan berhasil
  const navigate = useNavigate();


  // ── NILAI FORM ──
  // Semua field diinisialisasi kosong.
  // Kalau edit, nilai ini akan diisi ulang saat data lama berhasil diambil.
  const [form, setForm] = useState({
    name:          "",
    email:         "",
    password:      "", // password sengaja dikosongkan saat edit
    id_department: "",
    id_role:       "",
  });

  // daftar pilihan untuk dropdown
  const [departments, setDepartments] = useState([]); // dari API /department
  const [roles,       setRoles]       = useState([]); // dari API /role

  // true saat data berhasil disimpan — untuk tampilkan modal sukses
  const [showSuccess, setShowSuccess] = useState(false);


  // ======================================================
  // === HANDLE PERUBAHAN INPUT
  // Dipanggil setiap kali user mengetik di salah satu field.
  // ======================================================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // ======================================================
  // === AMBIL DAFTAR DEPARTMENT & ROLE
  // Dijalankan sekali saat form pertama kali dibuka.
  // fetchList bisa di-set false kalau dropdown tidak dibutuhkan.
  // ======================================================

  useEffect(() => {
    if (!fetchList) return; // skip kalau tidak perlu dropdown

    const fetchData = async () => {
      try {
        // ambil keduanya sekaligus agar lebih cepat
        const [depRes, roleRes] = await Promise.all([
          api.get("/department"), // response langsung array
          api.get("/role"),       // response { status, data: [...] }
        ]);

        setDepartments(depRes.data ?? []);
        setRoles(roleRes.data?.data ?? []); // ambil field "data" dari response role
      } catch (error) {
        console.error("Gagal mengambil data department / role", error);
      }
    };

    fetchData();
  }, [fetchList]);


  // ======================================================
  // === AMBIL DATA LAMA (untuk halaman edit)
  // Dijalankan otomatis saat id tersedia di URL.
  // Mengisi form dengan data user yang sudah ada.
  // ======================================================

  useEffect(() => {
    if (!id) return; // kalau tidak ada id, berarti halaman tambah — skip

    const fetchById = async () => {
      try {
        const res  = await api.get(`/user/${id}`);
        const data = res.data.data ?? {};

        setForm({
          name:          data.name          ?? "",
          email:         data.email         ?? "",
          password:      "",                     // password dikosongkan saat edit
          id_department: data.id_department  ?? "",
          id_role:       data.id_role        ?? "",
        });
      } catch (error) {
        console.error("Gagal mengambil data user berdasarkan ID", error);
      }
    };

    fetchById();
  }, [id]); // dijalankan ulang kalau id berubah


  // ======================================================
  // === SIMPAN DATA BARU (untuk halaman tambah)
  // Kirim data form ke API dengan method POST.
  // ======================================================

  const storeUser = async () => {
    try {
      const res = await api.post("/user", form);
      return res.data;
    } catch (error) {
      console.error("Gagal menyimpan user:", error);
      throw error;
    }
  };

  // fungsi submit untuk AddUser / UserForm mode tambah
  const handleSubmitAdd = async (e) => {
    e.preventDefault(); // cegah halaman reload
    try {
      await storeUser();
      setShowSuccess(true);
      // setelah 2 detik, tutup modal dan pindah ke halaman daftar
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/user");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data user");
    }
  };


  // ======================================================
  // === UPDATE DATA (untuk halaman edit)
  // Kirim data form ke API dengan method PUT + ID di URL.
  // ======================================================

  const updateUser = async () => {
    try {
      const res = await api.put(`/user/${id}`, form);
      return res.data;
    } catch (error) {
      console.error("Gagal mengupdate user:", error);
      throw error;
    }
  };

  // fungsi submit untuk EditUser / UserForm mode edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault(); // cegah halaman reload
    try {
      await updateUser();
      setShowSuccess(true);
      // setelah 2 detik, tutup modal dan pindah ke halaman daftar
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/user");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data user");
    }
  };


  // ======================================================
  // === RETURN
  // Kembalikan semua state dan fungsi yang dibutuhkan komponen.
  // ======================================================

  return {
    form,             // nilai tiap field form
    handleChange,     // fungsi update field saat user mengetik
    storeUser,        // kirim data baru ke API (jarang dipakai langsung)
    updateUser,       // kirim perubahan ke API (jarang dipakai langsung)
    id,               // ID dari URL (ada saat edit, null saat tambah)
    navigate,         // fungsi pindah halaman
    departments,      // daftar pilihan department untuk dropdown
    roles,            // daftar pilihan role untuk dropdown
    showSuccess,      // status berhasil simpan (untuk modal)
    handleSubmitAdd,  // submit untuk halaman tambah
    handleSubmitEdit, // submit untuk halaman edit
  };
};