const API_URL = import.meta.env.VITE_API_URL;

export default function ProductCard({
  picture,
  name,
  price,
  target,
  id,
  onDelete,
}) {
  const numericPrice = price == null ? null : Number(price);
  const numericTarget = target == null ? null : Number(target);

  const targetReached = numericPrice !== null && numericPrice <= numericTarget;

  async function deleteProduct() {
    if (!window.confirm("Remove this product?")) return; // if user cancel, stop function
    //else
    try {
      const res = await fetch(`${API_URL}/products/tracked-products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onDelete(); // tell dashboard to refetch the dashboard
    } catch (err) {
      console.log(err);
      alert("Couldn't delete the product, try again later");
    }
  }

  return (
    <div className="product-card">
      <div className="product-picture">{<img src={picture} alt={name} />}</div>
      <div className="product-name">{name}</div>
      <div className="product-price">
        Current: Rs.{" "}
        {numericPrice == null
          ? "Price unavailable"
          : numericPrice.toLocaleString()}
      </div>
      <div className="target-price">
        Target: Rs. {numericTarget?.toLocaleString()}
      </div>
      <button class= "delete-button" onClick={deleteProduct}>Delete Product</button>
      {targetReached && <div className="target-reach">{targetReached} </div>}
    </div>
  );
}
