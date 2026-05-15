import React, { memo, useEffect, useRef, useState } from "react";

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

const StatItem = ({ value, label, icon, delay = 0 }) => {
  const isNumber = typeof value === "number" && value > 0;
  const { count, ref } = useCountUp(isNumber ? value : 0, 1800);

  return (
    <div
      ref={ref}
      className="flex items-center gap-2.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-lg">{icon}</span>
      <p className="font-bold text-[#3C4959] text-sm whitespace-nowrap">
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

const Starbox = memo(({ brandCount = 0, productCount = 0 }) => {
  return (
    <section
      className="mx-4 sm:mx-6 border border-[#F0CDBE] shadow-sm rounded-xl py-2 sm:py-4 bg-[#F7E6DC]"
      
    >
      <div className="px-5 sm:px-10">
        <div className="grid grid-cols-2 gap-y-3 sm:flex sm:justify-around">
          <StatItem value={productCount} label="Products"  delay={0} />
          <StatItem value={brandCount}   label="Brands"    delay={150} />

          <div className="flex items-center gap-2.5">
            
            <p className="font-bold text-[#3C4959] text-sm">100% Original</p>
          </div>

          <div className="flex items-center gap-2.5">
           
            <p className="font-bold text-[#3C4959] text-sm">Best Price</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Starbox;