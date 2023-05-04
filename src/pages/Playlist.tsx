/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { StoreContext } from "../store";
import { setLayoutClass } from "../store/actions";
import AnimatedText from "../components/ui/AnimatedText";
import useDocumentTitle from "../hooks/useDocumentTitle";
import PageTransition from "../components/ui/PageTransition";
import { motion } from "framer-motion";


export default function Playlist() {
  const { dispatch } = useContext(StoreContext);
   useDocumentTitle("Spotify Playlist");

    useEffect(() => {
        dispatch(setLayoutClass('!pb-20'))
    }, [])

    return (
      <>
        <PageTransition />
        <div className="w-full flex flex-col items-center lg:w-full mb-5">
          <AnimatedText
            text="My playlist"
            className="text-left text-8xl xl:!text-7xl lg:!text-center lg:!text-6xl md:!text-5xl sm:!text-3xl xs:!text-lg lg:!w-full xs:!break-all"
          />
        </div>
        <div className="mb-4 w-full lg:text-center">
          <small className="text-light text-md sm:break-all">Songs I listened to while creating this portfolio enjoy :)</small>
        </div>
        <motion.div initial={{ opacity: 0}} animate={{ opacity: 1 }} transition={{ delay: 1, }}>
          <iframe
            src="https://open.spotify.com/embed/playlist/2lCE1Yla3WiRGPySZGMg8W?utm_source=generator"
            width="100%"
            height="450"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </motion.div>
      </>
    );
}
