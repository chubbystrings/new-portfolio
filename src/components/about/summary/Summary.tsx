/* eslint-disable react-hooks/exhaustive-deps */
import { motion, useInView} from "framer-motion";
import { singleWord, title } from "../../../utils/variants";
import profilePic from "/images/profile.png";
import { useLayoutEffect, useRef, useState } from "react";
import AnimatedText from "../../ui/AnimatedText";

export default function Summary() {


  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef);
  const [data, setData] = useState([
    "An eye for details. .",
    "Problem solving. .",
    "Creativity. .",
    "Adaptability. .",
    "Multitasking. .",
    "communication. ."
  ]);
  const [heading, setHeading] = useState(data[random(data.length - 1, 0)]);


  function shuffle(array: string[]) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }

    return newArr;
  }

  function random(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      setData(shuffle(data))
      setHeading(data[random(data.length - 1, 0)]);
    }, 5000);

    if (!inView) {
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [inView]);
  return (
    <>
      <AnimatedText
        text={heading}
        className="!text-left md:!text-center mb-7 text-8xl xl:!text-7xl lg:!text-6xl md:!text-5xl sm:!text-3xl xs:!text-2xl lg:!w-full xs:!break-all"
        key={heading}
      />
      <div className="grid w-full grid-cols-6 lg:grid-cols-1 gap-16 relative">
        <motion.div
          className="col-span-3 flex flex-col items-start justify-start text-light/75 md:order-2 xxs:col-span-1"
          initial="initial"
          whileInView="animate"
          variants={title}
          ref={wrapperRef}
        >
          <motion.h2
            className="mb-4 font-bold uppercase text-lg text-light/75 md:mx-auto xs:text-sm xxs:break-all"
            variants={singleWord}
          >
            Summary
          </motion.h2>

          <motion.p
            className="font-medium sm:text-center md:text-sm xxs:!break-all"
            variants={singleWord}
          >
            I am a skilled frontend engineer and designer with 4 years of
            experience, I have demonstrated a strong ability to bridge the gap
            between design and development, creating visually stunning and
            highly functional digital products. I possess a deep understanding
            of frontend technologies and frameworks, as well as a keen eye for
            aesthetics and user experience.
          </motion.p>

          <motion.p
            className="font-medium my-1 sm:text-center md:text-sm xxs:!break-all"
            variants={singleWord}
          >
            With a strong background in UI/UX design, I am able to craft
            intuitive and engaging user interfaces that seamlessly integrate
            with backend systems. I have experience working with a range of
            design tools and platforms, and possess a keen ability to turn
            client requirements into tangible and effective design solutions.
          </motion.p>

          <motion.p
            className="font-medium my-1 sm:text-center md:text-sm xxs:!break-all"
            variants={singleWord}
          >
            Overall, my combination of technical expertise and design acumen
            make me a valuable asset to any team or project that seeks to create
            engaging, user-centered digital experiences.
          </motion.p>
        </motion.div>
        <motion.div
          className="col-span-3 relative h-max rounded-2xl  p-8 lg:hidden md:inline-block md:order-1 md:w-full xxs:col-span-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 1.5,
            delay: 1.5,
          }}
          viewport={{ amount: 0.1 }}
        >
          <img
            src={profilePic}
            alt="profile photo"
            className="w-full h-auto rounded-2xl"
          />
        </motion.div>
      </div>
    </>
  );
}
