// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useAsetBarangPakaiForm } from "../../hooks/AsetBarangPakai/useAsetBarangPakaiForm";


// ======================================================
// === HALAMAN EDIT ASET BARANG PAKAI
// ======================================================

export default function EditAsetBarangPakai() {

  const {
    form,
    handleChange,
    handleSubmitEdit,
    showSuccess,
  } = useAsetBarangPakaiForm();


  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Edit Data Aset Barang Pakai</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/asetbarangpakai">Data Aset Barang Pakai</Link></li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">

        <form onSubmit={handleSubmitEdit}>

          {/* kode aset — wajib */}
          <div className="form-group">
            <label className="form-label">Kode Aset Barang Pakai</label>
            <input type="text" name="kode_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.kode_asetbarangpakai}
              onChange={handleChange} required />
          </div>

          {/* nama aset — wajib */}
          <div className="form-group">
            <label className="form-label">Nama Aset</label>
            <input type="text" name="nama_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.nama_asetbarangpakai}
              onChange={handleChange} required />
          </div>

          {/* lokasi — wajib */}
          <div className="form-group">
            <label className="form-label">Lokasi Penyimpanan</label>
            <input type="text" name="lokasi_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.lokasi_asetbarangpakai}
              onChange={handleChange} required />
          </div>

          {/* stok — wajib */}
          <div className="form-group">
            <label className="form-label">Stok</label>
            <input type="number" name="stok_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.stok_asetbarangpakai}
              onChange={handleChange} min={0} required />
          </div>

          {/* satuan — wajib */}
          <div className="form-group">
            <label className="form-label">Satuan</label>
            <input type="text" name="satuan_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.satuan_asetbarangpakai}
              onChange={handleChange} required />
          </div>

          {/* foto — opsional, kosongkan kalau tidak mau ganti */}
          <div className="form-group">
            <label className="form-label">Foto Aset</label>
            {/* tampilkan foto lama jika ada */}
            {form.foto_asetbarangpakai_existing && (
              <div style={{ marginBottom: "8px" }}>
                <small style={{ color: "var(--text-muted)" }}>Foto saat ini:</small><br />
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/storage/${form.foto_asetbarangpakai_existing}`}
                  alt="foto saat ini"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", marginTop: "4px" }}
                />
              </div>
            )}
            <input type="file" name="foto_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }}
              accept="image/*"
              onChange={handleChange} />
            <small style={{ color: "var(--text-muted)" }}>Kosongkan jika tidak ingin mengganti foto.</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-brand">
              <i className="fa fa-save"></i> Simpan Perubahan
            </button>
            <Link to="/asetbarangpakai" className="btn-action btn-edit">Batal</Link>
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
            <div className="modal-body-content text-center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-brand"></i>
              <p>Data aset barang pakai berhasil diperbarui.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}