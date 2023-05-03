import Experience from "../components/about/experience/Experience";
import Skills from "../components/about/skills/Skills";
import Summary from "../components/about/summary/Summary";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function About() {

  useDocumentTitle('About Page')
  return (
    <div className="flex w-full flex-col items-center justify-center pt-1 mb-11">
      
      <Summary />
      <Skills />
      <Experience />
    </div>
  );
}
