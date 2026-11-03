import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { id } = useParams();

  const [trackedProduct, setTrackedProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getTrackedProductDetails() {
      const res = await fetch(`${API_URL}/products/tracked-products/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const err = new Error(data.message); //make an error obj
        err.status = res.status; //add the status code to catch any 404s
        throw err;
      }

      return data;
    }

    async function load() {
      try {
        setLoading(true)
        const data = await getTrackedProductDetails();
        if (data) {
          setTrackedProduct(data);
        }
      } catch (err) {
        console.log(err);
        if (err.status === 404) {
          setError("Product not found");
        } else {
          setError("Couldn't get product. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  //have to write the ui
  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>{error}</p>;
  } else if (trackedProduct) {
    return <p>{trackedProduct.target}</p>; //have to wrrite the ui
  }
}
