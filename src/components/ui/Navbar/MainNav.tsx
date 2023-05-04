import { motion } from 'framer-motion';
import { GithubIcon, LinkArrow, LinkedInIcon, TwitterIcon } from '../Icons';
import CustomLink from './CustomLink';

export default function MainNav() {
  return (
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
  );
}
