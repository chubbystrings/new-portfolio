import { motion } from "framer-motion";
import styled from "styled-components";

interface Props {
  cards: number;
  childStyles: string
}



export const SkillsCardWrapper = styled(motion.div)<Props>`
  /* width: 60%;
  columns: 3 200px;
  column-gap: 1rem; */
  & .loading {
    position: relative;
    background-color: #f5f5f5;
    width: 200px;
    border-radius: 20px;
    margin: 0 1rem 1rem 0;
    display: inline-block;
    padding: 10px;
  }

  @media screen and (max-width: 479px) {
    /* width: calc(100% - 20px); */
    width: 100%

  }
  ${(props) => props.childStyles};
`;