import { motion } from "framer-motion";
import { cardVariants } from "../../../utils/variants";
import { PROJECT } from "../../../utils/projects";

export default function Card({ data, index }: { data: PROJECT, index: number }) {
  const { img, description, title, } = data
  
  return (
    <motion.li
      initial="offscreen"
      whileInView="onscreen"
      variants={cardVariants(index)}
      viewport={{ amount: 0.1 }}
    >
      <span className="speaker__details sr-only"></span>
      <label aria-hidden="true">
        <input
          type="radio"
          aria-hidden="true"
          name="speakers"
          id="speaker--1"
          checked={true}
          readOnly
        />
        <span className="slide__wrapper">
          <span className="slide__content">
            <span className="speaker">
              <span className="speaker__image">
                <img src={img} alt="" width="720" height="720" />
              </span>
              <span className="speaker__info">
                <span className="speaker__title">{description}</span>
                <span className="speaker__name">{title}</span>
              </span>
            </span>
          </span>
        </span>
      </label>
    </motion.li>
  );
}
