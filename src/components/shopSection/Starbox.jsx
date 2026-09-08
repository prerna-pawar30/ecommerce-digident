import React, { memo, useEffect, useRef, useState } from "react";
import { HiCube, HiTag, HiBadgeCheck, HiCurrencyRupee } from "react-icons/hi";

/* Counts from 0 → target over `duration` ms, starts when element enters viewport */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (target <= 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const StatItem = ({ value, label, icon }) => {
  const isNumber = typeof value === "number" && value > 0;
  const { count, ref } = useCountUp(isNumber ? value : 0, 1800);

  return (
    <div
      ref={ref}
      className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 text-left"
    >
      <span className="flex items-center justify-center w-5 h-5 sm:w-auto sm:h-auto rounded-full bg-white sm:bg-transparent shadow-sm sm:shadow-none text-[#E68736] text-xs sm:text-lg shrink-0">
        {icon}
      </span>
      <p className="font-bold text-[#3C4959] text-xs sm:text-sm whitespace-nowrap">
        {isNumber ? (
          <>
            <span
              style={{
                display: "inline-block",
                minWidth: "2.5ch",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {count.toLocaleString()}
            </span>
            +{" "}
          </>
        ) : (
          "... "
        )}
        {label}
      </p>
    </div>
  );
};

const StaticStatItem = ({ text, icon }) => (
  <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 text-left">
    <span className="flex items-center justify-center w-5 h-5 sm:w-auto sm:h-auto rounded-full bg-white sm:bg-transparent shadow-sm sm:shadow-none text-[#E68736] text-xs sm:text-lg shrink-0">
      {icon}
    </span>
    <p className="font-bold text-[#3C4959] text-xs sm:text-sm whitespace-nowrap">
      {text}
    </p>
  </div>
);

const Starbox = memo(({ brandCount = 0, productCount = 0 }) => {
  return (
    <section className="site-container">
      <div className="border border-[#F0CDBE] shadow-sm rounded-xl py-2 sm:py-4 bg-[#F7E6DC] px-4 sm:px-10">
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 sm:flex sm:justify-around sm:gap-0">
          <StatItem value={productCount} label="Products" icon={<HiCube />} />
          <StatItem value={brandCount} label="Brands" icon={<HiTag />} />
          <StaticStatItem text="100% Original" icon={<HiBadgeCheck />} />
          <StaticStatItem text="Best Price" icon={<HiCurrencyRupee />} />
        </div>
      </div>
    </section>
  );
});

export default Starbox;