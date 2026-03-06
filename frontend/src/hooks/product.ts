import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { product } from "@/types";

const useProduct = () => {
    const url = "http://localhost:4000/api/v1/products";

    const [products, setProducts] = useState<product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get(url);
            setProducts(response.data.products);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            if (!isMounted) return;
            await fetchProducts();
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [fetchProducts]);

    return { products, loading, error };
};

export default useProduct;