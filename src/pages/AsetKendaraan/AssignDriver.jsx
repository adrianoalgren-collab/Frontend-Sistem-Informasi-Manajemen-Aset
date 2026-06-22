// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAsetKendaraanList } from "../../hooks/AsetKendaraan/useAsetKendaraanList";

// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function AssignDriver() {

  const { id }   = useParams();
  const navigate = useNavigate();

  const {
    kendaraan,
    drivers,
    selectedUser,
    setSelectedUser,
    fetchAssignData,
    loading,
    handleAssignSubmit,
  } = useAsetKendaraanList();

  // ── UI State ──
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError,   setShowError]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch data assign saat id tersedia ──
  useEffect(() => {
    if (id) fetchAssignData(id); // ✅ id diteruskan eksplisit ke hook
  }, [id]);

  // ── Handle Submit — logic UI dikelola di komponen, bukan hook ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await handleAssignSubmit(id, selectedUser); // ✅ hook hanya terima data, tidak terima navigate/setState
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/asetkendaraan");
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================
  // === RENDER — Loading State
  // ======================================================

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content-card">
          <div className="loading-state">
            <i className="fa fa-spinner fa-spin fa-2x"></i>
            <p>Memuat data...</p>
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
          <h4 className="mb-0 fw-bold">Assign Driver</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/asetkendaraan">Aset Kendaraan</Link></li>
              <li className="breadcrumb-item active">Assign Driver</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CARD FORM ── */}
      <div className="content-card">
        <form onSubmit={handleSubmit}>

          {/* Nama Kendaraan — readonly */}
          <div className="form-group">
            <label className="form-label">Nama Kendaraan</label>
            <span className="form-info">
              <i className="fa fa-car me-2 icon-brand"></i>
              {kendaraan?.nama_kendaraan || "-"}
            </span>
          </div>

          {/* Plat Kendaraan — readonly */}
          <div className="form-group">
            <label className="form-label">Plat Kendaraan</label>
            <span className="form-info">
              <i className="fa fa-id-card me-2 icon-brand"></i>
              {kendaraan?.plat_kendaraan || "-"}
            </span>
          </div>

          {/* Driver saat ini — readonly */}
          <div className="form-group">
            <label className="form-label">Driver Saat Ini</label>
            <span className="form-info">
              <i className="fa fa-user me-2 icon-brand"></i>
              {kendaraan?.user?.name
                ? kendaraan.user.name
                : <span className="text-muted-italic">Belum ada driver</span>
              }
            </span>
          </div>

          {/* Pilih Driver Baru */}
          <div className="form-group">
            <label className="form-label">Pilih Driver</label>
            <select
              className="dark-select full-width"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">-- Pilih Driver --</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
            <small className="form-hint">Hanya menampilkan staff lapangan</small>
          </div>

          {/* Tombol Aksi */}
          <div className="form-actions">
            <button type="submit" className="btn-brand" disabled={isSubmitting}>
              {isSubmitting
                ? <><i className="fa fa-spinner fa-spin me-1"></i> Menyimpan...</>
                : <><i className="fa fa-user-check me-1"></i> Assign Driver</>
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
              <p>Data report berhasil disimpan.</p>
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
                Gagal Assign Driver
              </span>
              <button className="modal-close" onClick={() => setShowError(false)}>×</button>
            </div>
            <div className="modal-body-content modal-body-content--center">
              <i className="fa fa-exclamation-triangle fa-3x mb-3 icon-danger"></i>
              <p>Gagal melakukan assign driver.</p>
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