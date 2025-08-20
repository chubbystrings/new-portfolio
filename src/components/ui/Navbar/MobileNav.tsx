import { motion } from 'framer-motion';
import { IconContext } from 'react-icons';
import { MdCancel, MdGames, MdHome, MdLibraryMusic, MdPerson, MdPhotoAlbum } from 'react-icons/md';
import CustomLink from './CustomLink';
// import { GithubIcon, LinkArrow, LinkedInIcon, TwitterIcon } from '../Icons';

export default function MobileNav({ setIsOpen }: { setIsOpen: (val: boolean) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[300px] px-3 gap-5 z-30 bg-light/40 rounded-lg backdrop-blur-md py-2 hidden lg:flex justify-between items-center fixed top-[20px] right-[20px]"
    >
      <div
        className=""
        onClick={() => setIsOpen(false)}
      >
        <IconContext.Provider value={{ color: "#4A193E" }}>
          <MdCancel />
        </IconContext.Provider>
      </div>
      <nav className="flex gap-5 items-center justify-center">
        <CustomLink type="button" to="/">
          <MdHome />
        </CustomLink>
        <CustomLink type="button" to="/about">
          <MdPerson />
        </CustomLink>
        <CustomLink type="button" to="/playlist">
          <MdLibraryMusic />
        </CustomLink>
        <CustomLink type="button" to="/galleries">
          <MdPhotoAlbum />
        </CustomLink>
        <CustomLink type="button" to="/games">
          <MdGames />
        </CustomLink>
      </nav>
      {/* <nav className="flex items-center justify-center gap-5 flex-col ">
        <a
          href="/images/resume.pdf"
          target="_blank"
          className=" btn-class transition-all ease duration-300   "
        >
          Resumes
          <LinkArrow className="w-3 h-3" />
        </a>
        <div className="flex gap-3 items-center justify-between">
          <motion.a
            href="https://twitter.com/soft__code"
            target="_blank"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <TwitterIcon className="w-5 mr-3" />
          </motion.a>
          <motion.a
            href="https://github.com/chubbystrings"
            target="_blank"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <GithubIcon className="w-5 mr-3" />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/emekaokwor"
            target="_blank"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <LinkedInIcon className="w-5 mr-3" />
          </motion.a>
        </div>
      </nav> */}
    </motion.div>
  );
}
