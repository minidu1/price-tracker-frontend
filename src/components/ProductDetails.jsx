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
        setLoading(true);
        const data = await getTrackedProductDetails();
        if (data) {
          console.log(data);
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

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return (
      <>
        <p>{error}</p>
        <button Link to="/">
          Dashboard
        </button>
      </>
    );
  } else if (trackedProduct) {
    return (
      <div className="product-details">
        <div className="product-details__image">
          <img
            src={trackedProduct.product.picture}
            alt={trackedProduct.product.name}
          />
        </div>

        <div className="product-details__content">
          <div className="product-details__header">
            <h2>{trackedProduct.product.name}</h2>

            {/* here i have to write the logic to say target reached */}
            {trackedProduct.targetReached && (
              <span className="status-badge success">Target reached</span>
            )}
          </div>

          <div className="product-details__price-row">
            <span className="currency">RS.</span>
            <span className="price">
              {trackedProduct.product.priceHistory?.at(-1)?.price ?? "N/A"}
            </span>
          </div>

          <div className="product-details__meta">
            <span>Target: Rs. {trackedProduct.target}</span>
            {/* here i have to write logic for extact last price date */}
            <span>Last updated: Today</span>
          </div>

          <div className="product-details__actions">
            <a
              href={trackedProduct.product.link}
              target="_blank"
              rel="noreferrer"
            >
              <button className="visit-site-btn">Visit site</button>
            </a>
          </div>
        </div>

        <div className="product-details__history">Price history comes here</div>

        <div className="product-details__description">
          {trackedProduct.product.description}
        </div>
      </div>
    );
  }
}
