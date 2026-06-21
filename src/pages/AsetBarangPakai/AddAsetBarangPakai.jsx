// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useAsetBarangPakaiForm } from "../../hooks/AsetBarangPakai/useAsetBarangPakaiForm";


// ======================================================
// === HALAMAN TAMBAH ASET BARANG PAKAI
// ======================================================

export default function AddAsetBarangPakai() {

  const {
    form,
    handleChange,
    handleSubmitAdd,
    showSuccess,
  } = useAsetBarangPakaiForm();


  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Tambah Data Aset Barang Pakai</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/asetbarangpakai">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/asetbarangpakai">Data Aset Barang Pakai</Link></li>
              <li className="breadcrumb-item active">Tambah</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">

        <form onSubmit={handleSubmitAdd}>

          {/* kode aset — wajib */}
          <div className="form-group">
            <label className="form-label">Kode Aset Barang Pakai</label>
            <input type="text" name="kode_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.kode_asetbarangpakai}
              onChange={handleChange} placeholder="Masukkan kode aset" required />
          </div>

          {/* nama aset — wajib */}
          <div className="form-group">
            <label className="form-label">Nama Aset</label>
            <input type="text" name="nama_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.nama_asetbarangpakai}
              onChange={handleChange} placeholder="Masukkan nama aset" required />
          </div>

          {/* lokasi — wajib */}
          <div className="form-group">
            <label className="form-label">Lokasi Penyimpanan</label>
            <input type="text" name="lokasi_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }} value={form.lokasi_asetbarangpakai}
              onChange={handleChange} placeholder="Masukkan lokasi penyimpanan" required />
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
              onChange={handleChange} placeholder="pcs, unit, lusin, dll" required />
          </div>

          {/* foto — opsional */}
          <div className="form-group">
            <label className="form-label">Foto Aset</label>
            <input type="file" name="foto_asetbarangpakai" className="dark-input"
              style={{ width: "100%" }}
              accept="image/*"
              onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-brand">
              <i className="fa fa-save"></i> Simpan
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
              <p>Data aset barang pakai berhasil disimpan.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}