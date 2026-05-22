/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────
//  PageTransition.jsx
//  Drop in: src/components/PageTransition.jsx
//  Wrap every page in <PageTransition> inside your router
// ─────────────────────────────────────────────────────────────
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const variants = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -18,
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
  },
};

/**
 * Usage — wrap your <Routes> in App.jsx:
 *
 *   <AnimatePresence mode="wait">
 *     <Routes location={location} key={location.pathname}>
 *       <Route path="/" element={<PageTransition><HomeNew /></PageTransition>} />
 *       ...
 *     </Routes>
 *   </AnimatePresence>
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}