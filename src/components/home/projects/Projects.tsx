import { Variants, motion } from "framer-motion";
import { ProjectCardContainer } from "./Project.style";
import { useRef } from "react";
import { PROJECT } from "../../../utils/projects";
import { projects } from "../../../utils/projects";
import { LinkArrow } from "../../ui/Icons";


const projectCardVariants = (index: number): Variants => ({
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: index % 2 === 0 ? -15 : 15,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
});
function ProjectCard({ data, index }: { data: PROJECT, index: number }) {
  const { img, title, url, description } = data
  return (
    <ProjectCardContainer
      className="md:!w-[250px] xs:!w-full"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      {/* <div className="splash" /> */}
      <motion.div
        className="card relative px-2 gap-3 xxs:!w-[80%]"
        variants={projectCardVariants(index)}
      >
        <div className="absolute top-2 left-[50%] translate-x-[-50%] ">
          <h2 className="text-center text-dark text-lg xs:text-sm xs:break-all">
            {title}
          </h2>
        </div>
        <div className="text-center xs:text-sm xs:break-all">
          <small>{description}</small>
        </div>
        <div className="w-[100px] h-[100px] xxs:w-full">
          <img src={img} className="w-full h-full" />
        </div>
        <div className="absolute top-2 right-2 animate-bounce ">
          <a href={url} target="_blank" className=" ">
            <LinkArrow className="w-6 xs:w-full" />
          </a>
        </div>
      </motion.div>
    </ProjectCardContainer>
  );
}


export default function Projects() {
  const techRef = useRef(null);
  return (
    <div
      className="mt-3 w-full flex flex-col items-center relative pb-[30rem]"
      ref={techRef}
    >
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
          delay: 0.1,
        }}
        viewport={{ amount: 0.1 }}
        className="font-bold text-6xl lg:text-4xl sm:text-2xl mb-12 w-full text-center text-light xs:text-sm"
      >
       Featured Projects
      </motion.h2>
      <>
        {projects.map((project, index) => (
          <ProjectCard data={project} key={index + project.title} index={index} />
        ))}
      </>
    </div>
  );
}
