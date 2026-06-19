// ======================================================
// === IMPORT
// ======================================================

import { Link, useNavigate } from "react-router-dom";
import { useManufacturerList } from "../../hooks/Manufacturer/useManufacturerList";
import { useState } from "react";
import { useRole } from "../../hooks/useRole"; // hook global cek role user

export default function IndexManufacturer() {

  // ======================================================
  // === DATA LOGIC
  // ======================================================

  const {
    currentData,
    loading,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredData,
    totalPages,
    startIndex,
    handleDelete,
    sortedData,
  } = useManufacturerList();


  // ======================================================
  // === ROUTING & UI STATE
  // ======================================================

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ======================================================
  // === CEK ROLE USER
  // ======================================================

  const { isAdmin } = useRole();


  // ======================================================
  // === RENDER
  // ======================================================

  return (
    <div className="page-wrapper">

      {/* ── BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data Manufacturer</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Data Manufacturer</li>
            </ol>
          </nav>
        </div>
      </div>


      {/* ── CARD KONTEN ── */}
      <div className="content-card">

        {/* ── TOOLBAR ── */}
        <div className="toolbar">

          {/* Kiri: pilih jumlah data per halaman */}
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

          {/* Kanan: search + tombol tambah */}
          <div className="toolbar-right">
            <input
              type="text"
              className="dark-input"
              placeholder="Cari nama / email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            {/* Tombol Tambah hanya muncul jika admin */}
            {isAdmin && (
              <button
                className="btn-brand"
                onClick={() => navigate("/manufacturer/tambah")}
              >
                <i className="fa fa-plus"></i> Tambah Data
              </button>
            )}
          </div>
        </div>


        {/* ── TABEL ── */}
        <div className="table-wrap">
          <table className="dark-table">

            <thead>
              <tr>
                <th>No</th>
                <th>Nama Manufacturer</th>
                <th>Jumlah Aset</th>
                <th>Contact</th>
                {/* Kolom Aksi hanya ditampilkan jika admin */}
                {isAdmin && <th>Aksi</th>}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={isAdmin ? 5 : 4} className="table-empty">Memuat data...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan={isAdmin ? 5 : 4} className="table-empty">Data tidak ditemukan</td></tr>
              ) : (
                sortedData.map((row, index) => (
                  <tr key={row.id_manufacturer}>
                    <td>{startIndex + index + 1}</td>
                    <td>{row.nama_manufacturer}</td>
                    <td>{row.aset_operasional_count}</td>

                    {/* Kolom contact: email + telepon */}
                    <td>
                      <div style={{ marginBottom: "4px" }}>
                        <i className="fa fa-envelope me-1" style={{ color: "#3b82f6" }}></i>
                        <span style={{ fontWeight: 600, marginRight: "4px" }}>Email :</span>
                        {row.email_manufacturer || "-"}
                      </div>
                      <div>
                        <i className="fa fa-phone me-1" style={{ color: "var(--brand)" }}></i>
                        <span style={{ fontWeight: 600, marginRight: "4px" }}>Phone :</span>
                        {row.telfon_manufacturer || "-"}
                      </div>
                    </td>

                    {/* Tombol Edit & Hapus hanya untuk admin */}
                    {isAdmin && (
                      <td>
                        <div className="action-group">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => navigate(`/manufacturer/edit/${row.id_manufacturer}`)}
                          >
                            <i className="fa fa-wrench"></i> Edit
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => { setSelectedId(row.id_manufacturer); setShowModal(true); }}
                          >
                            <i className="fa fa-trash"></i> Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* ── PAGINATION ── */}
        <div className="pagination-bar">
          <small className="pagination-info">
            Menampilkan {currentData.length} dari {filteredData.length} data &nbsp;·&nbsp; Halaman {currentPage} dari {totalPages}
          </small>

          <div className="pagination-btns">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            >
              &lt;
            </button>
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>


      {/* ── MODAL KONFIRMASI HAPUS ── */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />

          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-exclamation-triangle me-2" style={{ color: "#ef4444" }}></i>
                Konfirmasi Hapus Data
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
            </div>

            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button
                className="btn-danger"
                onClick={() => { handleDelete(selectedId); setShowModal(false); }}
              >
                <i className="fa fa-trash me-1"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}