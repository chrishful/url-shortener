import { useSearchParams } from "react-router-dom";

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
    gap: 16px;
  }

  .code-block {
    background: #141414;
    border: 1px solid #1e1e1e;
    border-radius: 10px;
    padding: 20px;
  }

  .code-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #333;
    margin-bottom: 8px;
  }

  .code-value {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #8b4040;
    word-break: break-all;
  }

  .back-btn {
    display: block;
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
    text-align: center;
    text-decoration: none;
  }

  .back-btn:hover { background: #fff; }
  .back-btn:active { transform: scale(0.99); }

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

export default function NotFound() {
  const [params] = useSearchParams();
  const code = params.get("code");

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="left">
          <p className="eyebrow">404</p>
          <h1>
            Link not
            <br />
            <span>found.</span>
          </h1>
          <p>
            This short URL doesn't exist or may have been deleted. Double-check
            the link or create a new one.
          </p>
        </div>

        <div className="right">
          {code && (
            <div className="code-block">
              <p className="code-label">requested code</p>
              <p className="code-value">/{code}</p>
            </div>
          )}
          <a className="back-btn" href="/">
            shorten a new url
          </a>
        </div>
      </div>
    </>
  );
}
