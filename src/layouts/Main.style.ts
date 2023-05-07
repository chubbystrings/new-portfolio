import { motion } from "framer-motion";
import styled from "styled-components";

interface Props {
  scrX?: number
}

export const MainStyle = styled(motion.div)`
  position: relative;

  & .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: #f5f5f5;
    transform-origin: 0%;
    z-index: 2;
  }

  @media screen and (min-width: 1534px) {
    margin: 0 auto;
  }
`;

export const ProgressBarStyle = styled(motion.div)<Props>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: #f5f5f5;
  transform-origin: 0%;
  z-index: 2;
  transform: ${(props) => props.scrX ? `` : `scaleX(0) !important`};
`;
