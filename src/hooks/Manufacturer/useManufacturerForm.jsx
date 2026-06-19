// ======================================================
// === IMPORT
// ======================================================

import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

// ======================================================
// === CUSTOM HOOK FORM MANUFACTURER
// ======================================================

export const useManufacturerForm = () => {

  // ======================================================
  // === ROUTING / URL PARAMS
  // ======================================================

  const { id } = useParams(); // Ambil ID jika mode edit

  // ======================================================
  // === STATE FORM
  // ======================================================

  const [form, setForm] = useState({
    nama_manufacturer: "",
    email_manufacturer: "",
    telfon_manufacturer: "",
  });

  // ======================================================
  // === HANDLE CHANGE INPUT
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // === STORE (POST /manufacturer)
  // ======================================================

  const storeManufacturer = async () => {
    return await api.post("/manufacturer", form);
  };

  // ======================================================
  // === FETCH BY ID (GET /manufacturer/{id})
  // ======================================================

  useEffect(() => {
    const fetchById = async () => {
      try {
        const res = await api.get(`/manufacturer/${id}`);

        setForm({
          nama_manufacturer: res.data.nama_manufacturer ?? "",
          email_manufacturer: res.data.email_manufacturer ?? "",
          telfon_manufacturer: res.data.telfon_manufacturer ?? "",
        });

      } catch (error) {
        console.error("Gagal mengambil data manufacturer", error);
      }
    };

    if (id) {
      fetchById();
    }
  }, [id]);

  // ======================================================
  // === UPDATE (PUT /manufacturer/{id})
  // ======================================================

  const updateManufacturer = async () => {
    return await api.put(`/manufacturer/${id}`, form);
  };

  // ======================================================
  // === RETURN
  // ======================================================

  return {
    form,
    handleChange,
    storeManufacturer,
    updateManufacturer,
    id,
  };
};