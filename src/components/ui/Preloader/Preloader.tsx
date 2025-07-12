import { AnimatePresence } from "framer-motion";
import { preloaderContainer, item } from "../../../utils/variants";
import {
  StyledChild,
  StyledPreloaderContainer,
} from "./preloader.style";

export default function Preloader({
  isVisible,
  setIsVisible,
  setExitComplete,
}: {
  isVisible: boolean;
  setIsVisible: (b: boolean) => void;
  preloadExit: boolean;
  setExitComplete: (b: boolean) => void;
}) {
  const handleComplete = () => {
    setIsVisible(false);
  };
  return (
    <AnimatePresence onExitComplete={() => setExitComplete(true)}>
      {isVisible && (
        <StyledPreloaderContainer
          variants={preloaderContainer}
          onAnimationComplete={() => handleComplete()}
          initial="closed"
          animate="open"
          exit="closed"
          className=""
        >
          <StyledChild background="#a66740" variants={item} color="#DDDBDB">
            <h3 className="text-2xl">Frontend</h3>
          </StyledChild>
          <StyledChild background="#DDDBDB" variants={item} color="#3B3D5A">
            <h3 className="text-2xl">Backend</h3>
          </StyledChild>
          <StyledChild background="#0e0d0d" variants={item} color="#DDDBDB">
            <h3 className="text-2xl">Design</h3>
          </StyledChild>
          <StyledChild background="#382542" variants={item} color="#DDDBDB">
            <h3 className="text-2xl">Fullstack</h3>
          </StyledChild>

        </StyledPreloaderContainer>
      )}
    </AnimatePresence>
  );
}
