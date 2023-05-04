import { MotionValue, motion } from "framer-motion";
import { IconType, IconContext } from "react-icons";

export default function IconProgress({
  Icon,
  scrollYProgress,
  color,
}: {
  image: string;
  Icon: IconType;
  color: string;
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <figure className="absolute top-[-4px] stroke-secondary">
      <svg className="-rotate-90" width="95" height="95" viewBox="0 0 100 100">
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
      </svg>
      <div className="absolute left-[50%] translate-x-[-50%] z-10 top-3">
        <IconContext.Provider value={{ size: "24", color: color }}>
          <Icon />
        </IconContext.Provider>
      </div>
    </figure>
  );
}
