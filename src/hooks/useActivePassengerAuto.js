import { useCallback, useEffect, useState } from "react";
import api from "../api";

const useActivePassengerAuto = (pollingTime = 5000) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getActiveOrder = useCallback(async () => {
    try {
      const response = await api.get("/api/auto/active", {
        withCredentials: true,
      });

      if (!response.data?.success) {
        setOrder(null);
        return;
      }

      setOrder(response.data.order || null);
      setError("");
    } catch (error) {
      console.error(
        "Get active passenger auto error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to get active booking"
      );

      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getActiveOrder();

    const interval = setInterval(() => {
      getActiveOrder();
    }, pollingTime);

    return () => clearInterval(interval);
  }, [getActiveOrder, pollingTime]);

  return {
    order,
    setOrder,
    loading,
    error,
    refresh: getActiveOrder,
    hasActiveOrder: Boolean(order),
  };
};

export default useActivePassengerAuto;