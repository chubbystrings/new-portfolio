/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink} from 'react-router-dom'


const CustomLink = ({
  to,
  className,
  type,
  children,
}: {
  to: string;
  className?: string;
  children: any;
  type: "link" | "button";
}) => {
  return (
    <>
      {type === "link" ? (
        <NavLink
          to={to}
          className={`${className} relative group text-light text-lg`}
        >
          {({ isActive }) => (
            <>
              {children}
              <span
                className={` ${
                  isActive ? "w-full" : "w-0"
                } h-[3px] w-0 inline-block bg-light absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300`}
              >
                &nbsp;
              </span>
            </>
          )}
        </NavLink>
      ) : (
        <NavLink
          to={to}
          className={`${className} relative group text-light text-lg`}
        >
          {({ isActive }) => (
            <>
              {children}
              <span
                className={` ${
                  isActive ? "w-full" : "w-0"
                } h-[3px] w-0 inline-block bg-light absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300`}
              >
                &nbsp;
              </span>
            </>
          )}
        </NavLink>
      )}
    </>
  );
};

export default CustomLink