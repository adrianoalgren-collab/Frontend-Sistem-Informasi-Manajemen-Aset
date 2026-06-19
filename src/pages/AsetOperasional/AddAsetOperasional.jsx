// ======================================================
// === IMPORT
// ======================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAsetOperasionalForm } from "../../hooks/AsetOperasional/useAsetOperasionalForm";

// ======================================================
// === COMPONENT
// ======================================================

export default function AddAsetOperasional() {

  // ======================================================
  // === HOOK
  // ======================================================

  const {
    form,
    handleChange,
    storeAsetOperasional,
    asetMasterList,
    selectedAset,
    loading,
    error,
    kodeError,
    checkingKode,
    checkKodeBarang,
    loadingNextKode,
  } = useAsetOperasionalForm();

  // ======================================================
  // === ROUTING & UI STATE
  // ======================================================

  const navigate = useNavigate();

  const [submitting, setSubmitting]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ======================================================
  // === HANDLE SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await storeAsetOperasional();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetoperasional");
      }, 2000);

    } catch (err) {
      alert(err?.message || "Gagal menyimpan data aset operasional. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Tambah Data Aset Operasional</h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/asetoperasional">Data Aset Operasional</Link>
              </li>
              <li className="breadcrumb-item active">Tambah</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">

        {/* Tombol kembali */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button
                className="btn-brand"
                onClick={() => navigate("/jenisasetoperasional/tambah")}
              >
                <i className="fa fa-plus"></i> Tambah Data Jenis Aset 
              </button>
        </div>

        {/* ── ERROR FETCH MASTER ── */}
        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#ef4444",
              fontSize: "14px",
            }}
          >
            <i className="fa fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* NAMA ASET */}
          <div className="form-group">
    <div className="d-flex align-items-center mb-2">
        <label className="form-label mb-0">
            Nama Aset
        </label>

        <small
            className="ms-2"
            style={{ color: "#9ca3af" }}
        >
            (Jika aset belum tersedia, tambahkan melalui tombol di kanan atas)
        </small>
    </div>

    <select
        name="id_operasional"
        className="dark-select"
        style={{ width: "100%" }}
        value={form.id_operasional}
        onChange={handleChange}
        disabled={loading}
        required
    >
        <option value="">
            {loading ? "Memuat daftar aset..." : "-- Pilih Nama Aset --"}
        </option>

        {asetMasterList.map((aset) => (
            <option
                key={aset.id_operasional}
                value={aset.id_operasional}
            >
                {aset.nama_asetoperasional}
            </option>
        ))}
    </select>
</div>

          {/* MANUFACTURER — read-only, auto-follow selectedAset */}
          <div className="form-group">
            <label className="form-label">Manufacturer</label>

            <input
              type="text"
              className="dark-input"
              style={{ width: "100%" }}
              value={selectedAset?.manufacturer?.nama_manufacturer || "-"}
              readOnly
            />
          </div>

          {/* KODE BARANG */}
          <div className="form-group">
            <label className="form-label">Kode Barang</label>

            <div style={{ position: "relative" }}>
              <input
                type="text"
                name="kode_barang"
                className="dark-input"
                style={{
                  width: "100%",
                  // border merah jika kode duplikat
                  border: kodeError ? "1px solid #ef4444" : undefined,
                }}
                value={form.kode_barang}
                onChange={handleChange}
                onBlur={(e) => checkKodeBarang(e.target.value)}
                placeholder={
                  loadingNextKode
                    ? "Membuat kode otomatis..."
                    : !form.id_operasional
                    ? "Pilih nama aset terlebih dahulu"
                    : "Contoh: OFF001"
                }
                disabled={submitting || loadingNextKode}
                required
              />

              {/* Spinner: sedang fetch kode berikutnya */}
              {loadingNextKode && (
                <span style={{
                  position: "absolute", right: "10px", top: "50%",
                  transform: "translateY(-50%)", fontSize: "12px", color: "#888",
                }}>
                  <i className="fa fa-spinner fa-spin me-1" />
                  Membuat kode...
                </span>
              )}

              {/* Spinner: sedang cek duplikat */}
              {checkingKode && !loadingNextKode && (
                <span style={{
                  position: "absolute", right: "10px", top: "50%",
                  transform: "translateY(-50%)", fontSize: "12px", color: "#888",
                }}>
                  <i className="fa fa-spinner fa-spin me-1" />
                  Memeriksa...
                </span>
              )}
            </div>

            {/* Error: kode duplikat */}
            {kodeError && (
              <small style={{ color: "#ef4444", marginTop: "4px", display: "block" }}>
                <i className="fa fa-times-circle me-1" />
                {kodeError}
              </small>
            )}

            {/* Hint: kode otomatis, bisa diubah */}
            {!kodeError && form.kode_barang && !loadingNextKode && (
              <small style={{ color: "#888", marginTop: "4px", display: "block" }}>
                <i className="fa fa-info-circle me-1" />
                Kode otomatis — bisa diubah manual jika perlu.
              </small>
            )}
          </div>

          {/* KONDISI */}
          <div className="form-group">
            <label className="form-label">Kondisi</label>

            <select
              name="kondisi_asetoperasional"
              className="dark-select"
              style={{ width: "100%" }}
              value={form.kondisi_asetoperasional}
              onChange={handleChange}
              disabled={submitting}
              required
            >
              <option value="">-- Pilih Kondisi --</option>
              <option value="Baik">Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>

          {/* LOKASI */}
          <div className="form-group">
            <label className="form-label">Lokasi</label>

            <input
              type="text"
              name="lokasi_asetoperasional"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.lokasi_asetoperasional}
              onChange={handleChange}
              placeholder="Masukkan lokasi aset"
              disabled={submitting}
              required
            />
          </div>

          {/* FOTO */}
          <div className="form-group">
            <label className="form-label">Foto Aset</label>

            <input
              type="file"
              name="foto_asetoperasional"
              className="dark-input"
              style={{ width: "100%" }}
              onChange={handleChange}
              accept="image/*"
              disabled={submitting}
            />
          </div>

          {/* BUTTON */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              type="submit"
              className="btn-brand"
              disabled={loading || submitting || !!kodeError || checkingKode || loadingNextKode}
            >
              <i className="fa fa-save"></i>{" "}
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>

            <Link to="/asetoperasional" className="btn-action btn-edit">
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
            <div className="modal-body-content text-center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-brand"></i>
              <p>Data aset operasional berhasil disimpan.</p>
              <small>Mengalihkan ke halaman data...</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}