import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { SHOTS } from "@/data/showcase";
import { CardCreative } from "@/components/CardCreative";

export interface CarouselRingHandle {
  placeCards: () => void;
}

const RING_RADIUS = 891; // Cylinder radius R matches CSS perspective: 891px so camera sits at ring centre
const CARD_COUNT = 37;
const STEP_DEG = 360 / CARD_COUNT; // 9.7297° spacing yields ~8–9 cards inside the ±42° front arc
const CULL_DEG = 42;
const SPEED_DEG_PER_SEC = 1.9;

const CARD_SLOTS = Array.from(
  { length: CARD_COUNT },
  (_, index) => SHOTS[index % SHOTS.length]
);

export const CarouselRing = forwardRef<CarouselRingHandle>(
  function CarouselRing(_props, ref) {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const phaseRef = useRef<number>(-2);

    const placeCards = useCallback(() => {
      const phase = phaseRef.current;
      for (let i = 0; i < CARD_COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        // Signed angle wrapped into [-180, 180) so back-half cards (>42°) are culled cleanly
        const a = (((i * STEP_DEG + phase) % 360) + 540) % 360 - 180;
        if (Math.abs(a) > CULL_DEG) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";

        // Tangent placement on cylinder of radius R=891 facing the camera at (0, 0, R)
        const r = (a * Math.PI) / 180;
        const c = Math.cos(r);
        el.style.transform = `translate3d(${RING_RADIUS * Math.sin(r)}px, 0, ${RING_RADIUS * (1 - c)}px) rotateY(${-a}deg)`;
        el.style.filter = `brightness(${0.84 + 0.5 * (1 / c - 1)})`;
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        placeCards,
      }),
      [placeCards]
    );

    useEffect(() => {
      placeCards();

      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      let rafId = 0;
      let lastTime = performance.now();

      const onVisibilityChange = () => {
        // Reset clock when returning from a background tab so phase never jumps
        lastTime = performance.now();
      };

      document.addEventListener("visibilitychange", onVisibilityChange);

      const tick = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        if (!mq.matches) {
          phaseRef.current -= SPEED_DEG_PER_SEC * dt;
        }
        placeCards();
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }, [placeCards]);

    return (
      <div className="ring" aria-hidden="true">
        {CARD_SLOTS.map((shot, index) => (
          <div
            key={index}
            className="card"
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
          >
            <CardCreative shot={shot} />
          </div>
        ))}
      </div>
    );
  }
);

