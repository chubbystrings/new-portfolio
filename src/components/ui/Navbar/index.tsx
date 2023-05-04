/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <header className="w-full px-32 xl:px-24 lg:px-16 md:px-12 sm:px-8 xs:px-2 py-8 font-medium flex items-center justify-between relative">
      <button
        className="flex-col items-center justify-center hidden lg:flex"
        onClick={handleToggle}
      >
        <span
          className={`bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm  ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`bg-light block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm  ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      <MainNav />
      {isOpen && (
        <MobileNav setIsOpen={setIsOpen} />
      )}
    </header>
  );
}
