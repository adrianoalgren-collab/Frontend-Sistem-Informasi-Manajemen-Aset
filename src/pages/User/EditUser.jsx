// ======================================================
// FILE: pages/User/EditUser.jsx
// FUNGSI: Halaman edit user — form sudah terisi data lama,
//         user bisa ubah lalu simpan.
// ======================================================

import { Link } from "react-router-dom";
import { useUserForm } from "../../hooks/User/useUserForm";


// ======================================================
// KOMPONEN UTAMA
// ======================================================
export default function EditUser() {

  // Ambil semua kebutuhan form dari hook.
  // Hook otomatis fetch data user berdasarkan id di URL
  // dan mengisi form dengan data yang sudah ada.
  const {
    form,             // nilai tiap field (sudah terisi data lama dari API)
    handleChange,     // dipanggil tiap user mengetik / memilih opsi
    handleSubmitEdit, // fungsi submit — kirim data yang diubah ke API
    departments,      // array pilihan department dari API
    roles,            // array pilihan role dari API
    showSuccess,      // true setelah data berhasil disimpan
  } = useUserForm();


  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Edit Data User</h4>
          <nav aria-label="Breadcrumb navigasi">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/user">Data User</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Edit</li>
            </ol>
          </nav>
        </div>
      </div>


      {/* ── CARD FORM ── */}
      <div className="content-card">

        {/* Tombol kembali ke halaman daftar */}
        <div className="form-top-actions">
          <Link to="/user" className="btn-action btn-edit">
            <i className="fa fa-arrow-left" aria-hidden="true" /> Kembali
          </Link>
        </div>


        {/* ── FORM EDIT ───────────────────────────────────────
            noValidate → validasi dikontrol sendiri, bukan browser,
            agar tampilan error konsisten di semua browser. */}
        <form onSubmit={handleSubmitEdit} noValidate>

          {/* ── FIELD: NAMA ── */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nama</label>
            <input
              id="name"
              type="text"
              name="name"
              className="dark-input w-100"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama user"
              required
              autoComplete="name"
            />
          </div>


          {/* ── FIELD: EMAIL ──
              type="email" → browser memvalidasi format email otomatis. */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className="dark-input w-100"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan email user"
              required
              autoComplete="email"
            />
          </div>


          {/* ── FIELD: PASSWORD ──
              Tidak required — kosong berarti password tidak diubah.
              Hook yang menangani logika ini sebelum kirim ke API. */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
              <span className="form-hint"> (kosongkan jika tidak ingin diubah)</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="dark-input w-100"
              value={form.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin diubah"
              autoComplete="new-password"
            />
          </div>


          {/* ── FIELD: DEPARTMENT ──
              Array.isArray() sebagai pengaman — kalau API belum selesai,
              departments mungkin masih undefined, tidak akan error. */}
          <div className="form-group">
            <label htmlFor="id_department" className="form-label">Department</label>
            <select
              id="id_department"
              name="id_department"
              className="dark-select w-100"
              value={form.id_department || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>-- Pilih Department --</option>
              {Array.isArray(departments) && departments.map((dep) => (
                <option key={dep.id_department} value={dep.id_department}>
                  {dep.nama_department}
                </option>
              ))}
            </select>
          </div>


          {/* ── FIELD: ROLE ──
              Sama seperti department — diisi dari data API. */}
          <div className="form-group">
            <label htmlFor="id_role" className="form-label">Role</label>
            <select
              id="id_role"
              name="id_role"
              className="dark-select w-100"
              value={form.id_role || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>-- Pilih Role --</option>
              {Array.isArray(roles) && roles.map((role) => (
                <option key={role.id_role} value={role.id_role}>
                  {role.nama_role}
                </option>
              ))}
            </select>
          </div>


          {/* ── TOMBOL AKSI ──
              Simpan Perubahan → submit form.
              Batal → kembali ke daftar tanpa menyimpan. */}
          <div className="form-actions">
            <button type="submit" className="btn-brand">
              <i className="fa fa-save" aria-hidden="true" /> Simpan Perubahan
            </button>
            <Link to="/user" className="btn-action btn-edit">Batal</Link>
          </div>

        </form>
      </div>


      {/* ── MODAL SUKSES ────────────────────────────────────
          Muncul otomatis setelah data berhasil disimpan.
          Hook mengatur showSuccess dan redirect setelah 2 detik.
          role="status" + aria-live memberi tahu screen reader
          bahwa ada notifikasi penting. */}
      {showSuccess && (
        <>
          <div className="modal-overlay" aria-hidden="true" />
          <div
            className="modal-box"
            role="status"
            aria-live="polite"
            aria-label="Data berhasil diperbarui"
          >
            <div className="modal-head">
              <span className="modal-title">Berhasil</span>
            </div>
            <div className="modal-body-content text-center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-brand" aria-hidden="true" />
              <p>Data user berhasil diperbarui.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}