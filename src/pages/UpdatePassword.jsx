import { useDispatch, useSelector } from "react-redux";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { resetPassword } from "../services/operations/authAPI";
import { BiArrowBack } from "react-icons/bi";

export const UpdatePassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { password, confirmPassword } = formData;

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").pop();
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose New Password
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter your new password and you`re all set.
          </p>
          <form onSubmit={submitHandler}>
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={changeHandler}
                placeholder="Enter your password"
                name="password"
                required
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="focus:outline-none w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              />
              <span
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <LuEye fontSize={20} color="#AFB2BF" />
                ) : (
                  <LuEyeClosed fontSize={20} color="#AFB2BF" />
                )}
              </span>
            </label>
            <label className="relative">
              <p className="mb-1 mt-4 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={changeHandler}
                placeholder="Confirm your password"
                name="confirmPassword"
                required
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="focus:outline-none w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              />
              <span
                className="absolute right-3 top-[76px] z-[10] cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <LuEye fontSize={20} color="#AFB2BF" />
                ) : (
                  <LuEyeClosed fontSize={20} color="#AFB2BF" />
                )}
              </span>
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back to Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
