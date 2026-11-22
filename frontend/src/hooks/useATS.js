import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { analyzeResume, getATSHistory, getATSById } from "../api/atsApi.js";
import { parseApiError } from "../utils/errorParser.js";

const useATS = () => {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = useCallback(async (file) => {
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await analyzeResume(formData);
      setAnalysis(res.data.data.analysis);
      toast.success("Resume analyzed successfully");
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const fetchHistory = useCallback(async (page = 1) => {
    setHistoryLoading(true);
    try {
      const res = await getATSHistory(page);
      const data = res.data.data;
      setHistory(data.analyses);
      setTotal(data.total);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await getATSById(id);
      setAnalysis(res.data.data.analysis);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
  }, []);

  return {
    analysis,
    history,
    total,
    loading,
    historyLoading,
    analyzing,
    analyze,
    fetchHistory,
    fetchById,
    reset,
  };
};

export default useATS;
