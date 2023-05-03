import { MotionValue } from "framer-motion";
import { ToggleButton } from "./Links.style";
import { MdContactMail } from "react-icons/md";
import { IconContext } from "react-icons";

export default function Toggle({
  handleToggle,
  toggle,
}: {
  handleToggle: () => void;
  toggle: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  const handleClick = () => handleToggle();
  return (
    <ToggleButton
      onClick={() => handleClick()}
      className={`${
        toggle ? "" : "animate-bounce-slow"
      } xs:!left-[50%] xs:!translate-x-[-50%] xs:!w-[30px] xs:!h-[30px] lg:!left-9 sm:!left-3`}
    >
      <IconContext.Provider value={{ size: "24", color: "#4A193E" }}>
        <MdContactMail />
      </IconContext.Provider>
    </ToggleButton>
  );
}
