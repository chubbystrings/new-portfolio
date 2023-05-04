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
          <StyledChild background="#DDDBDB" variants={item} color="#3B3D5A">
            <h3 className="text-2xl">Backend</h3>
          </StyledChild>
          <StyledChild background="#3B3D5A" variants={item} color="#DDDBDB">
            <h3 className="text-2xl">Frontend</h3>
          </StyledChild>
          <StyledChild background="#4A193E" variants={item} color="#f5f5f5">
            <h3 className="text-2xl">Fullstack</h3>
          </StyledChild>
          <StyledChild background="#f5f5f5" variants={item} color="#4A193E">
            <h3 className="text-2xl">Design</h3>
          </StyledChild>
        </StyledPreloaderContainer>
      )}
    </AnimatePresence>
  );
}
