import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconBtn } from "../../../common/IconBtn";
import { changePassword } from "../../../../services/operations/settingsAPI";

export const UpdatePassword = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label
              htmlFor="oldPassword"
              className="lable-style text-sm text-white"
            >
              Current Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter Current Password"
              {...register("oldPassword", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style relative w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            />
            <span
              className="absolute right-3 top-[40px] z-[10] cursor-pointer"
              onClick={() => setShowOldPassword((prev) => !prev)}
            >
              {showOldPassword ? (
                <LuEye fontSize={20} color="#AFB2BF" />
              ) : (
                <LuEyeClosed fontSize={20} color="#AFB2BF" />
              )}
            </span>
            {errors.oldPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your Current Password.
              </span>
            )}
          </div>
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label
              htmlFor="newPassword"
              className="lable-style text-sm text-white"
            >
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              {...register("newPassword", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style relative w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            />
            <span
              className="absolute right-3 top-[40px] z-[10] cursor-pointer"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? (
                <LuEye fontSize={20} color="#AFB2BF" />
              ) : (
                <LuEyeClosed fontSize={20} color="#AFB2BF" />
              )}
            </span>
            {errors.newPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your New Password.
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            navigate("/dashboard/my-profile");
          }}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Update" />
      </div>
    </form>
  );
};
