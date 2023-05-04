import { Variants, motion } from "framer-motion";
import { PROJECT } from "../../../utils/projects";
import { LinkArrow } from "../../ui/Icons";
import { ProjectCardContainer } from "./Project.style";


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

function ProjectCard({ data, index }: { data: PROJECT; index: number }) {
  const { img, title, url, description } = data;
  return (
    <ProjectCardContainer
      className="md:!w-[250px] xs:!w-full"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
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
        <div className="absolute top-2 right-2 animate-bounce w-6 xs:w-4">
          <a href={url} target="_blank" className=" ">
            <LinkArrow className="w-full" />
          </a>
        </div>
      </motion.div>
    </ProjectCardContainer>
  );
}

export default ProjectCard