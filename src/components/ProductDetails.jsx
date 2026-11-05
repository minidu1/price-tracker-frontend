import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import { parsePrice } from "../utils/price";
import { formatDate } from "../utils/date";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ProductDetails() {
  const { id } = useParams();

  const [trackedProduct, setTrackedProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //add price vars for save prices extract from db

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
    const price = parsePrice(
      trackedProduct.product.priceHistory?.at(-1)?.price,
    );
    const target = parsePrice(trackedProduct.target);
    const lastUpdate = formatDate(
      trackedProduct.product.priceHistory?.at(-1)?.date,
    );
    const targetReached = price != null && price <= target;

    const chartData = trackedProduct.product.priceHistory.map((p) => ({
      date: formatDate(p.date),
      price: parsePrice(p.price),
    }));

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

            {/* logic to add target reached */}
            {targetReached && (
              <span className="status-badge success">Target reached</span>
            )}
          </div>

          <div className="product-details__price-row">
            <span className="currency">RS.</span>
            <span className="price">{price?.toLocaleString() ?? "N/A"}</span>
          </div>

          <div className="product-details__meta">
            <span>Target: Rs. {target.toLocaleString()}</span>
            {/* show last price updated day */}
            <span>Last updated: {lastUpdate}</span>
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

        <div className="product-details__history">
          {/* width={500} height={400} */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              {/* let y axis to zoom on price instead of chart start at 0 */}
              <YAxis domain={["auto", "auto"]} />
              <XAxis dataKey="date" />
              <Tooltip />
              <Line type="monotone" dataKey="price" />
              <ReferenceLine
                y={target}
                stroke="red"
                strokeDasharray="4 4"
                label="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="product-details__description">
          <ul>
            {trackedProduct.product.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
