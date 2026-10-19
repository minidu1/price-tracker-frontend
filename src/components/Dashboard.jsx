import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard({ onLogout, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, []);

  let content;

  if (loading) {
    content = <p>Loading products...</p>;
  } else if (error) {
    content = <p>Something went wrong</p>;
  } else if (products.length === 0) {
    content = <p>You currently have no products</p>;
  } else {
    content = (
      <div className="product-grid">
        {products.map((item) => (
          <ProductCard
            key={item.id}
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
    <>
      {/* Always visible */}
      <p>this is dashboard</p>
      <p>hello {user.name}</p>
      <button onClick={onLogout}>Logout</button>

      {/* Changes depending on the state */}
      {content}
    </>
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
