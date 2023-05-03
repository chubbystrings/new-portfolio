/* eslint-disable react-hooks/exhaustive-deps */
import { motion, useInView } from "framer-motion";
import { cardVariants } from "../../../utils/variants";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import getImageByKey from "../../../utils/getImageByKey";
import { SkillsCardWrapper } from "./skills.style";

export default function Skills() {
  const skillRef = useRef(null);
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef);
  const [child, setChild] = useState("");
  const [imageKeys, setImageKeys] = useState([
    "javascript",
    "html",
    "css",
    "node",
    "react",
    "typescript",
    "travis",
    "docker",
    "vue",
    "postgresql",
    "mongodb",
    "firebase",
  ]);


  function shuffle(array: string[]) {
    const newArr = [...array]
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }

    return newArr
  }

  function random(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 5)) + min;
  }

  function calculateChild(i: number) {
    return `
    & > div:nth-of-type(${i}) {
      height: ${random(150, 50) + 150}px;
      max-width: 200px;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
      perspective: 1px;
    }
    `;
  }

  function calculateChildren(cards: number) {
    let str = "";

    for (let i = 0; i <= cards; i++) {
      str += calculateChild(i);
    }

    return str;
  }

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      setChild(calculateChildren(imageKeys.length));
      setImageKeys(shuffle(imageKeys))
    }, 5000);

    if (!inView) {
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [inView]);

  useEffect(() => {
    setChild(calculateChildren(imageKeys.length));
  }, []);

  return (
    <div className="my-20 w-full flex flex-col items-center" ref={skillRef}>
      <motion.h2
        className="font-bold text-6xl lg:text-4xl sm:text-2xl mb-12 w-full text-center text-light xs:text-md xxs:break-all"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
          delay: 0.1,
        }}
        viewport={{ amount: 0.1 }}
      >
        Skills
      </motion.h2>
      <div className="flex justify-center">
        <SkillsCardWrapper
          cards={imageKeys.length}
          childStyles={child}
          ref={wrapperRef}
          className="lg-md:!flex lg-md:!justify-center lg-md:!items-center lg-md:flex-wrap lg-md:!w-full lg-md:mx-auto"
        >
          {imageKeys.map((key, i) => {
            return (
              <motion.div
                className={`loading transition-height ease duration-100 lg-md:!flex lg-md:!justify-center lg-md:!mr-0`}
                key={i}
                initial="offscreen"
                whileInView="onscreen"
                variants={cardVariants(i)}
                viewport={{ once: true, amount: 0.1 }}
              >
                <div className="w-full h-full flex justify-center flex-col items-center">
                  <div className="w-[70px] h-[70px] xxs:w-[80%] xxs:h-[80%]">
                    <img
                      src={getImageByKey(key)}
                      alt={`${key} logo`}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </SkillsCardWrapper>
      </div>
    </div>
  );
}
