import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

  useEffect(() => {
    async function getTrackedProductDetails() {
      const res = await fetch(`${API_URL}/products/tracked-products/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const err = new Error(data.message);
        err.status = res.status; //add the status code to catch any 404s in outer
        throw err;
      }

      return data;
    }

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getTrackedProductDetails();
        setTrackedProduct(data);
      } catch (err) {
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
    return <div className="loading-state">Loading...</div>;
  }
  if (error) {
    return (
      <div className="centered-message">
        <p>{error}</p>
        <Link to="/" className="text-link-button">
          Go to dashboard
        </Link>
      </div>
    );
  }
  if (!trackedProduct) return null;
  else {
    const history = trackedProduct.product.priceHistory ?? [];
    const hasHistory = history.length > 0;
    const latest = history.at(-1);

    const price = parsePrice(latest?.price);
    const target = parsePrice(trackedProduct.target);
    const lastUpdate = formatDate(latest?.date);
    const targetReached = price != null && price <= target;

    const chartData = trackedProduct.product.priceHistory.map((p) => ({
      date: formatDate(p.date),
      price: parsePrice(p.price),
      target: target,
    }));

    const priceValues = chartData
      .map((point) => point.price)
      .filter((value) => value != null);
    const yMin = Math.min(...priceValues, target ?? Infinity);
    const yMax = Math.max(...priceValues, target ?? -Infinity);
    const paddedMin = yMin === 0 ? 0 : yMin * 0.9;
    const paddedMax = yMax === 0 ? 1 : yMax * 1.1;

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

            {targetReached && (
              <span className="status-badge success">Target reached</span>
            )}
          </div>

          <div className="product-details__price-row">
            <span className="currency">RS.</span>
            <span className="price">
              {price?.toLocaleString() ?? "No price yet"}
            </span>
          </div>

          <div className="product-details__meta">
            <span>Target: Rs. {target?.toLocaleString()}</span>
            {hasHistory && <span>Last updated: {lastUpdate}</span>}
          </div>

          <div className="product-details__actions">
            <a
              href={trackedProduct.product.link}
              target="_blank"
              rel="noreferrer"
              className="visit-site-btn"
            >
              Visit site
            </a>
          </div>
        </div>

        <div className="product-details__history">
          {hasHistory ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 16, right: 20, left: 0, bottom: 8 }}
              >
                <YAxis
                  domain={[paddedMin, paddedMax]}
                  tickFormatter={(value) =>
                    `Rs ${Number(value).toLocaleString()}`
                  }
                />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => [
                    `Rs ${Number(value).toLocaleString()}`,
                    "Price",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#7fd8ff"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#7fd8ff" }}
                  activeDot={{ r: 5 }}
                  name="Price"
                />
                {target != null && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ff9d9d"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    dot={false}
                    name="Target"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No price data yet. Daily check will add one</p>
          )}
        </div>

        <div className="product-details__description">
          <ul>
            {trackedProduct.product.description?.length ? (
              trackedProduct.product.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            ) : (
              <li>No description available</li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
