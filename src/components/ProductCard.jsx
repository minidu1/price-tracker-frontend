export default function ProductCard({ picture, name, price, target }) {
  const numericPrice = price == null ? null : Number(price);
  const numericTarget = target == null ? null : Number(target);

  const targetReached = numericPrice !== null && numericPrice <= numericTarget;

  return (
    <div className="product-card">
      <div className="product-picture">
        {<img src={picture} alt={name} />}
      </div>
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
      {targetReached && <div className="target-reach">{targetReached} </div>}
    </div>
  );
}
