// src/pages/Reports/hooks/useReportsData.js
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios.js"; // <- adjust path if your axios file is elsewhere

/**
 * useReportsData
 * @param {string} url - API endpoint (relative to axios baseURL)
 * @param {object} params - query params object (e.g. { startDate: '2025-10-01', endDate: '2025-10-07' })
 * @param {boolean} enabled - if false, hook won't auto-fetch (useful to wait until user presses 'Fetch')
 */
export const useReportsData = (url, params = {}, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(url, {
          params,
          signal: controller.signal,
        });
        setData(res.data);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error("useReportsData error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
    // JSON.stringify(params) so hook refires if params object changes meaningfully
  }, [url, enabled, JSON.stringify(params)]);

  return { data, loading, error, refetch: () => {} };
};

