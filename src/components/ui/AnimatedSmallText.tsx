import { motion } from "framer-motion";
import { letter, sentence } from "../../utils/variants";

export default function AnimatedSmallText({ text, className}: { text: string, className?: string}) {
  return (
    <motion.p variants={sentence} initial="hidden" whileInView="visible" className={`text-light ${className}`}>
          {
              text.split("").map((char, index) => {
                  return (
                    <motion.span variants={letter} key={char + "-" + index}>
                      {char}
                    </motion.span>
                  );
              })
        }
          
    </motion.p>
  )
}
