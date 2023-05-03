import Technologies from "../components/home/projects/Projects";
import Hero from "../components/home/hero/Hero";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Home() {

  useDocumentTitle('Home Page')
  return (
    <>
      <Hero />
      <Technologies />
    </>
  );
}
