import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { MainStyle, ProgressBarStyle } from "./Main.style";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Toggle from "../components/ui/social/Toggle";
import { useContext,  useState } from "react";
import { Links } from "../components/ui/social/Links";
import { StoreContext } from "../store";
import Preloader from "../components/ui/Preloader/Preloader";

export default function Main({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const [toggle, setToggle] = useState(false);
  const { globalState } = useContext(StoreContext);
  const [preloader, setPreloader] = useState(window.location.pathname === "/");
  const [isPreloadExitComplete, setIsPreloadExitComplete] = useState(
    window.location.pathname !== "/"
  );
  const [scrX, setScrX] = useState(0)

  const handleToggle = () => {
    setToggle(!toggle)
  }

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrX(latest)
  });


  return (
    <>
      <Preloader
        preloadExit={isPreloadExitComplete}
        isVisible={preloader}
        setIsVisible={setPreloader}
        setExitComplete={setIsPreloadExitComplete}
      />
      {!preloader && isPreloadExitComplete && (
        <>
          <MainStyle className="bg-dark">
            <ProgressBarStyle
              className="progress-bar"
              scrX={scrX}
              style={{ scaleX: scrollYProgress }}
            ></ProgressBarStyle>
            <Navbar />
            <main
              className={` w-full inline-block z-0 px-32 xl:px-24 lg:px-16 md:px-12 sm:px-8 xs:px-2 pb-64 ${className} ${globalState.layoutClass}`}
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
      )}
    </>
  );
}
