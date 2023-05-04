import Technologies from "../components/home/projects/Projects";
import Hero from "../components/home/hero/Hero";
import useDocumentTitle from "../hooks/useDocumentTitle";
import PageTransition from "../components/ui/PageTransition";

export default function Home() {
  useDocumentTitle("Home Page");
  return (
    <>
      <PageTransition />
      <Hero />
      <Technologies />
    </>
  );
}
