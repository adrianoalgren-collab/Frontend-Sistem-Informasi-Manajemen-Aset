// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useAsetKendaraanForm, KONDISI_OPTIONS } from "../../hooks/AsetKendaraan/useAsetKendaraanForm";

// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function AddAsetKendaraan() {

  const {
    form,
    handleChange,
    manufacturers,
    isLoading,
    showSuccess,
    showError,
    handleSubmit,
  } = useAsetKendaraanForm();


  // ======================================================
  // === RENDER
  // ======================================================
  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Tambah Data Aset Kendaraan</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/asetkendaraan">Data Aset Kendaraan</Link></li>
              <li className="breadcrumb-item active">Tambah</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">
        <form onSubmit={handleSubmit}>

          {/* Kode Kendaraan */}
          <div className="form-group">
            <label className="form-label">Kode Kendaraan</label>
            <input
              type="text"
              name="kode_kendaraan"
              className="dark-input full-width"
              value={form.kode_kendaraan || ""}
              onChange={handleChange}
              placeholder="Masukkan kode kendaraan"
              required
            />
          </div>

          {/* Nama Kendaraan */}
          <div className="form-group">
            <label className="form-label">Nama Kendaraan</label>
            <input
              type="text"
              name="nama_kendaraan"
              className="dark-input full-width"
              value={form.nama_kendaraan || ""}
              onChange={handleChange}
              placeholder="Masukkan nama kendaraan"
              required
            />
          </div>

          {/* Plat Kendaraan */}
          <div className="form-group">
            <label className="form-label">Plat Kendaraan</label>
            <input
              type="text"
              name="plat_kendaraan"
              className="dark-input full-width"
              value={form.plat_kendaraan || ""}
              onChange={handleChange}
              placeholder="Masukkan plat kendaraan"
              required
            />
          </div>

          {/* Kondisi — nilai sinkron dengan konstanta model PHP */}
          <div className="form-group">
            <label className="form-label">Kondisi Kendaraan</label>
            <select
              name="kondisi_kendaraan"
              className="dark-select full-width"
              value={form.kondisi_kendaraan || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Kondisi --</option>
              {KONDISI_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Manufacturer — field name disesuaikan dengan fillable model */}
          <div className="form-group">
            <label className="form-label">Manufacturer</label>
            <select
              name="id_manufacturer"
              className="dark-select full-width"
              value={form.id_manufacturer || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Manufacturer --</option>
              {manufacturers.map((m) => (
                <option key={m.id_manufacturer} value={m.id_manufacturer}>
                  {m.nama_manufacturer}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="form-actions">
            <button type="submit" className="btn-brand" disabled={isLoading}>
              {isLoading
                ? <><i className="fa fa-spinner fa-spin me-1"></i> Menyimpan...</>
                : <><i className="fa fa-save me-1"></i> Simpan</>
              }
            </button>
            <Link to="/asetkendaraan" className="btn-action btn-edit">
              Batal
            </Link>
          </div>

        </form>
      </div>


      {/* ── MODAL SUKSES ── */}
      {showSuccess && (
        <>
          <div className="modal-overlay" />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">Berhasil</span>
            </div>
            <div className="modal-body-content modal-body-content--center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-success"></i>
              <p>Data aset kendaraan berhasil disimpan.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}


      {/* ── MODAL ERROR ── */}
      {showError && (
        <>
          <div className="modal-overlay" onClick={() => setShowError(false)} />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-times-circle me-2 icon-danger"></i>
                Gagal Menyimpan
              </span>
              <button className="modal-close" onClick={() => setShowError(false)}>×</button>
            </div>
            <div className="modal-body-content modal-body-content--center">
              <i className="fa fa-exclamation-triangle fa-3x mb-3 icon-danger"></i>
              <p>Gagal menyimpan data aset kendaraan.</p>
              <small>Periksa koneksi atau hubungi administrator.</small>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowError(false)}>Tutup</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}