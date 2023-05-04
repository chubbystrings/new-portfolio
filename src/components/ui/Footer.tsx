
export default function Footer() {
  return (
    <footer className="w-full flex !justify-end font-medium xl:px-24 lg:px-16 md:px-12 sm:px-8 xs:px-2 ">
      <div className="flex justify-between gap-4 items-center text-light xxs:!break-all">
        <span>Soft code</span>
        <span>{new Date().getFullYear()} &copy; All rights reserved</span>
      </div>
    </footer>
  );
}
