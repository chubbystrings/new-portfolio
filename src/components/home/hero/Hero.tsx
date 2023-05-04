import { useRef } from "react";
import { motion } from "framer-motion";
import profileImage from "/images/profile.png";
import AnimatedText from "../../ui/AnimatedText";

export default function Hero() {
  const heroRef = useRef(null);
  return (
    <div
      className="flex  text-dark w-full relative min-h-screen sm:min-h-0 sm:mb-10 pt-10 lg:flex-col md:mb-40 sm:pb-24 md:items-center"
      ref={heroRef}
    >
      <motion.div
        className="w-1/2 md:inline-block lg:w-full md:mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
          delay: 0.8,
        }}
        viewport={{ amount: 0.1 }}
      >
        <img src={profileImage} alt="profile" className="w-full h-auto" />
      </motion.div>
      <div className="w-1/2 flex flex-col items-center lg:w-full sm:w-1/2 xxs:w-full">
        <AnimatedText
          text="Connect, inspire, engage, bring vision into Reality"
          className="text-8xl xl:!text-7xl lg:!text-center lg:!text-6xl md:!text-5xl sm:!text-3xl xs:!text-2xl xxs:!text-lg lg:!w-full xs:!break-all"
        />
      </div>
    </div>
  );
}
