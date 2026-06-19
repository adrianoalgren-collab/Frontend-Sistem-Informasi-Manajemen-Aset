// ======================================================
// === useRole.js
// ======================================================

// ── Konstanta id_role (sumber kebenaran tunggal) ──────
export const ROLES = {
  ADMIN:          1,
  MANAGER:        2,
  STAFF_KANTOR:   3,
  STAFF_LAPANGAN: 4,
  DRIVER:         5,
};

export function useRole() {

  // Ambil user dari localStorage dengan error handling
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const idRole = user?.id_role ?? null;

  // Helper berbasis id_role — tidak bergantung pada format string nama_role
  const isAdmin         = idRole === ROLES.ADMIN;
  const isManager       = idRole === ROLES.MANAGER;
  const isStaffKantor   = idRole === ROLES.STAFF_KANTOR;
  const isStaffLapangan = idRole === ROLES.STAFF_LAPANGAN;
  const isDriver        = idRole === ROLES.DRIVER;

  // Staff = semua role non-admin non-manager
  const isStaff = isStaffKantor || isStaffLapangan || isDriver;

  return {

    // ── DATA USER ──────────────────────────────────────
    userId:   user?.id   ?? null,
    userName: user?.name ?? "",

    // ── ROLE ───────────────────────────────────────────
    idRole,
    roleName: user?.role?.nama_role ?? "",

    // ── DEPARTMENT ─────────────────────────────────────
    departmentId:
      user?.id_department ??
      user?.department?.id_department ??
      null,

    departmentName:
      user?.department?.nama_department ?? "",

    // ── HELPER ROLE ────────────────────────────────────
    isAdmin,
    isManager,
    isStaffKantor,
    isStaffLapangan,
    isDriver,
    isStaff,          // shorthand: semua role non-admin non-manager
  };
}