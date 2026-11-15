import React from "react";
import type { ShotItem } from "@/data/showcase";

interface CardCreativeProps {
  shot: ShotItem;
}

export function CardCreative({ shot }: CardCreativeProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.closest(".card")?.classList.add("broken");
  };

  const im = <img alt="" src={shot.url} onError={handleError} />;

  switch (shot.v) {
    case "pay":
      return (
        <>
          <div className="fill" style={{ background: "#efedea" }} />
          <div className="ph" style={{ top: "112px", bottom: 0 }}>
            {im}
          </div>
          <svg
            className="ph"
            style={{
              top: "118px",
              bottom: 0,
              background: "transparent",
              width: "100%",
              height: "calc(100% - 118px)",
            }}
            viewBox="0 0 130 182"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g
              stroke="#e5202f"
              strokeWidth="8"
              fill="none"
              opacity=".92"
              strokeLinecap="square"
            >
              <path d="M2 42h30M14 30v96M4 100l26-16" />
              <path d="M96 34v58M120 34v58M96 92q12 15 24 0" />
              <path d="M92 108l14 34M126 108l-12 34" />
            </g>
          </svg>
          <div
            className="cv"
            style={{
              top: "20px",
              textAlign: "right",
              fontSize: "3.4px",
              letterSpacing: ".15em",
              color: "#8d9298",
            }}
          >
            METHOD OF CHECKOUTS
          </div>
          <div
            className="cv t-big"
            style={{ top: "32px", fontSize: "14px", color: "#16171b" }}
          >
            Checkouts
          </div>
          <div
            className="cv t-big"
            style={{ top: "47px", fontSize: "14px", color: "#e5202f" }}
          >
            Quick n simple
          </div>
          <div
            className="cv"
            style={{
              top: "76px",
              fontSize: "5.2px",
              fontWeight: 700,
              color: "#16171b",
              lineHeight: 1.7,
            }}
          >
            <div>
              <b className="dot" />
              SPEND VIA <b>ACH</b>
            </div>
            <div style={{ marginTop: "8px" }}>
              <b className="dot sq" />
              OR AT MAX <b>12X</b>
              <br />
              <span style={{ marginLeft: "11px" }}>ON CREDIT</span>
            </div>
          </div>
          <div className="edge" />
        </>
      );

    case "launch":
      return (
        <>
          <div
            className="fill"
            style={{
              background: "linear-gradient(168deg,#f9d9e5,#f3bdd2 55%,#e8a3c0)",
            }}
          />
          <div className="ph" style={{ top: "100px", bottom: 0 }}>
            {im}
            <div
              className="fill"
              style={{
                background:
                  "linear-gradient(180deg,rgba(249,217,229,.97),rgba(249,217,229,0) 30%)",
              }}
            />
          </div>
          <div
            className="cv t-serif"
            style={{ top: "36px", fontSize: "17px", color: "#b03a63" }}
          >
            COLLECTION
          </div>
          <div
            className="cv t-serif"
            style={{ top: "55px", fontSize: "17px", color: "#b03a63" }}
          >
            EXCLUSIVE!
          </div>
          <div className="edge" />
        </>
      );

    case "shop":
      return (
        <>
          <div className="fill" style={{ background: "#fff" }} />
          <div className="ph" style={{ top: 0, height: "148px" }}>
            {im}
          </div>
          <div
            className="cv"
            style={{
              top: "158px",
              fontSize: "5.4px",
              fontWeight: 700,
              letterSpacing: ".09em",
              color: "#16171b",
            }}
          >
            REGIME AT DAWNS
          </div>
          <div
            className="cv"
            style={{ top: "168px", fontSize: "4.2px", color: "#7b8087" }}
          >
            Cleanse · Serum · Moisturize
          </div>
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "180px",
              padding: "4px 11px",
              borderRadius: "20px",
              background: "#16171b",
              fontSize: "4.6px",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: ".05em",
            }}
          >
            Acquire today
          </div>
          <div className="edge" />
        </>
      );

    case "brand":
      return (
        <>
          <div
            className="fill"
            style={{
              background: "linear-gradient(180deg,#0a2a4a,#0d3a63 50%,#08192b)",
            }}
          />
          <div className="ph" style={{ top: "92px", bottom: 0 }}>
            {im}
            <div
              className="fill"
              style={{
                background:
                  "linear-gradient(180deg,rgba(10,42,74,.98),rgba(10,42,74,0) 36%)",
              }}
            />
          </div>
          <div
            className="cv"
            style={{
              top: "16px",
              fontSize: "4.2px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,.82)",
              width: "74px",
            }}
          >
            Formulas light, assessed hypoallergenically n designed with a new
            ritual — revealing since a starting moment.
          </div>
          <div
            style={{
              position: "absolute",
              right: "10px",
              top: "16px",
              fontSize: "5.4px",
              fontWeight: 600,
              color: "#fff",
              opacity: 0.92,
            }}
          >
            ✳ Vertex
          </div>
          <div className="edge" />
        </>
      );

    case "frete":
      return (
        <>
          <div
            className="fill"
            style={{
              background:
                "linear-gradient(158deg,#4a0c80 0%,#7a16a6 40%,#a81fc6 66%,#5c0e90 100%)",
            }}
          />
          <div
            className="ph"
            style={{
              top: "140px",
              bottom: 0,
              opacity: 0.45,
              mixBlendMode: "screen",
            }}
          >
            {im}
          </div>
          <div
            className="fill"
            style={{
              background:
                "radial-gradient(44% 16% at 50% 62%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "-6px",
              right: "-6px",
              top: "44px",
              height: "13px",
              background: "#ff2d8a",
              transform: "rotate(-2.6deg)",
              boxShadow: "0 4px 12px rgba(255,45,138,.5)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "45.5px",
              transform: "rotate(-2.6deg)",
              textAlign: "center",
              fontSize: "5.6px",
              fontWeight: 700,
              letterSpacing: ".05em",
              color: "#fff",
            }}
          >
            OBTAIN AT HOME AND
          </div>
          <div
            className="cv t-big"
            style={{
              top: "64px",
              fontSize: "24px",
              color: "#fff",
              textShadow: "0 3px 0 rgba(84,9,124,.6)",
            }}
          >
            Ships
          </div>
          <div
            className="cv t-big"
            style={{
              top: "87px",
              fontSize: "24px",
              color: "#fff",
              textShadow: "0 3px 0 rgba(84,9,124,.6)",
            }}
          >
            Gratis
          </div>
          <div
            className="cv t-big"
            style={{ top: "113px", fontSize: "19px", color: "#fff" }}
          >
            +
          </div>
          <div className="edge" />
        </>
      );

    case "power":
      return (
        <>
          <div className="ph phf">{im}</div>
          <div
            className="fill"
            style={{
              background:
                "linear-gradient(180deg,rgba(6,5,10,0) 34%,rgba(6,5,10,.55) 52%,rgba(6,5,10,.92) 72%)",
            }}
          />
          <div
            className="cv t-serif"
            style={{ top: "132px", fontSize: "16px", color: "#fff" }}
          >
            A POWER
          </div>
          <div
            className="cv t-serif"
            style={{ top: "150px", fontSize: "16px", color: "#fff" }}
          >
            FEMININE
          </div>
          <div
            className="cv"
            style={{
              top: "171px",
              fontSize: "4.4px",
              letterSpacing: ".07em",
              color: "rgba(255,255,255,.85)",
            }}
          >
            is echoing in all we acquire
          </div>
          <div className="edge" />
        </>
      );

    case "off":
      return (
        <>
          <div className="ph phf">{im}</div>
          <div
            className="fill"
            style={{
              background:
                "linear-gradient(180deg,rgba(3,9,20,0) 30%,rgba(3,9,20,.6) 48%,rgba(3,9,20,.95) 70%)",
            }}
          />
          <div
            className="cv t-big"
            style={{
              top: "126px",
              fontSize: "10px",
              color: "#fff",
              opacity: 0.9,
            }}
          >
            On sale · til
          </div>
          <div
            className="cv t-big"
            style={{
              top: "139px",
              fontSize: "22px",
              color: "#3fe3ff",
              textShadow: "0 0 16px rgba(63,227,255,.5)",
            }}
          >
            50% off
          </div>
          <div className="edge" />
        </>
      );

    case "plain":
    default:
      return (
        <>
          <div className="ph phf">{im}</div>
          <div
            className="fill"
            style={{
              background:
                "linear-gradient(180deg,rgba(4,8,16,0) 38%,rgba(4,8,16,.85) 68%)",
            }}
          />
          <div
            className="cv"
            style={{
              top: "150px",
              fontSize: "5.4px",
              fontWeight: 600,
              letterSpacing: ".2em",
              color: "#fff",
            }}
          >
            {shot.t}
          </div>
          <div className="edge" />
        </>
      );
  }
}

