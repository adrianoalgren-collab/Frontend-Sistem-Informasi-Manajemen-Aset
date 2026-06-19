// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRole } from "../../hooks/useRole";
import api from "../../services/api";
import "../../assets/css/custom-style/asetkendaraan.css";


// ======================================================
// === KOMPONEN UTAMA
// ======================================================

export default function IndexAsetKendaraanStaff() {

  const { userId, userName } = useRole();

  const [kendaraan,   setKendaraan]   = useState(null);
  const [history,     setHistory]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  // ======================================================
  // === FETCH KENDARAAN & HISTORY
  // ======================================================

  useEffect(() => {
    if (!userId) return;

    const fetchKendaraan = async () => {
      try {
        // ✅ FIX: gunakan id_user (sesuai field di model backend)
        const res  = await api.get(`/asetkendaraan?id_user=${userId}`);
        const data = res.data?.data ?? res.data;

        // ✅ FIX: cari berdasarkan id_user, bandingkan sebagai string
        const assigned = Array.isArray(data)
          ? data.find(k => String(k.id_user) === String(userId)) ?? null
          : (data && data.id_kendaraan ? data : null);

        setKendaraan(assigned);

        // Fetch history jika ada kendaraan
        if (assigned?.id_kendaraan) {
          const resHistory = await api.get(`/asetkendaraan/${assigned.id_kendaraan}/history`);
          setHistory(resHistory.data?.data ?? []);
        }

      } catch (error) {
        console.error("Gagal mengambil data kendaraan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKendaraan();
  }, [userId]);


  // ======================================================
  // === HANDLE SELESAI TUGAS
  // ======================================================

  const handleSelesaiTugas = async () => {
    try {
      // ✅ FIX: gunakan id_user (sesuai fillable di model backend)
      await api.put(`/asetkendaraan/${kendaraan.id_kendaraan}`, {
        id_user: null,
      });
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setKendaraan(null);
        setHistory([]);
      }, 2000);
    } catch (error) {
      alert("Gagal menyelesaikan tugas");
    }
  };

  // Helper badge kondisi
  const kondisiClass = (kondisi) => {
    if (!kondisi) return "";
    const k = kondisi.toLowerCase();
    if (k.includes("baik"))   return "baik";
    if (k.includes("rusak"))  return "rusak";
    if (k.includes("servis")) return "servis";
    return "";
  };

  // Format tanggal
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };


  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Kendaraan Saya</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Kendaraan Saya</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading ? (
        <div className="content-card">
          <div className="loading-state">
            <i className="fa fa-spinner fa-spin fa-2x"></i>
            <p>Memuat data...</p>
          </div>
        </div>

      ) : !kendaraan ? (
        /* ── KOSONG ── */
        <div className="content-card">
          <div className="staff-empty-state">
            <i className="fa fa-car fa-3x"></i>
            <p>Belum ada kendaraan yang ditugaskan</p>
            <small>Hubungi admin untuk mendapatkan kendaraan tugas.</small>
          </div>
        </div>

      ) : (
        <>
          {/* ── HERO BANNER ── */}
          <div className="kendaraan-hero">
            <div className="kendaraan-hero-left">
              <div className="kendaraan-hero-icon">
                <i className="fa fa-car"></i>
              </div>
              <div>
                <p className="kendaraan-hero-name">{kendaraan.nama_kendaraan}</p>
                <p className="kendaraan-hero-plat">{kendaraan.plat_kendaraan || "-"}</p>
              </div>
            </div>
            <div className="kendaraan-hero-right">
              <button className="btn-selesai" onClick={() => setShowModal(true)}>
                <i className="fa fa-check-circle me-2"></i>Selesai Tugas
              </button>
            </div>
          </div>

          {/* ── INFO CARDS ── */}
          <div className="kendaraan-info-grid">

            <div className="kendaraan-info-card">
              <div className="kendaraan-info-icon">
                <i className="fa fa-barcode"></i>
              </div>
              <p className="kendaraan-info-label">Kode Kendaraan</p>
              <p className="kendaraan-info-value">{kendaraan.kode_kendaraan || "-"}</p>
            </div>

            <div className="kendaraan-info-card">
              <div className="kendaraan-info-icon">
                <i className="fa fa-industry"></i>
              </div>
              <p className="kendaraan-info-label">Manufacturer</p>
              <p className="kendaraan-info-value">
                {kendaraan.manufacturer?.nama_manufacturer || "-"}
              </p>
            </div>

            <div className="kendaraan-info-card">
              <div className="kendaraan-info-icon">
                <i className="fa fa-heartbeat"></i>
              </div>
              <p className="kendaraan-info-label">Kondisi</p>
              <p className="kendaraan-info-value">
                <span className={`kondisi-badge ${kondisiClass(kendaraan.kondisi_kendaraan)}`}>
                  {kendaraan.kondisi_kendaraan || "-"}
                </span>
              </p>
            </div>

            <div className="kendaraan-info-card">
              <div className="kendaraan-info-icon">
                <i className="fa fa-user"></i>
              </div>
              <p className="kendaraan-info-label">Driver</p>
              <p className="kendaraan-info-value">{userName || "-"}</p>
            </div>

          </div>

          {/* ── HISTORY ASSIGNMENT ── */}
          <div className="content-card">
            <h6 className="section-title">
              <i className="fa fa-history me-2"></i>
              History Assignment
            </h6>

            {history.length === 0 ? (
              <div className="staff-empty-state">
                <i className="fa fa-inbox fa-2x"></i>
                <p>Belum ada history</p>
              </div>
            ) : (
              <div className="table-wrap" style={{ maxHeight: "320px", overflowY: "auto", marginBottom: 0 }}>
                <table className="dark-table">
                  <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr>
                      <th>No</th>
                      <th>Driver</th>
                      <th>Tanggal Assign</th>
                      <th>Tanggal Selesai</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.user?.name || "-"}</td>
                        <td>{formatDate(item.tanggal_assign)}</td>
                        <td>{item.tanggal_selesai ? formatDate(item.tanggal_selesai) : "-"}</td>
                        <td>
                          {item.tanggal_selesai ? (
                            <span className="status-badge status-Ditolak">Selesai</span>
                          ) : (
                            <span className="status-badge status-Diterima">Aktif</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}


      {/* ── MODAL KONFIRMASI SELESAI TUGAS ── */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-exclamation-triangle me-2 icon-danger"></i>
                Konfirmasi Selesai Tugas
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menyelesaikan tugas dengan kendaraan ini?</p>
              <small>Kendaraan <strong>{kendaraan?.nama_kendaraan}</strong> akan dilepas dari akun Anda.</small>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-brand" onClick={handleSelesaiTugas}>
                <i className="fa fa-check me-1"></i> Ya, Selesai
              </button>
            </div>
          </div>
        </>
      )}


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
              <p>Tugas berhasil diselesaikan.</p>
              <small>Kendaraan telah dilepas dari akun Anda.</small>
            </div>
          </div>
        </>
      )}

    </div>
  );
}