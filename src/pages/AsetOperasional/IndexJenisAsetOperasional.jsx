// ======================================================
// === IMPORT
// ======================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useJenisAsetOperasionalList } from "../../hooks/AsetOperasional/useJenisAsetOperasionalList";

// ======================================================
// === COMPONENT
// ======================================================

export default function IndexJenisAsetOperasional() {

  // ======================================================
  // === DATA LOGIC
  // ======================================================

  const {
    loading,
    error,
    currentData,
    totalItems,
    totalPages,
    startIndex,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    search,
    setSearch,
    handleDelete,
    getFotoUrl,
  } = useJenisAsetOperasionalList();

  // ======================================================
  // === ROLE & NAVIGATE
  // ======================================================

  const { isAdmin } = useRole();
  const navigate    = useNavigate();

  // ======================================================
  // === UI STATE
  // ======================================================

  // -- modal konfirmasi hapus --
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId]           = useState(null);
  const [deleting, setDeleting]               = useState(false);

  // -- modal info detail --
  const [showInfoModal, setShowInfoModal]   = useState(false);
  const [selectedJenis, setSelectedJenis]   = useState(null);

  // -- modal foto --
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto]   = useState(null);

  // ======================================================
  // === HANDLER DELETE
  // ======================================================

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await handleDelete(selectedId);
      setShowDeleteModal(false);
      setSelectedId(null);
    } catch {
      alert("Gagal menghapus data. Silakan coba lagi.");
    } finally {
      setDeleting(false);
    }
  };

  // ======================================================
  // === HANDLER OPEN MODAL
  // ======================================================

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const openInfoModal = (row) => {
    setSelectedJenis(row);
    setShowInfoModal(true);
  };

  const openPhotoModal = (row) => {
    setSelectedPhoto(row);
    setShowPhotoModal(true);
  };

  // ======================================================
  // === KOLOM (untuk colSpan dinamis)
  // ======================================================

  const colCount = isAdmin ? 6 : 5;

  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data Jenis Aset Operasional</h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                Data Jenis Aset Operasional
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── CONTENT CARD ── */}
      <div className="content-card">

        {/* ── TOOLBAR ── */}
        <div className="toolbar">

          <div className="toolbar-left">
            <span>Tampilkan</span>

            <select
              className="dark-select"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>

            <span>data</span>
          </div>

          <div className="toolbar-right">
            <input
              type="text"
              className="dark-input"
              placeholder="Cari nama aset / manufacturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {isAdmin && (
              <button
                className="btn-brand"
                onClick={() => navigate("/jenisasetoperasional/tambah")}
              >
                <i className="fa fa-plus"></i> Tambah Data
              </button>
            )}
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="table-wrap">
          <table className="dark-table">

            <thead>
              <tr>
                <th>No</th>
                <th>Nama Aset</th>
                <th>Manufacturer</th>
                <th>Info</th>
                <th>Foto</th>
                {isAdmin && <th>Aksi</th>}
              </tr>
            </thead>

            <tbody>

              {/* STATE: loading */}
              {loading && (
                <tr>
                  <td colSpan={colCount} className="table-empty">
                    Memuat data...
                  </td>
                </tr>
              )}

              {/* STATE: error fetch */}
              {!loading && error && (
                <tr>
                  <td colSpan={colCount} className="table-empty" style={{ color: "#ef4444" }}>
                    {error}
                  </td>
                </tr>
              )}

              {/* STATE: kosong */}
              {!loading && !error && currentData.length === 0 && (
                <tr>
                  <td colSpan={colCount} className="table-empty">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}

              {/* STATE: data */}
              {!loading && !error && currentData.map((row, index) => (
                <tr key={row.id_operasional}>
                  <td>{startIndex + index + 1}</td>

                  <td>{row.nama_asetoperasional}</td>

                  <td>{row.manufacturer?.nama_manufacturer || "-"}</td>

                  {/* INFO */}
                  <td>
                    <div className="action-group">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => openInfoModal(row)}
                        title="Lihat detail"
                      >
                        <i className="fa fa-info-circle"></i>
                      </button>
                    </div>
                  </td>

                  {/* FOTO */}
                  <td>
                    {row.foto_asetoperasional ? (
                      <div className="action-group">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openPhotoModal(row)}
                          title="Lihat foto"
                        >
                          <i className="fa fa-image"></i>
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                        Tidak tersedia
                      </span>
                    )}
                  </td>

                  {/* AKSI (admin only) */}
                  {isAdmin && (
                    <td>
                      <div className="action-group">
                        <button
                          className="btn-action btn-edit"
                          onClick={() =>
                            navigate(`/jenisasetoperasional/edit/${row.id_operasional}`)
                          }
                        >
                          <i className="fa fa-wrench"></i> Edit
                        </button>

                        <button
                          className="btn-action btn-delete"
                          onClick={() => openDeleteModal(row.id_operasional)}
                        >
                          <i className="fa fa-trash"></i> Hapus
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="pagination-bar">
          <small className="pagination-info">
            Menampilkan {currentData.length} dari {totalItems} data
            &nbsp;·&nbsp;
            Halaman {currentPage} dari {totalPages}
          </small>

          <div className="pagination-btns">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              &lt;
            </button>

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          MODAL: KONFIRMASI HAPUS
      ====================================================== */}
      {showDeleteModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />

          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i
                  className="fa fa-exclamation-triangle me-2"
                  style={{ color: "#ef4444" }}
                />
                Konfirmasi Hapus Data
              </span>

              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                ×
              </button>
            </div>

            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
            </div>

            <div className="modal-foot">
              <button
                className="btn-ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Batal
              </button>

              <button
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                <i className="fa fa-trash me-1"></i>
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ======================================================
          MODAL: INFO DETAIL JENIS ASET
      ====================================================== */}
      {showInfoModal && selectedJenis && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowInfoModal(false)}
          />

          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i
                  className="fa fa-info-circle me-2"
                  style={{ color: "#3b82f6" }}
                />
                Informasi Jenis Aset
              </span>

              <button
                className="modal-close"
                onClick={() => setShowInfoModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body-content">
              <div className="form-group">
                <label>Nama Aset</label>
                <div>{selectedJenis.nama_asetoperasional || "-"}</div>
              </div>

              <div className="form-group">
                <label>Manufacturer</label>
                <div>{selectedJenis.manufacturer?.nama_manufacturer || "-"}</div>
              </div>
            </div>

            <div className="modal-foot">
              <button
                className="btn-ghost"
                onClick={() => setShowInfoModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}

      {/* ======================================================
          MODAL: FOTO ASET
      ====================================================== */}
      {showPhotoModal && selectedPhoto && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowPhotoModal(false)}
          />

          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i
                  className="fa fa-image me-2"
                  style={{ color: "#3b82f6" }}
                />
                Foto Aset
              </span>

              <button
                className="modal-close"
                onClick={() => setShowPhotoModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body-content" style={{ textAlign: "center" }}>
              {selectedPhoto.foto_asetoperasional ? (
                <img
                  src={getFotoUrl(selectedPhoto.foto_asetoperasional)}
                  alt={`Foto aset ${selectedPhoto.nama_asetoperasional}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              ) : (
                <p style={{ color: "#9ca3af" }}>Foto tidak tersedia</p>
              )}
            </div>

            <div className="modal-foot">
              <button
                className="btn-ghost"
                onClick={() => setShowPhotoModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}