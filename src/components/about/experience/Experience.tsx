import { useScroll, motion } from "framer-motion";
import { useRef } from "react";
import LineIcon from "../../ui/LineIcon";

interface Props {
  position: string;
  company: string;
  companyLink: string;
  time?: string;
  work?: string;
  address?: string;
}
const Details = ({
  position,
  company,
  companyLink,
  time,
  work,
  address,
}: Props) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      className="my-8 first:mt-0 last:mt-0 w-[60%] mx-auto flex flex-col justify-between text-left"
    >
      <LineIcon reference={ref} className="xxs:!-left-8" />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
      >
        <h3 className="capitalize text-2xl font-bold text-light sm:text-lg xs:text-sm xxs:break-all">
          {position}&nbsp;
          <a
            target="_blank"
            className="text-secondary font-medium  xxs:break-all"
            href={companyLink}
          >
            @{company}
          </a>
        </h3>
        <span className="font-medium capitalize text-light/75 sm:text-lg xs:text-sm xxs:break-all">
          {time} | {address}
        </span>
        <p className="text-light/75 w-full sm:text-lg xs:text-sm xxs:break-all">{work}</p>
      </motion.div>
    </li>
  );
};

export default function Experience() {
  const ref = useRef(null);
  const experienceRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });
  return (
    <div className="mt-24 mb-[20px] w-full" ref={experienceRef}>
      <motion.h2
        className="text-6xl lg:text-4xl sm:text-2xl mb-12 w-full text-center text-light xs:text-md xxs:break-all"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
          delay: 0.1,
        }}
        viewport={{ amount: 0.1 }}
      >
        Experience
      </motion.h2>
      <div className="w-[75%] mx-auto relative xs:w-full" ref={ref}>
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-light origin-top xxs:left-0"
        ></motion.div>
        <ul className="w-full flex flex-col item-start justify-between ml-4">
          <Details
            position="Frontend Engineer"
            company="seamlessHR"
            companyLink="https://semalesshr.com"
            time="2022-present"
            work="built and maintained the seamlessHR enterprise Sass application"
            address="Lagos, Nigeria"
          />
          <Details
            position="Frontend Engineer"
            company="seamlessHR"
            companyLink="https://semalesshr.com"
            time="2022-present"
            work="built and maintained the seamlessHR enterprise Sass application"
            address="Lagos, Nigeria"
          />
          <Details
            position="Frontend Engineer"
            company="seamlessHR"
            companyLink="https://semalesshr.com"
            time="2022-present"
            work="built and maintained the seamlessHR enterprise Sass application"
            address="Lagos, Nigeria"
          />
          <Details
            position="Frontend Engineer"
            company="seamlessHR"
            companyLink="https://semalesshr.com"
            time="2022-present"
            work="built and maintained the seamlessHR enterprise Sass application"
            address="Lagos, Nigeria"
          />
          <Details
            position="Frontend Engineer"
            company="seamlessHR"
            companyLink="https://semalesshr.com"
            time="2022-present"
            work="built and maintained the seamlessHR enterprise Sass application"
            address="Lagos, Nigeria"
          />
        </ul>
      </div>
    </div>
  );
}
