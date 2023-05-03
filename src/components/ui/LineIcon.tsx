/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useScroll } from "framer-motion";

export default function LineIcon({ reference, className }: { reference: any, className?: string }) {
  const { scrollYProgress } = useScroll({
    target: reference,
    offset: ["center end", "center center"],
    layoutEffect: false,
  });
  return (
    <figure className={`absolute left-0 stroke-secondary ${className}`}>
      <svg className="-rotate-90" width="75" height="75" viewBox="0 0 100 100">
        <motion.circle
          cx="75"
          cy="50"
          r="20"
          className="stroke-secondary fill-none stroke-1"
        />
        <motion.circle
          cx="75"
          cy="50"
          r="20"
          className=" fill-light stroke-[5px]"
          style={{ pathLength: scrollYProgress }}
        />
        <motion.circle
          cx="75"
          cy="50"
          r="10"
          className=" fill-secondary stroke-1 animate-pulse"
        />
      </svg>
    </figure>
  );
}
