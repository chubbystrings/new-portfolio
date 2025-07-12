/* eslint-disable react-hooks/exhaustive-deps */
import { motion, useInView } from "framer-motion";
import { singleWord, title } from "../../../utils/variants";
import profilePic from "/images/gibli_1.png";
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

  // write longer summaries based on the data above
  // 0 - An eye for details: Long description about having an eye for details. etc. Do not include the titles
  const dataContext = [
    "I have a keen eye for details, ensuring that every aspect of my work is polished and refined. This attention to detail allows me to create high-quality digital products that meet the highest standards.",
    "I excel at problem-solving, using my analytical skills to identify issues and develop effective solutions. This ability enables me to overcome challenges and deliver results in a timely manner.",
    "My creativity shines through in my work, as I constantly seek innovative ways to enhance user experiences and design visually appealing interfaces. I enjoy thinking outside the box to create unique solutions.",
    "I am adaptable and thrive in dynamic environments, quickly adjusting to new technologies and methodologies. This flexibility allows me to stay current with industry trends and deliver cutting-edge solutions.",
    "I am skilled at multitasking, effectively managing multiple projects simultaneously while maintaining a high level of quality. This ability ensures that I can meet deadlines and deliver results efficiently.",
    "I possess strong communication skills, allowing me to collaborate effectively with team members and clients. I believe that clear communication is essential for successful project outcomes."

  ];
  const [heading, setHeading] = useState(data[random(data.length - 1, 0)]);
  const [headingIndex, setHeadingIndex] = useState(data.indexOf(heading));


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

  useLayoutEffect(() => {
    setHeadingIndex(data.indexOf(heading));
  }, [heading, data]);
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

          <motion.p
            className="font-medium sm:text-center md:text-sm xxs:!break-all"
            initial="initial"
            whileInView="animate"
            key={headingIndex}
            custom={headingIndex}
            variants={singleWord}
          >
            {dataContext[headingIndex]}
          </motion.p>


          {/* <motion.p
            className="font-medium sm:text-center md:text-sm xxs:!break-all"
            variants={singleWord}
          >
            
          </motion.p> */}
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
