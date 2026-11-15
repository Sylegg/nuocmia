import React from "react";
import { HERO_BANNER, PRODUCTS, TRUST_ITEMS } from "@/data/showcase";

export function BrowserMock() {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.add("broken-img");
  };

  return (
    <div className="browser" aria-label="Vertex Shops store preview">
      <div className="bar">
        <div className="dots" aria-hidden="true">
          <i style={{ background: "#ee5c62" }} />
          <i style={{ background: "#f6b719" }} />
          <i style={{ background: "#12c02f" }} />
        </div>

        <div className="omni">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.8-3.8" />
          </svg>
          <span>Shop Focused - Skin Care</span>
        </div>

        <div className="tools" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V4m0 0L8 8m4-4 4 4" />
            <path d="M4 15v5h16v-5" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 3 8l9 5 9-5-9-5Z" fill="#fff" stroke="none" opacity=".95" />
            <path d="M3 13l9 5 9-5" opacity=".55" />
          </svg>
        </div>
      </div>

      <div className="page">
        <div className="ann">
          <u style={{ left: "20px" }}>&#8249;</u>
          <span>Moisturized daily at home</span>
          <u style={{ right: "20px" }}>&#8250;</u>
        </div>

        <div className="shoplogo">
          <em>GLOW</em>
          <i>SKIN CARE</i>
        </div>

        <div className="shopicons" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.8-3.8" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 21c0-4.2 3.4-6.6 7.5-6.6s7.5 2.4 7.5 6.6" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.5 8h13l-1.2 12H6.7L5.5 8Z" />
            <path d="M9 8V6.2A3 3 0 0 1 15 6.2V8" />
          </svg>
        </div>

        <div className="pagebody">
          <div className="pghero">
            <img
              src={HERO_BANNER.url}
              alt={HERO_BANNER.alt}
              onError={handleImgError}
            />
            <div className="scrim" />
            <div className="copy">
              <u>Just added</u>
              <em>
                Let your beauty
                <br />
                be sacred.
              </em>
              <i>EXPLORE TODAY</i>
            </div>
          </div>

          <div className="pgsec">
            <b>Best reviewed</b>
            <u>see more</u>
          </div>

          <div className="pggrid">
            {PRODUCTS.map((product) => (
              <div key={product.name} className="pgcard">
                <div className="ph">
                  <img
                    src={product.url}
                    alt={product.alt}
                    onError={handleImgError}
                  />
                  {product.tag ? <span className="tag">{product.tag}</span> : null}
                </div>
                <b>{product.name}</b>
                <i>{product.meta}</i>
                <s>
                  {product.price}
                  {product.oldPrice ? <span>{product.oldPrice}</span> : null}
                </s>
              </div>
            ))}
          </div>

          <div className="pgstrip">
            {TRUST_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

