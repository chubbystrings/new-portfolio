import { Variants } from "framer-motion";

export const title = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
        delay: 0.5,
        staggerChildren: 0.5,
    },
  },
};

export const singleWord: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};


export const cardVariants = (index: number): Variants => ({
  offscreen: {
    opacity: 0,
    y: 50,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
      delay: index * 0.2,
    },
  },
});

export const sentence = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      staggerChildren: 0.03
    }
  }
}

export const letter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0
  }
}