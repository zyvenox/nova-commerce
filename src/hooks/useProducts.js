
import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../services/ProductService";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(0);

  const retry = useCallback(() => {
    setRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchProducts({
          signal: controller.signal,
        });

        setProducts(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(
          "We couldn't load the collection. Please check your connection and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [requestId]);

  return {
    products,
    isLoading,
    error,
    retry,
  };
}

export default useProducts;
