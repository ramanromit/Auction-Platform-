import React, { useEffect, useRef, useState } from "react";

export default function CountUp({
  from = 0,
  to = 100,
  separator = ",",
  direction = "up",
  duration = 1,
  className = "",
  startCounting = true,
  suffix = "",
}) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const [value, setValue] = useState(from);

  const format = (n) => {
    const rounded = Math.round(n);
    if (!separator) return String(rounded) + (suffix || "");
    try {
      return new Intl.NumberFormat("en-US").format(rounded) + (suffix || "");
    } catch (e) {
      return String(rounded) + (suffix || "");
    }
  };

  useEffect(() => {
    if (!startCounting) {
      setValue(from);
      return;
    }

    let started = false;

    const run = () => {
      const startTime = performance.now();
      const fromVal = Number(from) || 0;
      const toVal = Number(to) || 0;
      const diff = toVal - fromVal;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const current = direction === "down"
          ? fromVal - diff * progress
          : fromVal + diff * progress;

        setValue(current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step);
        } else {
          // ensure final value
          setValue(direction === "down" ? toVal : toVal);
        }
      };

      frameRef.current = requestAnimationFrame(step);
    };

    const startWhenVisible = () => {
      if (!ref.current) {
        run();
        return;
      }

      if (typeof IntersectionObserver === "undefined") {
        run();
        return;
      }

      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            obs.disconnect();
          }
        });
      }, { threshold: 0.2 });

      obs.observe(ref.current);
    };

    startWhenVisible();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [from, to, duration, direction, startCounting]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
