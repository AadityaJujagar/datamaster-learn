import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import { ProfileDropdown } from "../core/auth/ProfileDropdown";
import { useEffect, useState } from "react";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import { IoMdArrowDropdown } from "react-icons/io";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { AiOutlineMenu } from "react-icons/ai";

const { CATEGORIES_API } = categories;

export const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [subLinks, setSubLinks] = useState([]);
  const location = useLocation();

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", CATEGORIES_API);
      setSubLinks(result?.data?.data);
    } catch (err) {
      console.error(err);
      console.log("Could not fetch categories");
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <p className="flex items-center font-extrabold tracking-tight text-white">
            <span className="text-2xl">
              DMC
              <span className="text-yellow-25">.</span>
            </span>
            <span className="ml-1 text-2xl text-yellow-25">Learn</span>
          </p>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p className="group-hover:text-yellow-25">{link.title}</p>
                      <IoMdArrowDropdown />
                      <div
                        className="invisible absolute border-[1px] border-richblack-400 left-[-100px] top-10 flex flex-col rounded-md lg:w-[270px] p-4 z-10
                      text-richblack-25 group-hover:opacity-100 transition-all duration-200 group-hover:visible bg-richblack-800 text-left"
                      >
                        <div className="absolute left-[40%] top-0 -z-10 h-4 w-4 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-800 border-t-[2px] border-l-[2px] border-richblack-400"></div>
                        {subLinks.length > 0 ? (
                          <>
                            {subLinks
                              // ?.filter(
                              //   (subLink) => subLink?.courses?.length > 0
                              // )
                              // ?
                              .map((subLink, index) => {
                                return (
                                  <Link
                                    key={index}
                                    to={`catalog/${subLink.name
                                      .toLowerCase()
                                      .replace(/ /g, "-")}`}
                                    className="text-richblack-25 py-1 px-2 rounded-md hover:bg-richblack-700 hover:text-yellow-25"
                                  >
                                    {subLink.name}
                                  </Link>
                                );
                              })}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link.path}>
                    <p
                      className={`${
                        matchRoute(link.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-x-4 md:flex">
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <TiShoppingCart fontSize={20} color="#AFB2BF" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Log In
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};
