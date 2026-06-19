// ======================================================
// === IMPORT
// ======================================================
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAsetKendaraanForm } from "../../hooks/AsetKendaraan/useAsetKendaraanForm";

// ── Konstanta kondisi sinkron dengan model PHP ──
const KONDISI_OPTIONS = [
  { value: "baik",         label: "Baik"        },
  { value: "rusak_ringan", label: "Rusak Ringan" },
  { value: "rusak_berat",  label: "Rusak Berat"  },
  { value: "tidak_aktif",  label: "Tidak Aktif"  },
];

// ======================================================
// === KOMPONEN UTAMA
// ======================================================
export default function EditAsetKendaraan() {

  const navigate = useNavigate();
  const {
    form,
    handleChange,
    updateAsetKendaraan,
    manufacturers,
    isFetchingData, // ✅ loader saat fetch data edit
    fetchError,     // ✅ error saat fetch data edit
  } = useAsetKendaraanForm();

  // ── UI State ──
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError,   setShowError]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);

  // ── Handle Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateAsetKendaraan();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetkendaraan");
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ======================================================
  // === RENDER — Loading State
  // ======================================================
  if (isFetchingData) {
    return (
      <div className="page-wrapper">
        <div className="content-card">
          <div className="loading-state">
            <i className="fa fa-spinner fa-spin fa-2x"></i>
            <p>Memuat data kendaraan...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Fetch gagal saat load awal (bukan submit) ──
  if (fetchError) {
    return (
      <div className="page-wrapper">
        <div className="content-card">
          <div className="staff-empty-state">
            <i className="fa fa-exclamation-triangle fa-2x icon-danger"></i>
            <p>Gagal memuat data kendaraan.</p>
            <small>Periksa koneksi atau hubungi administrator.</small>
            <div className="form-actions" style={{ justifyContent: "center", marginTop: "12px" }}>
              <Link to="/asetkendaraan" className="btn-action btn-edit">
                <i className="fa fa-arrow-left me-1"></i> Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // === RENDER — Form
  // ======================================================
  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Edit Data Aset Kendaraan</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/asetkendaraan">Data Aset Kendaraan</Link></li>
              <li className="breadcrumb-item active">Edit</li>
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
            {manufacturers.length > 0 ? (
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
            ) : (
              <p className="text-muted-italic">Data manufacturer belum tersedia</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="form-actions">
            <button type="submit" className="btn-brand" disabled={isLoading}>
              {isLoading
                ? <><i className="fa fa-spinner fa-spin me-1"></i> Menyimpan...</>
                : <><i className="fa fa-save me-1"></i> Simpan Perubahan</>
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
            <div className="modal-body-content text-center">
              <i className="fa fa-check-circle fa-3x mb-3 icon-brand"></i>
              <p>Data manufacturer berhasil diperbarui.</p>
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
                Gagal Memperbarui
              </span>
              <button className="modal-close" onClick={() => setShowError(false)}>×</button>
            </div>
            <div className="modal-body-content modal-body-content--center">
              <i className="fa fa-exclamation-triangle fa-3x mb-3 icon-danger"></i>
              <p>Gagal memperbarui data aset kendaraan.</p>
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