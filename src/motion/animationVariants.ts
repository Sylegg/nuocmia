import { EASE_OUT_EXPO, MOTION_DURATIONS, PREMIUM_SPRING } from "./motionConfig";

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.detailReveal,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
      ease: EASE_OUT_EXPO,
    },
  },
};

export const heroHeadingVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE_OUT_EXPO,
    },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.08,
    },
  },
};

export const drawerSlideVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: PREMIUM_SPRING,
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.26,
      ease: EASE_OUT_EXPO,
    },
  },
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.26, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22, ease: EASE_OUT_EXPO },
  },
};
