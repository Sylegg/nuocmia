import React from "react";

interface HeroStackProps {
  badgeTxtRef: React.RefObject<HTMLElement | null>;
  h1aRef: React.RefObject<HTMLHeadingElement | null>;
  h1bRef: React.RefObject<HTMLParagraphElement | null>;
  sub1Ref: React.RefObject<HTMLParagraphElement | null>;
  sub2Ref: React.RefObject<HTMLParagraphElement | null>;
  vpLabelRef: React.RefObject<HTMLSpanElement | null>;
}

export function HeroStack({
  badgeTxtRef,
  h1aRef,
  h1bRef,
  sub1Ref,
  sub2Ref,
  vpLabelRef,
}: HeroStackProps) {
  return (
    <div className="stack">
      <div className="badge">
        <i aria-hidden="true">
          <svg viewBox="5 1 14 22" preserveAspectRatio="none">
            <path
              d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z"
              fill="rgba(16,112,152,.72)"
              stroke="rgba(190,236,255,.6)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </i>
        <b id="badgeTxt" ref={badgeTxtRef}>
          Professionals at store startup
        </b>
      </div>

      <h1 className="h1 l1" id="h1a" ref={h1aRef}>
        Streamline the shop
      </h1>
      <p className="h1 l2" id="h1b" ref={h1bRef}>
        Process
      </p>

      <p className="sub s1" id="sub1" ref={sub1Ref}>
        <b>
          Restructuring store systems / <span className="nb">E-commerce</span>
        </b>{" "}
        orchestrated with
      </p>
      <p className="sub s2" id="sub2" ref={sub2Ref}>
        checkouts, performance, a sustainable expansion.
      </p>

      <a href="#prices" className="btn cta2">
        <span id="vpLabel" ref={vpLabelRef}>
          See prices
        </span>
      </a>
    </div>
  );
}

