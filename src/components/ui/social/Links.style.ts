import styled from "styled-components";
import { motion } from "framer-motion";

export const LinksWrapper = styled(motion.ul)`
  position: fixed;
  bottom: 110px;
  left: 70px;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 5px 5px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;

 

    & .item {
      background: transparent;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: grid;
      place-items: center;
      & .item--icon {
        font-size: 20px;
      }
    }
  

  /* @media screen and (max-width: 600px) {
    flex-direction: row;
    width: 200px;
    right: 5px;
    top: 17px;
  } */

  
`;

export const ToggleButton = styled(motion.div)`
  position: fixed;
  bottom: 60px;
  left: 70px;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
`;
