import { motion } from "framer-motion";
import styled from "styled-components";

interface Props {
  cards: number;
  childStyles: string
}

// function random(max: number, min: number) {
//     return Math.floor(Math.random() * (max - min + 5)) + min;
// }

// function calculateChild(i: number) {
//     return `
//     & > div:nth-of-type(${i}) {
//       height: ${random(100, 50) + 150}px;
//       max-width: 200px;
//       box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
//       perspective: 1px;
//     }
//     `;
// }

// function calculateChildren(cards: number) {
//     let str = '';

//     for (let i = 0; i <= cards; i++) {
//         str += calculateChild(i)
//     }

//     return str

// }

export const SkillsCardWrapper = styled(motion.div)<Props>`
  width: 60%;
  columns: 3 200px;
  column-gap: 1rem;
  & .loading {
    position: relative;
    background-color: #f5f5f5;
    width: 100%;
    border-radius: 20px;
    margin: 0 1rem 1rem 0;
    display: inline-block;
    padding: 10px;
    
    @media screen and (max-width: 676px) {
      width: calc(100% - 20px);
    }
  }
  ${(props) => props.childStyles};
`;