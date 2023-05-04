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
        toggle ? "" : "animate-bounce"
      }  lg:!left-14 sm:!left-6`}
    >
      <IconContext.Provider value={{ size: "24", color: "#4A193E" }}>
        <MdContactMail />
      </IconContext.Provider>
    </ToggleButton>
  );
}
