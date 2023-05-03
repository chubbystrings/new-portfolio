import React from "react";
import { LinksWrapper } from "./Links.style";
import Link from "./Link";
import { IoMdCall } from "react-icons/io";
import { ImWhatsapp } from "react-icons/im";
import { AiOutlineMail } from "react-icons/ai";
import { MotionValue } from "framer-motion";





const container = {
  hidden: {
    opacity: 1,
    scale: 0,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      delayChildren: 1,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const Links: React.FC<{
  toggle: any;
  scrollYProgress: MotionValue<number>;
}> = ({ toggle, scrollYProgress }) => {
  const data = [
    {
      Icon: ImWhatsapp,
      link: "",
      color: 'green',
      content: '08178560896'
    },
    {
      Icon: IoMdCall,
      link: "",
      color: "black",
      content: '08178560896'
    },
    {
      Icon: AiOutlineMail,
      link: "",
      color: 'red',
      content: 'martinsokwor@gmail.com'
    },

  ];

  return (
    <>
      {toggle && (
        <LinksWrapper
          className="container"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {data.map(({ Icon, link, color, content }, index) => (
            <Link
              key={index}
              variants={item}
              Icon={Icon}
              link={link}
              color={color}
              content={content}
              scrollYProgress={scrollYProgress}
            />
          ))}
          
        </LinksWrapper>
      )}
    </>
  );
};
