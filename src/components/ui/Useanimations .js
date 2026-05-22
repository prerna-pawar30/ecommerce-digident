// ─────────────────────────────────────────────────────────────
//  useAnimations.js  — Tubik-style animation system
//  Drop in: src/hooks/useAnimations.js
// ─────────────────────────────────────────────────────────────

// ── Framer Motion Variants ──────────────────────────────────

/** Fade up: the hero text reveal used in Tubik farm site */
export const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/** Staggered container — wraps a list of children */
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Child item for stagger lists */
export const staggerItem = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Slide in from left */
export const slideLeft = {
  hidden: { opacity: 0, x: -56 },
  show: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/** Slide in from right */
export const slideRight = {
  hidden: { opacity: 0, x: 56 },
  show: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/** Scale fade — for cards, images */
export const scaleFade = {
  hidden: { opacity: 0, scale: 0.94 },
  show: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/** Clip reveal — text/image mask wipe (Tubik signature) */
export const clipReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: (delay = 0) => ({
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay },
  }),
};

/** Page transition wrapper variant */
export const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

// ── Shared viewport config ───────────────────────────────────
export const viewport = { once: true, margin: "-80px" };