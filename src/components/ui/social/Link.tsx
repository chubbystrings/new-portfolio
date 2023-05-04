/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { MotionValue, motion } from "framer-motion";
import { IconType } from "react-icons";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import IconProgress from "../IconProgress";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#03080f",
    boxShadow: "box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;",
    fontSize: 13,
    fontWeight: 600,
  },
}));

const Link: React.FC<{
  variants: any;
  Icon: IconType;
  link: string;
  color: string;
  content: string;
  scrollYProgress: MotionValue<number>
}> = ({ variants, Icon, content, color, scrollYProgress }) => {

  const [openToolTip, setOpenTooltip] = useState(false);

  const handleClick = () => {
    setOpenTooltip(!openToolTip)
  };

  return (
    <LightTooltip
      title={content}
      placement="left-start"
      arrow
      open={openToolTip}
    >
      <motion.li className="item relative" variants={variants}>
        <IconProgress
          scrollYProgress={scrollYProgress}
          image="/logos/react.svg"
          Icon={Icon}
          color={color}
          onClick={handleClick}
        />
      </motion.li>
    </LightTooltip>
  );
};

export default Link;
