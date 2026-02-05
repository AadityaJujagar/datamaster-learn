import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { Tab } from "../../common/Tab";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../../slices/authSlice";
import { sendOTP } from "../../../services/operations/authAPI";
import toast from "react-hot-toast";

export const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const { firstName, lastName, email, password, confirmPassword } = formData;

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      <form
        className="flex w-full flex-col gap-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (password !== confirmPassword) {
            return toast.error("Passwords do not match!");
          }

          const signupData = {
            ...formData,
            accountType,
          };
          dispatch(setSignupData(signupData));
          dispatch(sendOTP(formData.email, navigate));

          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setAccountType(ACCOUNT_TYPE.STUDENT);
        }}
      >
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={changeHandler}
              placeholder="Enter First Name"
              required
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full focus:outline-none rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={changeHandler}
              placeholder="Enter Last Name"
              required
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full focus:outline-none rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            type="email"
            name="email"
            value={email}
            onChange={changeHandler}
            placeholder="Enter Email Address"
            required
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full focus:outline-none rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>
        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={changeHandler}
              placeholder="Create Password"
              required
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full focus:outline-none rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              className="absolute right-3 top-[40px] z-[10] cursor-pointer"
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
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={changeHandler}
              placeholder="Confirm Password"
              required
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full focus:outline-none rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              className="absolute right-3 top-[40px] z-[10] cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <LuEye fontSize={20} color="#AFB2BF" />
              ) : (
                <LuEyeClosed fontSize={20} color="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};
