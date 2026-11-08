import { Link } from "react-router-dom";
import { parsePrice } from "../utils/price";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductCard({
  picture,
  name,
  price,
  target,
  id,
  onDelete,
}) {
  const numericPrice = parsePrice(price);
  const numericTarget = parsePrice(target);

  const targetReached = numericPrice !== null && numericPrice <= numericTarget;

  async function deleteProduct() {
    if (!window.confirm("Remove this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/tracked-products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onDelete(); // refresh dashboard
    } catch (err) {
      console.error(err);
      alert("Couldn't delete the product, try again later");
    }
  }

  return (
    <div className="product-card">
      <Link to={`/products/${id}`}>
        <div className="product-picture">
          {<img src={picture} alt={name} />}
        </div>
        <div className="product-name">{name}</div>
      </Link>
      <div className="product-price">
        Current: Rs.{" "}
        {numericPrice == null
          ? "Price unavailable"
          : numericPrice.toLocaleString()}
      </div>
      <div className="target-price">
        Target: Rs. {numericTarget?.toLocaleString()}
      </div>
      <button className="delete-button" onClick={deleteProduct}>
        Delete Product
      </button>
      {targetReached && <div className="target-reach">{targetReached} </div>}
    </div>
  );
}
