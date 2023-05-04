import { motion } from 'framer-motion';
import { IconContext } from 'react-icons';
import { MdCancel } from 'react-icons/md';
import CustomLink from './CustomLink';
import { GithubIcon, LinkArrow, LinkedInIcon, TwitterIcon } from '../Icons';

export default function MobileNav({ setIsOpen}: { setIsOpen: (val: boolean) => void}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[300px]  px-3 gap-5 z-30 bg-light/40 rounded-lg backdrop-blur-md py-10 hidden lg:flex flex-col justify-between items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
  );
}
