import { Link, useNavigate } from "react-router-dom";
import { useRequestPemakaianList } from "../../hooks/RequestPemakaian/useRequestPemakaianList";
import { useRole } from "../../hooks/useRole";
import { useState } from "react";
import { BASE_URL } from "../../services/api";

export default function IndexRequestPemakaianStaff() {

  // Ambil daftar data request pemakaian dari hook
  const { sortedData, loading, handleDelete } = useRequestPemakaianList();
  const navigate = useNavigate(); // Digunakan untuk berpindah halaman
  const { userId } = useRole();   // Ambil ID user yang sedang login

  // ======================================================
  // FILTER DATA — Hanya tampilkan request milik user yang login
  // Membandingkan ID user di data dengan ID user yang sedang aktif
  // ======================================================
  const myRequests = sortedData.filter(
    (row) => row.user?.id === userId || row.id_user === userId
  );

  // ======================================================
  // STATE — Untuk mengontrol tampilan modal konfirmasi hapus
  // showModal: true = modal muncul, false = modal tersembunyi
  // selectedId: menyimpan ID request yang akan dihapus
  // ======================================================
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ======================================================
  // HITUNG RINGKASAN STATUS — Menghitung jumlah request
  // berdasarkan status approval yang dimiliki user
  // ======================================================
  const totalMenunggu = myRequests.filter(r => r.status_request?.toLowerCase() === "pending").length;
  const totalDiterima = myRequests.filter(r => r.status_request?.toLowerCase() === "diterima").length;
  const totalDitolak  = myRequests.filter(r => r.status_request?.toLowerCase() === "ditolak").length;

  // ======================================================
  // HELPER FUNGSI — Menentukan class CSS dan ikon
  // berdasarkan nilai status_request dari data
  // ======================================================

  // Mengembalikan nama class CSS sesuai status (untuk warna tampilan)
  const statusClass = (status) =>
    status?.toLowerCase() === "diterima" ? "diterima" :
    status?.toLowerCase() === "ditolak"  ? "ditolak"  : "pending";

  // Mengembalikan nama ikon Font Awesome sesuai status
  const statusIcon = (status) =>
    status?.toLowerCase() === "diterima" ? "fa-check-circle" :
    status?.toLowerCase() === "ditolak"  ? "fa-times-circle" : "fa-clock";

  // ======================================================
  // TAMPILAN UTAMA — Seluruh halaman dirender di sini
  // ======================================================
  return (
    <div className="page-wrapper">

      {/* BREADCRUMB — Penanda posisi halaman saat ini */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Request Pemakaian</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Request Pemakaian</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* RINGKASAN STATUS — Kartu yang menampilkan jumlah request per status */}
      <div className="staff-summary-grid">

        <div className="staff-summary-card">
          <div className="staff-summary-icon pending">
            <i className="fa fa-clock"></i>
          </div>
          <div>
            <p className="staff-summary-label">Menunggu</p>
            <p className="staff-summary-value">{totalMenunggu}</p>
          </div>
        </div>

        <div className="staff-summary-card">
          <div className="staff-summary-icon diterima">
            <i className="fa fa-check-circle"></i>
          </div>
          <div>
            <p className="staff-summary-label">Diterima</p>
            <p className="staff-summary-value">{totalDiterima}</p>
          </div>
        </div>

        <div className="staff-summary-card">
          <div className="staff-summary-icon ditolak">
            <i className="fa fa-times-circle"></i>
          </div>
          <div>
            <p className="staff-summary-label">Ditolak</p>
            <p className="staff-summary-value">{totalDitolak}</p>
          </div>
        </div>

      </div>

      {/* TOMBOL AJUKAN REQUEST — Mengarahkan ke halaman form pengajuan baru */}
      <div className="content-card mb-16">
        <div className="request-action-card">
          <div>
            <h6 className="request-action-title">
              <i className="fa fa-plus-circle me-2"></i>
              Buat Request Baru
            </h6>
            <p className="request-action-subtitle">
              Ajukan request pemakaian kepada Manajer
            </p>
          </div>
          <button className="btn-brand" onClick={() => navigate("/request/pemakaian/tambah")}>
            <i className="fa fa-plus"></i> Ajukan Request
          </button>
        </div>
      </div>

      {/* DAFTAR REQUEST — Menampilkan semua request milik user yang login */}
      <div className="content-card">
        <h6 className="section-title">
          <i className="fa fa-history me-2"></i>
          Riwayat Pengajuan Saya
        </h6>

        {/* Tampilkan spinner saat data masih dimuat dari server */}
        {loading ? (
          <div className="loading-state">
            <i className="fa fa-spinner fa-spin fa-2x"></i>
            <p>Memuat data...</p>
          </div>

        /* Tampilkan pesan kosong jika belum ada request sama sekali */
        ) : myRequests.length === 0 ? (
          <div className="staff-empty-state">
            <i className="fa fa-inbox fa-3x"></i>
            <p>Belum ada request</p>
            <small>Klik "Ajukan Request" di atas untuk membuat pengajuan baru.</small>
          </div>

        /* Tampilkan daftar request jika data tersedia */
        ) : (
          <div className="request-list">
            {myRequests.map((row) => (
              <div key={row.id_request_pemakaian} className="request-item">

                {/* Ikon status request (jam = menunggu, centang = diterima, silang = ditolak) */}
                <div className={`request-item-icon ${statusClass(row.status_request)}`}>
                  <i className={`fa ${statusIcon(row.status_request)}`}></i>
                </div>

                {/* Info request — nama barang, jumlah, dan tanggal pengajuan */}
                <div className="request-item-info">
                  <p className="request-item-title">
                    {row.barangPakai?.nama_asetbarangpakai || "-"}
                  </p>
                  <p className="request-item-meta">
                    <i className="fa fa-sort-numeric-up me-1"></i>
                    {row.jumlah_pemakaian || "-"} {row.barangPakai?.satuan_asetbarangpakai || ""}
                    &nbsp;·&nbsp;
                    <i className="fa fa-calendar me-1"></i>
                    {row.tanggal_request
                      ? new Date(row.tanggal_request).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "-"}
                  </p>
                </div>

                {/* Badge status — menampilkan teks status approval */}
                <span className={`status-badge status-${statusClass(row.status_request)}`}>
                  {row.status_request || "Pending"}
                </span>

                {/* Tombol aksi — lihat file dan hapus request */}
                <div className="request-item-actions">

                  {/* Tombol lihat file hanya muncul jika file tersedia */}
                  {row.file_request && (
                    <a href={`${BASE_URL}/storage/${row.file_request}`} target="_blank" rel="noopener noreferrer" className="btn-action btn-edit no-underline">
                      <i className="fa fa-file-alt"></i>
                    </a>
                  )}

                  {/* Tombol hapus — menyimpan ID lalu membuka modal konfirmasi */}
                  <button className="btn-action btn-delete" onClick={() => { setSelectedId(row.id_request_pemakaian); setShowModal(true); }}>
                    <i className="fa fa-trash"></i>
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL KONFIRMASI HAPUS — Muncul saat tombol hapus ditekan */}
      {showModal && (
        <>
          {/* Overlay gelap di belakang modal, klik untuk menutup */}
          <div className="modal-overlay" onClick={() => setShowModal(false)} />

          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                <i className="fa fa-exclamation-triangle me-2 icon-danger"></i>
                Konfirmasi Hapus
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body-content">
              <p>Apakah Anda yakin ingin menghapus request ini?</p>
              <small>Data yang sudah dihapus tidak dapat dikembalikan.</small>
            </div>

            <div className="modal-foot">
              {/* Tombol batal — menutup modal tanpa menghapus */}
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>

              {/* Tombol hapus — menjalankan fungsi hapus lalu menutup modal */}
              <button className="btn-danger" onClick={() => { handleDelete(selectedId); setShowModal(false); }}>
                <i className="fa fa-trash me-1"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}