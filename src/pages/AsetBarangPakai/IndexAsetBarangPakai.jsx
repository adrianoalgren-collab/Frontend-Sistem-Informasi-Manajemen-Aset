// ======================================================
// === IMPORT
// ======================================================

import { Link } from "react-router-dom";
import { useAsetBarangPakaiList } from "../../hooks/AsetBarangPakai/useAsetBarangPakaiList";
import SortableTh from "../../components/SortableTh";
import { useRole } from "../../hooks/useRole";
import { BASE_URL } from "../../services/api";
import { useState } from "react";


// ======================================================
// === HALAMAN DATA ASET BARANG PAKAI
// Menampilkan tabel daftar aset barang pakai dengan fitur:
// search, pagination, sorting, dan hapus data.
// Tombol Tambah dan Aksi hanya muncul untuk admin.
// ======================================================

export default function IndexAsetBarangPakai() {

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
    sortBy, setSortBy,
    sortDir, setSortDir,
    navigate,
    showModal, setShowModal,
    selectedId, setSelectedId,
  } = useAsetBarangPakaiList();

  const { isAdmin } = useRole();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
const [selectedPhoto, setSelectedPhoto]   = useState(null);

const openPhotoModal = (row) => {
  setSelectedPhoto(row);
  setShowPhotoModal(true);
};


  return (
    <div className="page-wrapper">

      {/* ── JUDUL & BREADCRUMB ── */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Data Aset Barang Pakai</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/asetbarangpakai">Home</Link></li>
              <li className="breadcrumb-item active">Data Aset Barang Pakai</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="content-card">

        {/* ── TOOLBAR ── */}
        <div className="toolbar">

          <div className="toolbar-left">
            <span>Tampilkan</span>
            <select className="dark-select" value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
            <span>data</span>
          </div>

          <div className="toolbar-right">
            <input type="text" className="dark-input" placeholder="Cari kode / nama ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />

            {isAdmin && (
              <button className="btn-brand" onClick={() => navigate("/asetbarangpakai/tambah")}>
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
                <SortableTh label="Kode"       field="kode_asetbarangpakai"     sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Nama"        field="nama_asetbarangpakai"     sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <SortableTh label="Lokasi"      field="lokasi_asetbarangpakai"   sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
                <th>Stok</th>
                <th>Satuan</th>
                <th>Foto</th>
                {isAdmin && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>

              {loading ? (
                <tr><td colSpan={isAdmin ? 10 : 9} className="table-empty">Memuat data...</td></tr>

              ) : currentData.length === 0 ? (
                <tr><td colSpan={isAdmin ? 10 : 9} className="table-empty">Data tidak ditemukan</td></tr>

              ) : (
                currentData.map((row, index) => (
                  <tr key={row.id_barang_pakai}>
                    <td>{startIndex + index + 1}</td>
                    <td>{row.kode_asetbarangpakai}</td>
                    <td>{row.nama_asetbarangpakai}</td>
                    <td>{row.lokasi_asetbarangpakai}</td>
                    <td>{row.stok_asetbarangpakai}</td>
                    <td>{row.satuan_asetbarangpakai}</td>
                    {/* FOTO */}
<td>
  {row.foto_asetbarangpakai ? (
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

                    {isAdmin && (
                      <td>
                        <div className="action-group">
                          <button className="btn-action btn-edit"
                            onClick={() => navigate(`/asetbarangpakai/edit/${row.id_barang_pakai}`)}>
                            <i className="fa fa-wrench"></i> Edit
                          </button>
                          <button className="btn-action btn-delete"
                            onClick={() => { setSelectedId(row.id_barang_pakai); setShowModal(true); }}>
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
            <button className="page-btn" disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>&lt;</button>
            <button className="page-btn" disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>&gt;</button>
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
                <i className="fa fa-exclamation-triangle me-2 icon-danger"></i>
                Konfirmasi Hapus Data
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
            </div>

            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-danger"
                onClick={() => { handleDelete(selectedId); setShowModal(false); }}>
                <i className="fa fa-trash me-1"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}

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
          Foto Aset Barang Pakai
        </span>

        <button
          className="modal-close"
          onClick={() => setShowPhotoModal(false)}
        >
          ×
        </button>
      </div>

      <div className="modal-body-content" style={{ textAlign: "center" }}>
        {selectedPhoto.foto_asetbarangpakai ? (
          <img
            src={`${BASE_URL}/storage/${selectedPhoto.foto_asetbarangpakai}`}
            alt={`Foto aset ${selectedPhoto.kode_asetbarangpakai}`}
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