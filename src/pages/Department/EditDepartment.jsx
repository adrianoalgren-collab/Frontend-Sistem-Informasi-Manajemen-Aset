// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useDepartmentForm } from "../../hooks/Department/useDepartmentForm"; // ambil data form & fungsi submit dari hook


// ======================================================
// === HALAMAN EDIT DEPARTMENT
// Menampilkan form yang sudah terisi data lama,
// user bisa ubah lalu simpan perubahannya.
// ======================================================

export default function EditDepartment() {

  // ambil data form, fungsi handle perubahan input,
  // fungsi submit edit, dan status sukses dari hook
  const {
    form,             // nilai tiap field form (sudah terisi data lama)
    handleChange,     // dipanggil setiap kali user mengetik di input
    handleSubmitEdit, // fungsi yang dijalankan saat form disubmit
    showSuccess,      // true saat data berhasil disimpan (untuk tampilkan modal)
  } = useDepartmentForm();


  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Edit Data Department</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/department">Data Department</Link></li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">

        {/* tombol kembali ke halaman daftar */}
        <div className="form-top-actions">
          <Link to="/department" className="btn-action btn-edit">
            <i className="fa fa-arrow-left"></i> Kembali
          </Link>
        </div>

        {/* form edit — saat disubmit akan memanggil handleSubmitEdit */}
        <form onSubmit={handleSubmitEdit}>

          {/* kode department — wajib diisi */}
          <div className="form-group">
            <label className="form-label">Kode Department</label>
            <input type="text" name="kode_department" className="dark-input"
              style={{ width: "100%" }} value={form.kode_department}
              onChange={handleChange} required />
          </div>

          {/* nama department — wajib diisi */}
          <div className="form-group">
            <label className="form-label">Nama Department</label>
            <input type="text" name="nama_department" className="dark-input"
              style={{ width: "100%" }} value={form.nama_department}
              onChange={handleChange} required />
          </div>

          {/* penanggung jawab — wajib diisi */}
          <div className="form-group">
            <label className="form-label">Penanggung Jawab</label>
            <input type="text" name="penanggungjawab_department" className="dark-input"
              style={{ width: "100%" }} value={form.penanggungjawab_department}
              onChange={handleChange} required />
          </div>

          {/* email — opsional */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email_department" className="dark-input"
              style={{ width: "100%" }} value={form.email_department}
              onChange={handleChange} />
          </div>

          {/* nomor telepon — opsional */}
          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input type="text" name="nomor_telepon_department" className="dark-input"
              style={{ width: "100%" }} value={form.nomor_telepon_department}
              onChange={handleChange} />
          </div>

          {/* tombol simpan dan batal */}
          <div className="form-actions">
            <button type="submit" className="btn-brand">
              <i className="fa fa-save"></i> Simpan Perubahan
            </button>
            <Link to="/department" className="btn-action btn-edit">Batal</Link>
          </div>

        </form>
      </div>

      {/* ── MODAL SUKSES ──
          Muncul otomatis setelah data berhasil disimpan,
          lalu redirect ke halaman daftar setelah 2 detik. */}
      {showSuccess && (
        <>
          {/* latar gelap di belakang modal */}
          <div className="modal-overlay" />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">Berhasil</span>
            </div>
            <div className="modal-body-content text-center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-brand"></i>
              <p>Data department berhasil diperbarui.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}