"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { HeroStack } from "@/components/HeroStack";
import { CarouselRing, type CarouselRingHandle } from "@/components/CarouselRing";
import { BrowserMock } from "@/components/BrowserMock";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const CW = 1172;
const TAB_MAX = 1080;
const TAB_MIN = 701;
const DW_MIN = 920;

export function VertexHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const wmNameRef = useRef<HTMLSpanElement | null>(null);
  const ctaLabelRef = useRef<HTMLSpanElement | null>(null);
  const badgeTxtRef = useRef<HTMLElement | null>(null);
  const h1aRef = useRef<HTMLHeadingElement | null>(null);
  const h1bRef = useRef<HTMLParagraphElement | null>(null);
  const sub1Ref = useRef<HTMLParagraphElement | null>(null);
  const sub2Ref = useRef<HTMLParagraphElement | null>(null);
  const vpLabelRef = useRef<HTMLSpanElement | null>(null);
  const ringRef = useRef<CarouselRingHandle | null>(null);

  const kRef = useRef(1);
  const tabletRef = useRef(false);
  const mobileRef = useRef(false);
  const tboostRef = useRef(1);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  // Type fitter (§11) + 3-breakpoint canvas scaling (§10)
  const layout = useCallback(() => {
    const mobile = mobileRef.current;
    const tablet = tabletRef.current;
    const k = kRef.current;
    const tboost = tboostRef.current;

    const h1a = h1aRef.current;
    const h1b = h1bRef.current;
    const sub1 = sub1Ref.current;
    const sub2 = sub2Ref.current;
    const badgeTxt = badgeTxtRef.current;
    const wmName = wmNameRef.current;
    const ctaLabel = ctaLabelRef.current;
    const vpLabel = vpLabelRef.current;
    const linksEl = linksRef.current;

    if (
      !h1a ||
      !h1b ||
      !sub1 ||
      !sub2 ||
      !badgeTxt ||
      !wmName ||
      !ctaLabel ||
      !vpLabel ||
      !linksEl
    ) {
      return;
    }

    if (mobile) {
      // Clear every inline style written by the fitter so phone flow layout owns geometry cleanly
      const fittedEls: HTMLElement[] = [
        h1a,
        h1b,
        sub1,
        sub2,
        badgeTxt,
        wmName,
        ctaLabel,
        vpLabel,
      ];
      for (const el of fittedEls) {
        el.style.fontSize = "";
        el.style.top = "";
        el.style.transform = "";
      }
      linksEl.style.fontSize = "";
      linksEl.style.transform = "";
      Array.from(linksEl.children).forEach((child) => {
        (child as HTMLElement).style.fontSize = "";
      });
      ringRef.current?.placeCards();
      return;
    }

    const measureCanvas = document.createElement("canvas");
    const ctx = measureCanvas.getContext("2d");
    if (!ctx) {
      ringRef.current?.placeCards();
      return;
    }

    const fontOf = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      return {
        css: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
        size,
      };
    };

    const cssScale = (node: HTMLElement | null) => {
      if (!node) return 1;
      const raw = getComputedStyle(node).scale;
      const parsed = raw && raw !== "none" ? parseFloat(raw) : 1;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    };

    const inkWidth = (el: HTMLElement) =>
      el.getBoundingClientRect().width /
      ((mobile ? 1 : k) * cssScale(el.parentElement));

    const capRatio = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
      const m = ctx.measureText("H");
      return (m.actualBoundingBoxAscent || 70) / 100;
    };

    const fitBox = (el: HTMLElement, tw: number, tc: number, pre = "") => {
      el.style.transform = pre;
      el.style.fontSize = `${tc / capRatio(el)}px`;
      const w = inkWidth(el);
      if (w > 0) {
        el.style.transform = `${pre ? pre + " " : ""}scaleX(${tw / w})`;
      }
    };

    const baseline = (el: HTMLElement, y: number) => {
      const { css, size } = fontOf(el);
      ctx.font = css;
      const m = ctx.measureText("Hg");
      const A = m.fontBoundingBoxAscent || size * 0.8;
      const D = m.fontBoundingBoxDescent || size * 0.2;
      el.style.top = `${y - ((size - (A + D)) / 2 + A)}px`;
    };

    const centreLabel = (btn: HTMLElement, el: HTMLElement, capPx: number) => {
      el.style.top = "";
      const probe = document.createElement("i");
      probe.style.cssText =
        "display:inline-block;width:0;height:0;overflow:hidden;vertical-align:baseline";
      el.appendChild(probe);
      const btnRect = btn.getBoundingClientRect();
      const probeRect = probe.getBoundingClientRect();
      el.removeChild(probe);

      const scale = (mobile ? 1 : k) * cssScale(btn);
      const btnH = btnRect.height / scale;
      const base = (probeRect.top - btnRect.top) / scale;
      const BIAS = 1.1;
      el.style.top = `${btnH / 2 - (base - capPx / 2) + BIAS}px`;
    };

    const T = tablet ? tboost : 1;

    fitBox(h1a, 563.5 * T, 37.2 * T, "translateX(-50%)");
    baseline(h1a, 204.5);

    fitBox(h1b, 197.5 * T, 37.2 * T, "translateX(-50%)");
    baseline(h1b, 258.5);

    fitBox(sub1, 389 * T, 8.4 * T, "translateX(-50%)");
    baseline(sub1, 300.5);

    fitBox(sub2, 311 * T, 8.4 * T, "translateX(-50%)");
    baseline(sub2, 316.5);

    fitBox(badgeTxt, 184 * T, 9.4 * T, "translate(2px,-1px)");

    fitBox(wmName, 51 * T, 11.4 * T);
    baseline(wmName, 38.5);

    const navBtn = ctaLabel.parentElement;
    fitBox(ctaLabel, 87 * T, 8.9 * T);
    if (navBtn) centreLabel(navBtn, ctaLabel, 8.9 * T);

    const heroBtn = vpLabel.parentElement;
    fitBox(vpLabel, 76 * T, 9.5 * T);
    if (heroBtn) centreLabel(heroBtn, vpLabel, 9.5 * T);

    linksEl.style.transform = "";
    const linkChildren = Array.from(linksEl.children) as HTMLElement[];
    if (tablet) {
      linkChildren.forEach((child) => {
        child.style.fontSize = "";
      });
    } else if (linkChildren.length > 0) {
      linkChildren.forEach((child) => {
        child.style.fontSize = "";
      });
      const fs = 7.9 / capRatio(linkChildren[0]);
      linkChildren.forEach((child) => {
        child.style.fontSize = `${fs}px`;
      });
      const rowWidth = linksEl.getBoundingClientRect().width / k;
      if (rowWidth > 0) {
        linksEl.style.transform = `scaleX(${317 / rowWidth})`;
      }
    }

    ringRef.current?.placeCards();
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw > TAB_MAX) {
      setMenuOpen(false);
    }

    if (vw <= 700) {
      mobileRef.current = true;
      tabletRef.current = false;
      kRef.current = 1;
      tboostRef.current = 1;
      canvas.style.removeProperty("--k");
      canvas.style.removeProperty("--fill");
      canvas.style.removeProperty("--stshift");
      canvas.style.removeProperty("--sshift");
      canvas.style.removeProperty("--rs");
      layout();
      return;
    }

    mobileRef.current = false;

    if (vw <= TAB_MAX) {
      tabletRef.current = true;
      // Narrow design window continuously from CW (1172) to DW_MIN (920) so k stays seamless at 1080/1081
      let W =
        DW_MIN + ((vw - TAB_MIN) * (CW - DW_MIN)) / (TAB_MAX - TAB_MIN);
      if (vh > vw * 1.15) W = Math.min(W, 900);
      // Use 560 instead of 657 so the mock bleeds off the bottom rather than letterboxing
      const k = Math.min(vw / W, vh / 560);
      const ramp = Math.min(1, (TAB_MAX - vw) / 120);
      const tboost = 1 + 0.14 * ramp;
      let fill = Math.max(0, vh / k - 657);
      let ss = 0;
      let rs = 1;
      let st = 0;
      if (fill > 0) {
        // Three-way split of surplus vertical design height on tablets:
        // 1) push showcase down toward viewport foot, 2) bring ring camera closer via scale, 3) drop hero stack
        ss = Math.min(fill * 0.55, 420) * ramp;
        rs = 1 + Math.min(fill / 1100, 0.75) * ramp;
        const slack = 219.5 - 125 * rs + ss;
        st = Math.max(0, slack / 2 - 28) * ramp;
        fill -= ss;
      }
      kRef.current = k;
      tboostRef.current = tboost;
      canvas.style.setProperty("--k", String(k));
      canvas.style.setProperty("--fill", `${fill}px`);
      canvas.style.setProperty("--stshift", `${st}px`);
      canvas.style.setProperty("--sshift", `${ss}px`);
      canvas.style.setProperty("--rs", String(rs));
    } else {
      tabletRef.current = false;
      tboostRef.current = 1;
      // Use 560 as height divisor so desktop fills width and browser mock bleeds cleanly off the bottom
      const k = Math.min(vw / CW, vh / 560);
      const fill = Math.max(0, vh / k - 657);
      kRef.current = k;
      canvas.style.setProperty("--k", String(k));
      canvas.style.setProperty("--fill", `${fill}px`);
      canvas.style.removeProperty("--stshift");
      canvas.style.removeProperty("--sshift");
      canvas.style.removeProperty("--rs");
    }

    layout();
  }, [layout]);

  // Resize + font readiness wiring
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    const vv = window.visualViewport;
    if (vv) vv.addEventListener("resize", resize);

    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) layout();
      });
    }
    const t1 = window.setTimeout(layout, 400);
    const t2 = window.setTimeout(layout, 1400);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      if (vv) vv.removeEventListener("resize", resize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [resize, layout]);

  // Menu dismissal on outside click and Escape key (§10)
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const nav = navRef.current;
      if (nav && !nav.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Master entrance timeline (§12)
  useEffect(() => {
    const root = document.documentElement;
    const cancelIntroAnimations = () => {
      if (typeof document.getAnimations === "function") {
        document.getAnimations().forEach((anim) => {
          if (anim.id && anim.id.startsWith("intro:")) {
            anim.cancel();
          }
        });
      }
    };

    const settle = () => {
      cancelIntroAnimations();
      root.classList.remove("intro");
      layout();
    };

    if (
      !root.classList.contains("intro") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof Element.prototype.animate !== "function"
    ) {
      settle();
      return;
    }

    const D = window.innerWidth <= 700 ? 0.66 : 1;
    const EXPO = "cubic-bezier(.16,1,.3,1)";
    const SOFT = "cubic-bezier(.22,.61,.36,1)";
    const Y = (px: number) => `0 ${px * D}px`;

    let seq = 0;
    let maxEnd = -1;
    let lastAnim: Animation | null = null;
    let disposed = false;

    const play = (
      el: Element | null,
      from: Keyframe,
      duration: number,
      delay: number,
      easing: string
    ) => {
      if (!el) return;
      const to: Keyframe = { opacity: 1 };
      if ("translate" in from) to.translate = "0 0";
      if ("scale" in from) to.scale = "1";
      if ("clipPath" in from) to.clipPath = "inset(-30% 0 -30% 0)";

      // Individual translate/scale/clip-path properties compose cleanly with CSS transform
      // owned by the pixel-fitter and 3D ring placement loop
      const anim = el.animate([from, to], {
        duration,
        delay,
        easing,
        fill: "both",
      });
      anim.id = `intro:${seq++}`;
      const end = delay + duration;
      if (end >= maxEnd) {
        maxEnd = end;
        lastAnim = anim;
      }
    };

    play(document.querySelector(".nav"), { opacity: 0, translate: Y(-9) }, 620, 60, EXPO);
    play(document.querySelector(".mark"), { opacity: 0, translate: Y(6) }, 520, 150, SOFT);
    play(document.querySelector(".wm"), { opacity: 0, translate: Y(6) }, 520, 185, SOFT);
    document.querySelectorAll(".links a").forEach((a, i) => {
      play(a, { opacity: 0, translate: Y(6) }, 460, 215 + i * 45, SOFT);
    });
    play(document.querySelector(".burger"), { opacity: 0, translate: Y(6) }, 460, 300, SOFT);
    play(document.querySelector(".nav .btn"), { opacity: 0, translate: Y(6) }, 500, 400, SOFT);

    play(
      document.querySelector(".badge"),
      { opacity: 0, translate: Y(11), scale: "0.985" },
      560,
      270,
      EXPO
    );
    play(
      h1aRef.current,
      { opacity: 0, translate: Y(15), clipPath: "inset(100% 0 -30% 0)" },
      900,
      380,
      EXPO
    );
    play(
      h1bRef.current,
      { opacity: 0, translate: Y(15), clipPath: "inset(100% 0 -30% 0)" },
      900,
      470,
      EXPO
    );
    play(sub1Ref.current, { opacity: 0, translate: Y(10) }, 620, 690, EXPO);
    play(sub2Ref.current, { opacity: 0, translate: Y(10) }, 620, 745, EXPO);
    play(
      document.querySelector(".cta2"),
      { opacity: 0, translate: Y(13), scale: "0.985" },
      620,
      830,
      EXPO
    );

    play(
      document.querySelector(".ring"),
      { opacity: 0, translate: Y(18), scale: "0.99" },
      950,
      700,
      EXPO
    );
    play(document.querySelector(".browser"), { opacity: 0, translate: Y(26) }, 900, 900, EXPO);
    play(document.querySelector(".wa"), { opacity: 0, scale: "0.88" }, 500, 1260, EXPO);

    if (lastAnim) {
      (lastAnim as Animation).finished.then(
        () => {
          if (!disposed) settle();
        },
        () => {
          if (!disposed) settle();
        }
      );
    } else {
      settle();
    }

    return () => {
      disposed = true;
      cancelIntroAnimations();
    };
  }, [layout]);

  return (
    <main className="stage">
      <Starfield />

      <div className="canvas" ref={canvasRef}>
        <Navbar
          menuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          onCloseMenu={closeMenu}
          navRef={navRef}
          burgerRef={burgerRef}
          linksRef={linksRef}
          wmNameRef={wmNameRef}
          ctaLabelRef={ctaLabelRef}
        />

        <HeroStack
          badgeTxtRef={badgeTxtRef}
          h1aRef={h1aRef}
          h1bRef={h1bRef}
          sub1Ref={sub1Ref}
          sub2Ref={sub2Ref}
          vpLabelRef={vpLabelRef}
        />

        <div className="showcase">
          <CarouselRing ref={ringRef} />
          <BrowserMock />
        </div>
      </div>

      <WhatsAppButton />
    </main>
  );
}
