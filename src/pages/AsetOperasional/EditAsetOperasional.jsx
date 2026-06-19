// ======================================================
// === IMPORT
// ======================================================
import { Link, useNavigate } from "react-router-dom";
import { useAsetOperasionalForm } from "../../hooks/AsetOperasional/useAsetOperasionalForm";
import { useState, useEffect } from "react";

// ======================================================
// === COMPONENT UTAMA
// ======================================================
export default function EditAsetOperasional() {
  // ======================================================
  // === NAVIGATE
  // ======================================================
  const navigate = useNavigate();

  // ======================================================
  // === DATA & LOGIC FORM DARI HOOK
  // ======================================================
  const {
    form,
    handleChange,
    updateAsetOperasional,
    asetMasterList,
    id,
  } = useAsetOperasionalForm();

  // ======================================================
  // === UI STATE
  // ======================================================
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);

  // ======================================================
  // === GET SELECTED ASET
  // ======================================================
  const selectedAset = asetMasterList.find(
    (item) =>
      String(item.id_operasional) === String(form.id_operasional)
  );

  // ======================================================
  // === PREVIEW FOTO LAMA
  // ======================================================
  useEffect(() => {
    if (form.foto_asetoperasional_url) {
      setPreviewFoto(form.foto_asetoperasional_url);
    }
  }, [form.foto_asetoperasional_url]);

  // ======================================================
  // === HANDLE FILE PREVIEW
  // ======================================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    handleChange({
      target: {
        name: "foto_asetoperasional",
        value: file,
        type: "file",
        files: e.target.files,
      },
    });

    if (file) {
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  // ======================================================
  // === HANDLE SUBMIT
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAsetOperasional();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetoperasional");
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err);

      alert(
        "Gagal memperbarui data aset operasional.\nPeriksa input data atau file foto."
      );
    }
  };

  // ======================================================
  // === RENDER UI
  // ======================================================
  return (
    <div className="page-wrapper">
      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">
            Edit Data Aset Operasional
          </h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/asetoperasional">
                  Data Aset Operasional
                </Link>
              </li>

              <li className="breadcrumb-item active">
                Edit
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">
        {/* Tombol kembali */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Link
            to="/asetoperasional"
            className="btn-action btn-edit"
          >
            <i className="fa fa-arrow-left"></i> Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* NAMA ASET */}
          <div className="form-group">
            <label className="form-label">
              Nama Aset
            </label>

            <select
              name="id_operasional"
              className="dark-select"
              style={{ width: "100%" }}
              value={form.id_operasional || ""}
              onChange={handleChange}
              required
            >
              <option value="">
                -- Pilih Nama Aset --
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

          {/* MANUFACTURER AUTO FOLLOW */}
          <div className="form-group">
            <label className="form-label">
              Manufacturer
            </label>

            <input
              type="text"
              className="dark-input"
              style={{ width: "100%" }}
              value={
                selectedAset?.manufacturer
                  ?.nama_manufacturer || "-"
              }
              readOnly
            />
          </div>

          {/* KODE BARANG */}
          <div className="form-group">
            <label className="form-label">
              Kode Barang
            </label>

            <input
              type="text"
              name="kode_barang"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.kode_barang || ""}
              onChange={handleChange}
              placeholder="Contoh: OFF001"
              required
            />
          </div>

          {/* KONDISI */}
          <div className="form-group">
            <label className="form-label">
              Kondisi Aset
            </label>

            <select
              name="kondisi_asetoperasional"
              className="dark-select"
              style={{ width: "100%" }}
              value={form.kondisi_asetoperasional || ""}
              onChange={handleChange}
              required
            >
              <option value="">
                -- Pilih Kondisi --
              </option>

              <option value="Baik">
                Baik
              </option>

              <option value="Rusak Ringan">
                Rusak Ringan
              </option>

              <option value="Rusak Berat">
                Rusak Berat
              </option>
            </select>
          </div>

          {/* LOKASI */}
          <div className="form-group">
            <label className="form-label">
              Lokasi Aset
            </label>

            <input
              type="text"
              name="lokasi_asetoperasional"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.lokasi_asetoperasional || ""}
              onChange={handleChange}
              placeholder="Masukkan lokasi aset"
              required
            />
          </div>

          {/* FOTO */}
          <div className="form-group">
            <label className="form-label">
              Foto Aset
            </label>

            <input
              type="file"
              name="foto_asetoperasional"
              className="dark-input"
              style={{ width: "100%" }}
              onChange={handleFileChange}
              accept="image/*"
            />

            {previewFoto && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={previewFoto}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    borderRadius: "4px",
                  }}
                />
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <button
              type="submit"
              className="btn-brand"
            >
              <i className="fa fa-save"></i>
              {" "}Simpan Perubahan
            </button>

            <Link
              to="/asetoperasional"
              className="btn-action btn-edit"
            >
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
              <span className="modal-title">
                Berhasil
              </span>
            </div>

            <div
              className="modal-body-content"
              style={{ textAlign: "center" }}
            >
              <i
                className="fa fa-check-circle fa-3x mb-3"
                style={{
                  color: "var(--brand)",
                }}
              ></i>

              <p>
                Data aset operasional berhasil diperbarui.
              </p>

              <small>
                Mengalihkan ke halaman data...
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}