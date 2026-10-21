import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function AddProductForm({ onAdded, onCancel }) {
  const [productUrl, setProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ urlError: "", targetPriceError: "" });
  const [serverError, setServerError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("")

    const newErrors = { urlError: "", targetPriceError: "" };

    if (productUrl.trim() === "") {
      newErrors.urlError = "Url is empty";
    } else {
      try {
        new URL(productUrl.trim());
      } catch {
        newErrors.urlError = "Invalid Url";
      }
    }

    if (
      targetPrice === "" ||
      !Number.isFinite(Number(targetPrice)) ||
      Number(targetPrice) <= 0
    ) {
      newErrors.targetPriceError = "Please enter a valid price";
    }

    setError(newErrors);

    //if there is an error in newError values, return
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({link: productUrl,target:Number(targetPrice) }),
        credentials: "include",
      });
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message);
      }
      onAdded()
    } catch (err) {
       if (err instanceof TypeError) {
        setServerError("Unable to connect. Please try again later.");
      } else {
        setServerError(err.message);
      }
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className="form">
      <h2>Add a Product</h2>

      <form onSubmit={handleSubmit} noValidate>

        <div className="form-group">
          <div>
            <label htmlFor="product-url">Product Url</label>
            <span className="error" aria-live="polite">
              {error.urlError}
            </span>
          </div>
          <input
            id="product-url"
            type="url"
            value={productUrl}
            onChange={(e) => {
              setProductUrl(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <div>
            <label htmlFor="target-price">Target price</label>
            <span className="error" aria-live="polite">
              {error.targetPriceError}
            </span>
          </div>
          <input
            id="target-price"
            type="number"
            value={targetPrice}
            onChange={(e) => {
              setTargetPrice(e.target.value);
            }}
          />
        </div>

        <div className="error">{serverError}</div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding product..." : "Add product"}
        </button>
        <button type="button" disabled= {loading} onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
