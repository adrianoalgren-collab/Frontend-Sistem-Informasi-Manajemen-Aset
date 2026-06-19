// ======================================================
// === IMPORT
// ======================================================
import { Link, useNavigate } from "react-router-dom";
import { useJenisAsetOperasionalForm } from "../../hooks/AsetOperasional/useJenisAsetOperasionalForm";
import { useState, useEffect } from "react";

// ======================================================
// === COMPONENT UTAMA
// ======================================================
export default function EditJenisAsetOperasional() {
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
    updateJenisAsetOperasional,
    manufacturerList,
  } = useJenisAsetOperasionalForm();

  // ======================================================
  // === UI STATE
  // ======================================================
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);

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
      await updateJenisAsetOperasional();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/jenisasetoperasional");
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err);

      alert(
        "Gagal memperbarui data jenis aset operasional.\nPeriksa input data atau file foto."
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
            Edit Jenis Aset Operasional
          </h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/jenisasetoperasional">
                  Data Jenis Aset Operasional
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
            to="/jenisasetoperasional"
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

            <input
              type="text"
              name="nama_asetoperasional"
              className="dark-input"
              style={{ width: "100%" }}
              value={form.nama_asetoperasional || ""}
              onChange={handleChange}
              placeholder="Contoh: Laptop Dell"
              required
            />
          </div>

          {/* MANUFACTURER */}
          <div className="form-group">
            <label className="form-label">
              Manufacturer
            </label>

            <select
              name="id_manufacturer"
              className="dark-select"
              style={{ width: "100%" }}
              value={form.id_manufacturer || ""}
              onChange={handleChange}
            >
              <option value="">
                -- Pilih Manufacturer (Opsional) --
              </option>

              {manufacturerList.map((item) => (
                <option
                  key={item.id_manufacturer}
                  value={item.id_manufacturer}
                >
                  {item.nama_manufacturer}
                </option>
              ))}
            </select>
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
              to="/jenisasetoperasional/edit/:id"
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
                Data jenis aset operasional berhasil diperbarui.
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