/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export const CTAButton = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-base px-6 py-3 rounded-md font-bold  hover:scale-95 transition-all duration-200 ${
          active
            ? "bg-yellow-50 text-richblack-800 shadow-[inset_-2px_-2px_0_rgba(255,255,255,0.51)]"
            : "bg-richblack-800 shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
        } `}
      >
        {children}
      </div>
    </Link>
  );
};
