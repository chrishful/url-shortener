import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }

  .page {
    width: 100%;
    max-width: 860px;
    margin: 0 auto;
    padding: 80px 48px;
  }

  .top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    margin-bottom: 56px;
  }

  .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 16px;
  }

  h1 {
    font-size: 48px;
    font-weight: 300;
    color: #f0f0f0;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  h1 span { font-weight: 500; color: #fff; }

  .desc {
    font-size: 14px;
    color: #444;
    line-height: 1.7;
    font-weight: 300;
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .input-row {
    display: flex;
    gap: 8px;
  }

  input {
    flex: 1;
    background: #141414;
    border: 1px solid #222;
    border-radius: 10px;
    padding: 16px 20px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #e0e0e0;
    outline: none;
    transition: border-color 0.2s;
  }

  input::placeholder { color: #2e2e2e; }
  input:focus { border-color: #333; }

  .search-btn {
    background: #f0f0f0;
    color: #0a0a0a;
    border: none;
    border-radius: 10px;
    padding: 16px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }

  .search-btn:hover:not(:disabled) { background: #fff; }
  .search-btn:active:not(:disabled) { transform: scale(0.99); }
  .search-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .error-msg {
    font-size: 12px;
    color: #8b4040;
    font-family: 'DM Mono', monospace;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 12px;
    animation: fadeUp 0.3s ease forwards;
  }

  .stat-card {
    background: #141414;
    border: 1px solid #1e1e1e;
    border-radius: 10px;
    padding: 20px;
  }

  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #333;
    margin-bottom: 8px;
  }

  .stat-value {
    font-family: 'DM Mono', monospace;
    font-size: 28px;
    font-weight: 500;
    color: #f0f0f0;
    line-height: 1;
  }

  .stat-sub {
    font-size: 12px;
    color: #444;
    margin-top: 4px;
  }

  .chart-card {
    background: #141414;
    border: 1px solid #1e1e1e;
    border-radius: 10px;
    padding: 24px;
    animation: fadeUp 0.4s ease forwards;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .chart-title {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #444;
  }

  .range-tabs {
    display: flex;
    gap: 4px;
  }

  .range-tab {
    background: none;
    border: 1px solid #1e1e1e;
    border-radius: 6px;
    padding: 5px 10px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #444;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
    letter-spacing: 0.05em;
  }

  .range-tab:hover { border-color: #333; color: #666; }
  .range-tab.active { border-color: #444; color: #e0e0e0; background: #1e1e1e; }

  .short-url-display {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #a0c4a0;
    background: #0d1a0d;
    border: 1px solid #1a2e1a;
    border-radius: 6px;
    padding: 6px 10px;
    display: inline-block;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .spinner {
    width: 14px; height: 14px;
    border: 1.5px solid #555;
    border-top-color: #aaa;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .custom-tooltip {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 10px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #e0e0e0;
  }

  .custom-tooltip .label { color: #555; margin-bottom: 4px; }

  @media (max-width: 680px) {
    .page { padding: 48px 24px; }
    .top { grid-template-columns: 1fr; gap: 32px; }
    h1 { font-size: 32px; }
    .desc { display: none; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .input-row { flex-direction: column; }
  }
`;

const RANGES = [
  {
    label: "1h",
    hours: 1,
    bucketMinutes: 5,
    fmt: (d) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`,
  },
  {
    label: "24h",
    hours: 24,
    bucketMinutes: 60,
    fmt: (d) => `${d.getHours()}:00`,
  },
  {
    label: "3d",
    hours: 72,
    bucketMinutes: 360,
    fmt: (d) =>
      `${d.toLocaleDateString("en", { weekday: "short" })} ${d.getHours()}:00`,
  },
  {
    label: "7d",
    hours: 168,
    bucketMinutes: 1440,
    fmt: (d) => d.toLocaleDateString("en", { month: "short", day: "numeric" }),
  },
];

function buildChartData(visited, range) {
  const now = Date.now();
  const cutoff = now - range.hours * 60 * 60 * 1000;
  const bucketMs = range.bucketMinutes * 60 * 1000;
  const buckets = {};

  const filtered = visited.filter((iso) => new Date(iso).getTime() >= cutoff);

  filtered.forEach((iso) => {
    const t = new Date(iso).getTime();
    const key = Math.floor(t / bucketMs) * bucketMs;
    buckets[key] = (buckets[key] || 0) + 1;
  });

  // fill empty buckets
  const start = Math.floor(cutoff / bucketMs) * bucketMs;
  const end = Math.floor(now / bucketMs) * bucketMs;
  const data = [];
  for (let t = start; t <= end; t += bucketMs) {
    data.push({ time: t, visits: buckets[t] || 0 });
  }
  return data;
}

const CustomTooltip = ({ active, payload, label, fmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{fmt(new Date(label))}</div>
      <div>
        {payload[0].value} visit{payload[0].value !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default function Analytics() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rangeIdx, setRangeIdx] = useState(1); // default 24h

  const handleSearch = async () => {
    if (!input.trim()) return;
    setError("");
    setData(null);
    setLoading(true);
    const code = input.trim().replace(/^https?:\/\/[^/]+\//, "");
    try {
      const res = await fetch(`http://localhost:8080/metrics/${code}`);
      if (res.status === 404) throw new Error("Short URL not found");
      if (!res.ok) throw new Error("Server error");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const range = RANGES[rangeIdx];
  const chartData = data ? buildChartData(data.visited, range) : [];
  const totalVisits = data?.visited?.length ?? 0;
  const windowVisits = chartData.reduce((s, d) => s + d.visits, 0);
  const peak = chartData.reduce((m, d) => Math.max(m, d.visits), 0);
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="top">
          <div>
            <p className="eyebrow">analytics</p>
            <h1>
              See who
              <br />
              <span>clicked.</span>
            </h1>
            <p className="desc">
              Enter a short code or full short URL to see visit metrics and a
              timeline of traffic.
            </p>
          </div>
          <div className="right">
            <div className="input-row">
              <input
                placeholder="abc123 or http://localhost:8080/abc123"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKey}
              />
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={loading || !input.trim()}
              >
                {loading ? <span className="spinner" /> : "Go"}
              </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
            {data && (
              <span className="short-url-display">/{data.shortUrl}</span>
            )}
          </div>
        </div>

        {data && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">total visits</p>
                <p className="stat-value">{totalVisits.toLocaleString()}</p>
                <p className="stat-sub">all time</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">in window</p>
                <p className="stat-value">{windowVisits.toLocaleString()}</p>
                <p className="stat-sub">last {range.label}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">peak bucket</p>
                <p className="stat-value">{peak}</p>
                <p className="stat-sub">
                  per{" "}
                  {range.bucketMinutes < 60
                    ? `${range.bucketMinutes}m`
                    : `${range.bucketMinutes / 60}h`}
                </p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <span className="chart-title">visits over time</span>
                <div className="range-tabs">
                  {RANGES.map((r, i) => (
                    <button
                      key={r.label}
                      className={`range-tab ${i === rangeIdx ? "active" : ""}`}
                      onClick={() => setRangeIdx(i)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 4, right: 0, left: -32, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#a0c4a0"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#a0c4a0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tickFormatter={(t) => range.fmt(new Date(t))}
                    tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "#444" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "#444" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip fmt={range.fmt} />}
                    cursor={{ stroke: "#2a2a2a", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#a0c4a0"
                    strokeWidth={1.5}
                    fill="url(#grad)"
                    dot={false}
                    activeDot={{ r: 3, fill: "#a0c4a0", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
        <div className="nav">
          <button className="nav-btn" onClick={() => navigate("/")}>
            shorten
          </button>
          <button
            className="nav-btn active"
            onClick={() => navigate("/analytics")}
          >
            analytics
          </button>
        </div>
      </div>
    </>
  );
}
