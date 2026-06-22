// ======================================================
// ================= IMPORT CSS =========================
// ======================================================




// ======================================================
// ================= IMPORT ROUTER ======================
// ======================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// ======================================================
// ================= IMPORT HALAMAN =====================
// ======================================================

// ── Auth ──
import Login from "./pages/Login";                          // halaman login

// ── Aset Material ──
import IndexAsetMaterial  from "./pages/AsetMaterial/IndexAsetMaterial";
import AddAsetMaterial    from "./pages/AsetMaterial/AddAsetMaterial";
import EditAsetMaterial   from "./pages/AsetMaterial/EditAsetMaterial";

// ── User ──
import IndexUser  from "./pages/User/IndexUser";
import AddUser    from "./pages/User/AddUser";
import EditUser   from "./pages/User/EditUser";

// ── Aset Operasional ──
import IndexAsetOperasional  from "./pages/AsetOperasional/IndexAsetOperasional";
import AddAsetOperasional    from "./pages/AsetOperasional/AddAsetOperasional";
import EditAsetOperasional   from "./pages/AsetOperasional/EditAsetOperasional";
import AddJenisAsetOperasional from "./pages/AsetOperasional/AddJenisAsetOperasional";
import IndexJenisAsetOperasional from "./pages/AsetOperasional/IndexJenisAsetOperasional";
import EditJenisAsetOperasional from "./pages/AsetOperasional/EditJenisAsetOperasional";

import IndexAsetBarangPakai from "./pages/AsetBarangPakai/IndexAsetBarangPakai";
import AddAsetBarangPakai from "./pages/AsetBarangPakai/AddAsetBarangPakai";
import EditAsetBarangPakai from "./pages/AsetBarangPakai/EditAsetBarangPakai";

// ── Manufacturer ──
import IndexManufacturer  from "./pages/Manufacturer/IndexManufacturer";
import AddManufacturer    from "./pages/Manufacturer/AddManufacturer";
import EditManufacturer   from "./pages/Manufacturer/EditManufacturer";

// ── Department ──
import IndexDepartment  from "./pages/Department/IndexDepartment";
import AddDepartment from "./pages/Department/AddDepartment";
import EditDepartment   from "./pages/Department/EditDepartment";

// ── Report ──
import IndexReport      from "./pages/Report/IndexReport";       // halaman admin
import AddReport        from "./pages/Report/AddReport";
import EditReport       from "./pages/Report/EditReport";
import IndexReportStaff from "./pages/Report/IndexReportStaff";  // portal staff

// ── Request Perbaikan ──
import IndexRequestPerbaikan      from "./pages/RequestPerbaikan/IndexRequestPerbaikan";      // halaman admin
import AddRequestPerbaikan        from "./pages/RequestPerbaikan/AddRequestPerbaikan";
import EditRequestPerbaikan       from "./pages/RequestPerbaikan/EditRequestPerbaikan";
import IndexRequestPerbaikanStaff from "./pages/RequestPerbaikan/IndexRequestPerbaikanStaff"; // portal staff

// ── Request Pengadaan ──
import IndexRequestPengadaan      from "./pages/RequestPengadaan/IndexRequestPengadaan";      // halaman manager
import AddRequestPengadaan        from "./pages/RequestPengadaan/AddRequestPengadaan";
import EditRequestPengadaan       from "./pages/RequestPengadaan/EditRequestPengadaan";
import IndexRequestPengadaanStaff from "./pages/RequestPengadaan/IndexRequestPengadaanStaff"; // portal staff

// ── Request Pengadaan ──
import IndexRequestPemakaian from "./pages/RequestPemakaian/IndexRequestPemakaian";    // halaman manager
import AddRequestPemakaian        from "./pages/RequestPemakaian/AddRequestPemakaian";
import IndexRequestPemakaianStaff from "./pages/RequestPemakaian/IndexRequestPemakaianStaff"; // portal staff
import EditRequestPemakaian      from "./pages/RequestPemakaian/EditRequestPemakaian";



// ── Aset Kendaraan ──
import IndexAsetKendaraan      from "./pages/AsetKendaraan/IndexAsetKendaraan";      // halaman admin
import AddAsetKendaraan        from "./pages/AsetKendaraan/AddAsetKendaraan";
import EditAsetKendaraan       from "./pages/AsetKendaraan/EditAsetKendaraan";
import AssignDriver            from "./pages/AsetKendaraan/AssignDriver";            // assign driver ke kendaraan
import IndexAsetKendaraanStaff from "./pages/AsetKendaraan/IndexAsetKendaraanStaff"; // portal staff


// ======================================================
// ================= IMPORT KOMPONEN ====================
// ======================================================

import ProtectedRoute from "./components/ProtectedRoute"; // cek apakah user sudah login
import MainLayout     from "./layouts/MainLayout";        // layout dengan sidebar dan topbar
import Dashboard      from "./pages/Dashboard";           // halaman dashboard



// ======================================================
// ================= KOMPONEN APP =======================
// Mendefinisikan semua route aplikasi.
// Route publik: halaman login (tidak perlu login).
// Route protected: semua halaman lain (wajib login).
// Route tidak dikenal: otomatis redirect ke halaman login.
// ======================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── ROUTE PUBLIK ──
            Tidak perlu login untuk mengakses halaman ini. */}
        <Route path="/" element={<Login />} />


        {/* ── ROUTE PROTECTED ──
            Semua route di dalam sini harus login dulu.
            ProtectedRoute mengecek token di localStorage.
            MainLayout menampilkan sidebar dan topbar. */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* aset material */}
          <Route path="/asetbarangpakai"      element={<IndexAsetBarangPakai />} />
          <Route path="/asetbarangpakai/tambah"        element={<AddAsetBarangPakai />} />
          <Route path="/asetbarangpakai/edit/:id"   element={<EditAsetBarangPakai />} />

          {/* user — hanya bisa diakses admin */}
          <Route path="/user"                   element={<IndexUser />} />
          <Route path="/user/tambah"            element={<AddUser />} />
          <Route path="/user/edit/:id"          element={<EditUser />} />

          {/* aset operasional */}
          <Route path="/asetoperasional"           element={<IndexAsetOperasional />} />
          <Route path="/asetoperasional/tambah"    element={<AddAsetOperasional />} />
          <Route path="/asetoperasional/edit/:id"  element={<EditAsetOperasional />} />
          

          <Route path="/jenisasetoperasional/tambah"    element={<AddJenisAsetOperasional />} />
          <Route path="/jenisasetoperasional"           element={<IndexJenisAsetOperasional />} />
          <Route path="/jenisasetoperasional/edit/:id"  element={<EditJenisAsetOperasional />} />

          {/* manufacturer */}
          <Route path="/manufacturer"           element={<IndexManufacturer />} />
          <Route path="/manufacturer/tambah"    element={<AddManufacturer />} />
          <Route path="/manufacturer/edit/:id"  element={<EditManufacturer />} />
      
          {/* department */}
          <Route path="/department"           element={<IndexDepartment />} />
          <Route path="/department/tambah"    element={<AddDepartment />} />
          <Route path="/department/edit/:id"  element={<EditDepartment />} />

          {/* report — admin ke /report, staff ke /report/staff */}
          <Route path="/report"                 element={<IndexReport />} />
          <Route path="/report/tambah"          element={<AddReport />} />
          <Route path="/report/edit/:id"        element={<EditReport />} />
          <Route path="/report/staff"           element={<IndexReportStaff />} />

          {/* request perbaikan — admin ke /request/perbaikan, staff ke /request/perbaikan/staff */}
          <Route path="/request/perbaikan"              element={<IndexRequestPerbaikan />} />
          <Route path="/request/perbaikan/tambah"       element={<AddRequestPerbaikan />} />
          <Route path="/request/perbaikan/edit/:id"     element={<EditRequestPerbaikan />} />
          <Route path="/request/perbaikan/staff"        element={<IndexRequestPerbaikanStaff />} />

          {/* request pengadaan — manager ke /request/pengadaan, staff ke /request/pengadaan/staff */}
          <Route path="/request/pengadaan"              element={<IndexRequestPengadaan />} />
          <Route path="/request/pengadaan/tambah"       element={<AddRequestPengadaan />} />
          <Route path="/request/pengadaan/edit/:id"     element={<EditRequestPengadaan />} />
          <Route path="/request/pengadaan/staff"        element={<IndexRequestPengadaanStaff />} />
          
          {/* request pemakaian — manager ke /request/pengadaan, staff ke /request/pengadaan/staff */}
          <Route path="/request/pemakaian"              element={<IndexRequestPemakaian />} />
          <Route path="/request/pemakaian/staff"        element={<IndexRequestPemakaianStaff />} />
          <Route path="/request/pemakaian/tambah"       element={<AddRequestPemakaian />} />
          <Route path="/request/pemakaian/edit/:id"     element={<EditRequestPemakaian />} />
          

          {/* aset kendaraan — admin ke /asetkendaraan, staff ke /asetkendaraan/staff */}
          <Route path="/asetkendaraan"              element={<IndexAsetKendaraan />} />
          <Route path="/asetkendaraan/tambah"       element={<AddAsetKendaraan />} />
          <Route path="/asetkendaraan/edit/:id"     element={<EditAsetKendaraan />} />
          <Route path="/asetkendaraan/assign/:id"   element={<AssignDriver />} />
          <Route path="/asetkendaraan/staff"        element={<IndexAsetKendaraanStaff />} />

        </Route>


        {/* ── REDIRECT ──
            Kalau URL tidak cocok dengan route manapun,
            arahkan kembali ke halaman login. */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;