import styled from "styled-components";
import { motion } from "framer-motion";

interface Props {
  background: string;
  color: string;
}

export const StyledPreloaderContainer = styled(motion.div)`
  height: 100vh;
  background-image: linear-gradient(to right, var(--dark), var(--main));
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

export const StyledChild = styled(motion.div)<Props>`
  background-color: ${(props) => props.background};
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  & h3 {
    color: ${(props) => props.color};
  }

  @media screen and (max-width: 350px) {
    & h3 {
      word-wrap: break-word;
      word-break: break-all;
      transform: rotate(90deg);
      margin: 0;
      padding: 0;
      line-height: 15px;
    }
  }

  @media screen and (max-width: 250px) {
    & h3 {
      font-size: 10px;
    }
  }
`;
