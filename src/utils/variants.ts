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

export const singleWord2: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 2.5
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
      duration: 0.2,
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

export const preloaderContainer = {
  open: {
    transition: { staggerChildren: 0.7, delayChildren: 1 },
  },
  closed: {
    transition: { staggerChildren: 0.7, staggerDirection: -1 },
  },
};

export const item = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 25,
    },
  },
  closed: {
    opacity: 0,
    y: -250,
    transition: {
      ease: "easeInOut",
      duration: 0.5,
      type: "spring",
      stiffness: 25,
    },
  },
};


export const frameVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,

    transition: {
      duration: 2,
      staggerChildren: 1.5,
      type: "spring",
      stiffness: 25,
    }
  }
};

export const frameItemVariants = {
  hidden: {
    opacity: 0,
    y: 200
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2,
      ease: [0.02, 0.6, -0.01, 0.91]
    }
  }
};


export const ImageShakeVariants = {
  start: {
    rotate: [-90, 90, 0],
    transition: {
      delay: 0.07,
      repeat: Infinity,
      duration: 0.5,
    },
  },
  reset: {
    rotate: 0,
  },
};

export const pinVariants = {
  hidden: {
    y: 1000,
    x: [10, 20],
    transition: { delay: 0.5, duration: 1.5 },
  },

  visible: {
    y: 0,
  },
};

export const polaroidVariants = (index: number, isFast = false): Variants => ({
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      duration: isFast ? 0.12 : 0.2,
      delay: isFast ? index * 0.12 : index * 0.2,
      ease: "easeInOut",
      type: "spring",
      stiffness: 25,
    },
  },
});