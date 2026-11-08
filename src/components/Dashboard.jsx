import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
const API_URL = import.meta.env.VITE_API_URL;
import AddProductForm from "./AddProductForm";

export default function Dashboard({ onLogout, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  function handleAdded() {
    setRefreshKey((k) => k + 1);
    setShowForm(false);
  }

  function handleClose() {
    setShowForm(false);
  }

  function handleDelete() {
    setRefreshKey((k) => k + 1);
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTrackedProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  let content;

  if (loading) {
    content = <div className="loading-state">Loading products...</div>;
  } else if (error) {
    content = <p>Something went wrong</p>;
  } else if (products.length === 0) {
    content = <p>You currently have no products</p>;
  } else {
    content = (
      <div className="product-grid">
        {products.map((item) => (
          <ProductCard
            onDelete={handleDelete}
            key={item.id}
            id={item.id}
            picture={item.product.picture}
            name={item.product.name}
            target={item.target}
            price={item.product.priceHistory?.[0]?.price ?? null}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-toolbar glass-panel">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>My tracked products</h2>
        </div>

        <button className="primary-button" onClick={() => setShowForm(true)}>
          Add product
        </button>
      </div>

      {showForm ? (
        <AddProductForm onAdded={handleAdded} onCancel={handleClose} />
      ) : (
        content
      )}
    </div>
  );
}

async function fetchTrackedProducts() {
  const res = await fetch(`${API_URL}/products/tracked-products`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
}
