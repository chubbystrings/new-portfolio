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
        <CustomLink type="link" to="/galleries">
          Gallery
        </CustomLink>
        <CustomLink type="link" to="/games">
          Games
        </CustomLink>
        <CustomLink type="link" to="/playlist">
          Favorite Playlist
        </CustomLink>
      </nav>
      <nav className="flex items-center justify-center gap-4">
        <a
          href="/images/resume.pdf"
          target="_blank"
          className=" btn-class transition-all ease duration-300   "
        >
          Resumes
          <LinkArrow className="w-3 h-3" />
        </a>
        <motion.a
          href="https://twitter.com/soft__code"
          target="_blank"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <TwitterIcon className="w-3 mr-3" />
        </motion.a>
        <motion.a
          href="https://github.com/chubbystrings"
          target="_blank"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <GithubIcon className="w-3 mr-3" />
        </motion.a>
        <motion.a
          href="https://linkedin.com/in/emekaokwor"
          target="_blank"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <LinkedInIcon className="w-3 mr-3" />
        </motion.a>
      </nav>
    </div>
  );
}
