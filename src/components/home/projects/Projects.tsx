import {  motion } from "framer-motion";
import { useRef } from "react";
import { projects } from "../../../utils/projects";
import ProjectCard from "./ProjectCard";





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
