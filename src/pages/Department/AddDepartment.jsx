// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useDepartmentForm } from "../../hooks/Department/useDepartmentForm"; // ambil data form & fungsi submit dari hook


// ======================================================
// === HALAMAN TAMBAH DEPARTMENT
// Form kosong untuk menambah data department baru.
// Setelah disimpan, otomatis redirect ke halaman daftar.
// ======================================================

export default function AddDepartment() {

  // ambil nilai form, fungsi handle input,
  // fungsi submit tambah, dan status sukses dari hook
  const {
    form,            // nilai tiap field form (awalnya kosong)
    handleChange,    // dipanggil setiap kali user mengetik di input
    handleSubmitAdd, // fungsi yang dijalankan saat form disubmit
    showSuccess,     // true saat data berhasil disimpan (untuk tampilkan modal)
  } = useDepartmentForm();


  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Tambah Data Department</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/department">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/indexDepartment">Data Department</Link></li>
              <li className="breadcrumb-item active">Tambah</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">

        {/* tombol kembali ke halaman daftar */}
        <div className="form-top-actions">
          <Link to="/indexDepartment" className="btn-action btn-edit">
            <i className="fa fa-arrow-left"></i> Kembali
          </Link>
        </div>

        {/* form tambah — saat disubmit akan memanggil handleSubmitAdd */}
        <form onSubmit={handleSubmitAdd}>

          {/* kode department — wajib diisi */}
          <div className="form-group">
            <label className="form-label">Kode Department</label>
            <input type="text" name="kode_department" className="dark-input"
              style={{ width: "100%" }} value={form.kode_department}
              onChange={handleChange} placeholder="Masukkan kode department" required />
          </div>

          {/* nama department — wajib diisi */}
          <div className="form-group">
            <label className="form-label">Nama Department</label>
            <input type="text" name="nama_department" className="dark-input"
              style={{ width: "100%" }} value={form.nama_department}
              onChange={handleChange} placeholder="Masukkan nama department" required />
          </div>

          {/* penanggung jawab — wajib diisi */}
          <div className="form-group">
            <label className="form-label">Penanggung Jawab</label>
            <input type="text" name="penanggungjawab_department" className="dark-input"
              style={{ width: "100%" }} value={form.penanggungjawab_department}
              onChange={handleChange} placeholder="Masukkan nama penanggung jawab" required />
          </div>

          {/* email — opsional */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email_department" className="dark-input"
              style={{ width: "100%" }} value={form.email_department}
              onChange={handleChange} placeholder="Masukkan email department" />
          </div>

          {/* nomor telepon — opsional */}
          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input type="text" name="nomor_telepon_department" className="dark-input"
              style={{ width: "100%" }} value={form.nomor_telepon_department}
              onChange={handleChange} placeholder="Masukkan nomor telepon" />
          </div>

          {/* tombol simpan dan batal */}
          <div className="form-actions">
            <button type="submit" className="btn-brand">
              <i className="fa fa-save"></i> Simpan
            </button>
            <Link to="/indexDepartment" className="btn-action btn-edit">Batal</Link>
          </div>

        </form>
      </div>

      {/* ── MODAL SUKSES ──
          Muncul otomatis setelah data berhasil disimpan,
          lalu redirect ke halaman daftar setelah 2 detik. */}
      {/* ── MODAL SUKSES ── */}
      {showSuccess && (
        <>
          <div className="modal-overlay" />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">Berhasil</span>
            </div>
            <div className="modal-body-content text-center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-brand"></i>
              <p>Data department berhasil disimpan.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}