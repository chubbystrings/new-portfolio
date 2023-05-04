/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink} from "react-router-dom";
import { GithubIcon, LinkArrow, LinkedInIcon, TwitterIcon } from "./Icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdCancel } from "react-icons/md";
import { IconContext } from "react-icons";

const CustomLink = ({
  to,
  className,
  type,
  children,
}: {
  to: string;
  className?: string;
  children: any;
  type: "link" | "button";
}) => {
  return (
    <>
      {type === "link" ? (
        <NavLink
          to={to}
          className={`${className} relative group text-light text-lg`}
        >
          {({ isActive }) => (
            <>
              {children}
              <span
                className={` ${
                  isActive ? "w-full" : "w-0"
                } h-[3px] w-0 inline-block bg-light absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300`}
              >
                &nbsp;
              </span>
            </>
          )}
        </NavLink>
      ) : (
        <NavLink
          to={to}
          className={`${className} relative group text-light text-lg`}
        >
          {({ isActive }) => (
            <>
              {children}
              <span
                className={` ${
                  isActive ? "w-full" : "w-0"
                } h-[3px] w-0 inline-block bg-light absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300`}
              >
                &nbsp;
              </span>
            </>
          )}
        </NavLink>
      )}
    </>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <header className="w-full px-32 xl:px-24 lg:px-16 md:px-12 sm:px-8 xs:px-2 py-8 font-medium flex items-center justify-between relative">
      <button
        className="flex-col items-center justify-center hidden lg:flex"
        onClick={handleToggle}
      >
        <span
          className={`bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm  ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm  ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      <div className="w-full flex justify-between items-center lg:hidden">
        <nav className="flex gap-5">
          <CustomLink type="link" to="/">
            Home
          </CustomLink>
          <CustomLink type="link" to="/about">
            About
          </CustomLink>
          <CustomLink type="link" to="/playlist">
            Playlist
          </CustomLink>
        </nav>
        <nav className="flex items-center justify-center gap-5">
          <a
            href="/images/resume.pdf"
            target="_blank"
            className=" gap-3 flex items-center bg-secondary text-light p-2.5 px-6 rounded-lg text-lg font-semibold border-2 border-solid border-transparent transition-all ease duration-300  hover:border-secondary hover:bg-light hover:text-secondary"
          >
            Resume
            <LinkArrow className="w-6" />
          </a>
          <motion.a
            href="https://twitter.com"
            target="_blank"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <TwitterIcon className="w-6 mr-3" />
          </motion.a>
          <motion.a
            href="https://github.com"
            target="_blank"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <GithubIcon className="w-6 mr-3" />
          </motion.a>
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <LinkedInIcon className="w-6 mr-3" />
          </motion.a>
        </nav>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[300px]  px-3 gap-5 z-30 bg-light/40 rounded-lg backdrop-blur-md py-5 hidden lg:flex flex-col justify-between items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <IconContext.Provider value={{ color: "#4A193E" }}>
              <MdCancel />
            </IconContext.Provider>
          </div>
          <nav className="flex gap-5">
            <CustomLink type="button" to="/">
              Home
            </CustomLink>
            <CustomLink type="button" to="/about">
              About
            </CustomLink>
            <CustomLink type="button" to="/playlist">
              Playlist
            </CustomLink>
          </nav>
          <nav className="flex items-center justify-center gap-5 flex-col ">
            <a
              href="/images/resume.pdf"
              target="_blank"
              className=" gap-3 flex items-center bg-secondary text-light p-2.5 px-6 rounded-lg text-lg font-semibold border-2 border-solid border-transparent transition-all ease duration-300  hover:border-secondary hover:bg-light hover:text-secondary"
            >
              Resume
              <LinkArrow className="w-6" />
            </a>
            <div className="flex gap-3 items-center justify-between">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <TwitterIcon className="w-6 mr-3" />
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <GithubIcon className="w-6 mr-3" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <LinkedInIcon className="w-6 mr-3" />
              </motion.a>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
