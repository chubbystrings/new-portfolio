import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export default function AnimatedNumber({ value, className }: { value: number, className: string }) {
  const ref = useRef(null);

  const motionVal = useMotionValue(0);
  const springValue = useSpring(motionVal, { duration: 3000 });
  const inView = useInView(ref, {once: true});

  useEffect(() => {
    if (inView) {
      motionVal.set(value);
    }
  }, [inView, value, motionVal]);
    
    useEffect(() => {
        springValue.on('change', (latest) => { 
            if (ref.current && latest.toFixed(0) <= value) {
                (ref.current as HTMLElement).textContent = latest.toFixed(0);
            }
        })
    }, [springValue, value])
  return <span ref={ref} className={className}></span>;
}
