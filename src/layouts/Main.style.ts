import { motion } from "framer-motion";
import styled from "styled-components";

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
`;
