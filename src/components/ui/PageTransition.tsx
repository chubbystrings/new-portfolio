import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

// Define the order of routes to determine direction
const routeOrder = ["/", "/about", "/playlist", "/galleries"];

export default function PageTransition({ onAnimationComplete }: { onAnimationComplete?: () => void }) {
  const location = useLocation();
  const { from } = location.state || { from: "/" };

  const fromIndex = routeOrder.indexOf(from);
  const toIndex = routeOrder.indexOf(location.pathname);
  const isGoingBack = fromIndex > toIndex;


  return (
    <>
      {
        !isGoingBack ? (
          <>
            <motion.div className="fixed top-0 bottom-0 left-full w-screen h-screen z-20 bg-primary"
              initial={{ x: "-100%", width: "100%" }}
              animate={{ x: "0%", width: "0%" }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
            ></motion.div>
            <motion.div
              className="fixed top-0 bottom-0 left-full w-screen h-screen z-30 bg-dark"
              initial={{ x: "-100%", width: "100%" }}
              animate={{ x: "0%", width: "0%" }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            ></motion.div>
            <motion.div
              className="fixed top-0 bottom-0 left-full w-screen h-screen z-40 bg-secondary"
              initial={{ x: "-100%", width: "100%" }}
              animate={{ x: "0%", width: "0%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              onAnimationComplete={() => {
                onAnimationComplete?.();
              }}
            ></motion.div>
          </>
        ) : (
          <>
            <motion.div
              className="fixed top-0 bottom-0 right-full w-screen h-screen z-40 bg-secondary"
              initial={{ x: "100%", width: "100%" }}
              animate={{ x: "0%", width: "0%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            ></motion.div>
            <motion.div
              className="fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-dark"
              initial={{ x: "100%", width: "100%" }}
              animate={{ x: "0%", width: "0%" }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            ></motion.div>
            <motion.div className="fixed top-0 bottom-0 right-full w-screen h-screen z-20 bg-primary"
              initial={{ x: "100%", width: "100%" }}
              animate={{ x: "0%", width: "0%" }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
              onAnimationComplete={() => {
                onAnimationComplete?.();
              }}
            ></motion.div>
          </>
        )
      }
    </>
  );
}
