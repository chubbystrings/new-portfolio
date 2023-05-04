import { motion } from "framer-motion";
import { singleWord, title } from "../../utils/variants";
export default function AnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full mx-auto py-2 flex items-center justify-center text-center overflow-hidden sm:py-0`}
    >
      <motion.h1
        variants={title}
        initial="initial"
        whileInView="animate"
        className={` inline-block w-full text-dark font-bold capitalize ${className}`}
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={index + "-" + word}
            className={`${
              index === 0
                ? "text-light"
                : index % 2 === 0
                ? "text-secondary"
                : "text-light"
            } inline-block`}
            variants={singleWord}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}
