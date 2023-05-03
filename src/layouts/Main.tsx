import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { MainStyle } from "./Main.style";
import { motion, useScroll } from "framer-motion";
import Toggle from "../components/ui/social/Toggle";
import { useState } from "react";
import { Links } from "../components/ui/social/Links";

export default function Main({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle)
  }
  return (
    <>
      <MainStyle className="bg-dark">
        <motion.div
          className="progress-bar"
          style={{ scaleX: scrollYProgress }}
        ></motion.div>
        <Navbar />
        <main
          className={` w-full inline-block z-0 px-32 xl:px-24 lg:px-16 md:px-12 sm:px-8 xs:px-2 pb-64 ${className}`}
        >
          <Outlet />
        </main>
        <Links toggle={toggle} scrollYProgress={scrollYProgress} />
        <Toggle
          toggle={toggle}
          handleToggle={handleToggle}
          scrollYProgress={scrollYProgress}
        />
      </MainStyle>
      <Footer />
    </>
  );
}
