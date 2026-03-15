import { useState } from "react";
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .left .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 16px;
  }

  .left h1 {
    font-size: 48px;
    font-weight: 300;
    color: #f0f0f0;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .left h1 span {
    font-weight: 500;
    color: #fff;
  }

  .left p {
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

  input {
    width: 100%;
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
  input.error { border-color: #8b2020; }

  .shorten-btn {
    width: 100%;
    background: #f0f0f0;
    color: #0a0a0a;
    border: none;
    border-radius: 10px;
    padding: 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    letter-spacing: 0.02em;
  }

  .shorten-btn:hover:not(:disabled) { background: #fff; }
  .shorten-btn:active:not(:disabled) { transform: scale(0.99); }
  .shorten-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .result {
    margin-top: 4px;
    animation: fadeUp 0.3s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .check {
    width: 16px;
    height: 16px;
    background: #1a3a1a;
    border: 1px solid #2d6b2d;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .check svg { width: 8px; height: 8px; }

  .result-url {
    background: #141414;
    border: 1px solid #222;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 8px;
  }

  .result-url a {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #a0c4a0;
    text-decoration: none;
    word-break: break-all;
  }

  .result-url a:hover { color: #c0e0c0; }

  .action-btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .copy-btn, .try-btn {
    background: none;
    border-radius: 8px;
    padding: 11px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
    text-align: center;
    display: block;
    text-decoration: none;
  }

  .copy-btn {
    border: 1px solid #2a2a2a;
    color: #555;
  }

  .copy-btn:hover { border-color: #444; color: #888; }
  .copy-btn.copied { border-color: #2d6b2d; color: #5a9e5a; background: #0d1f0d; }

  .try-btn {
    border: 1px solid #2a2a2a;
    color: #555;
  }

  .try-btn:hover { border-color: #444; color: #888; }

  .error-msg {
    font-size: 12px;
    color: #8b4040;
    font-family: 'DM Mono', monospace;
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

  @media (max-width: 680px) {
    .page {
      grid-template-columns: 1fr;
      gap: 40px;
      padding: 48px 24px;
    }
    .left h1 { font-size: 32px; }
    .left p { display: none; }
  }
`;

export default function App() {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleShorten = async () => {
    if (!url.trim()) return;
    setError("");
    setShortened("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setShortened(data.shortUrl);
    } catch {
      setError("Couldn't reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleShorten();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="left">
          <p className="eyebrow">url shortener</p>
          <h1>
            Make it
            <br />
            <span>shorter.</span>
          </h1>
          <p>
            Paste any long URL and get a clean, shareable short link instantly.
            Powered by Snowflake IDs and base‑62 encoding.
          </p>
        </div>

        <div className="right">
          <input
            type="url"
            placeholder="https://your-long-url.com/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            onKeyDown={handleKey}
            className={error ? "error" : ""}
          />

          <button
            className="shorten-btn"
            onClick={handleShorten}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </button>

          {error && <p className="error-msg">{error}</p>}

          {shortened && (
            <div className="result">
              <div className="result-label">
                <span className="check">
                  <svg
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="#5a9e5a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 5l2 2 4-4" />
                  </svg>
                </span>
                shortened
              </div>
              <div className="result-url">
                <a href={shortened} target="_blank" rel="noreferrer">
                  {shortened}
                </a>
              </div>
              <div className="action-btns">
                <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? "copied!" : "copy link"}
                </button>
                <a
                  className="try-btn"
                  href={shortened}
                  target="_blank"
                  rel="noreferrer"
                >
                  try it out →
                </a>
              </div>
            </div>
          )}
          <div className="nav">
            <button className="nav-btn active" onClick={() => navigate("/")}>
              shorten
            </button>
            <button className="nav-btn" onClick={() => navigate("/analytics")}>
              analytics
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
