import React from "react";
import { NAV_LINKS } from "@/data/showcase";

interface NavbarProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  navRef: React.RefObject<HTMLElement | null>;
  burgerRef: React.RefObject<HTMLButtonElement | null>;
  linksRef: React.RefObject<HTMLDivElement | null>;
  wmNameRef: React.RefObject<HTMLSpanElement | null>;
  ctaLabelRef: React.RefObject<HTMLSpanElement | null>;
}

export function Navbar({
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  navRef,
  burgerRef,
  linksRef,
  wmNameRef,
  ctaLabelRef,
}: NavbarProps) {
  return (
    <nav
      ref={navRef}
      className={menuOpen ? "nav open" : "nav"}
      aria-label="Primary"
    >
      <div className="mark" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <defs>
            <linearGradient
              id="sw"
              x1="8"
              y1="8"
              x2="40"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#8ef4ff" />
              <stop offset="50%" stopColor="#35d8ff" />
              <stop offset="100%" stopColor="#0a86d8" />
            </linearGradient>
            <linearGradient
              id="sw2"
              x1="40"
              y1="10"
              x2="10"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#a6f7ff" />
              <stop offset="100%" stopColor="#0f9ae0" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <g transform="rotate(-32 24 24)">
            <ellipse
              cx="24"
              cy="24"
              rx="18.5"
              ry="9.6"
              fill="none"
              stroke="url(#sw2)"
              strokeWidth="3.1"
              strokeLinecap="round"
              strokeDasharray="58 30"
              strokeDashoffset="14"
            />
            <circle cx="41.4" cy="20.6" r="3.1" fill="#bff6ff" />
          </g>
          <circle cx="24" cy="24" r="6.6" fill="url(#sw)" />
          <circle cx="24" cy="24" r="2.6" fill="#fff" />
        </svg>
      </div>

      <div className="wm">
        <span className="kick">SHOPS</span>
        <span className="name" id="wmName" ref={wmNameRef}>
          VERTEX
        </span>
      </div>

      <button
        ref={burgerRef}
        type="button"
        className="burger"
        aria-label="Opens menu"
        aria-expanded={menuOpen}
        aria-controls="navmenu"
        onClick={onToggleMenu}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="navmenu" id="navmenu">
        <div className="links" id="links" ref={linksRef}>
          {NAV_LINKS.map((item) => (
            <a key={item.label} href={item.href} onClick={onCloseMenu}>
              {item.label}
            </a>
          ))}
        </div>
        <a href="#build-new-shop" className="btn" onClick={onCloseMenu}>
          <span id="ctaLabel" ref={ctaLabelRef}>
            Build new shop
          </span>
        </a>
      </div>
    </nav>
  );
}

