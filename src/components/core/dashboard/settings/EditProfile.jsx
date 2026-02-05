import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconBtn } from "../../../../components/common/IconBtn";
import { updateProfile } from "../../../../services/operations/settingsAPI";

const genders = ["Male", "Female", "Other", "Prefer not to say"];

export const EditProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (formData) => {
    try {
      const success = await dispatch(updateProfile(token, formData));
      if (success) navigate("/dashboard/my-profile");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label
              htmlFor="firstName"
              className="lable-style text-sm text-white"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              defaultValue={user?.firstName}
              {...register("firstName", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            />
            {errors.firstName && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                First name is required
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label
              htmlFor="lastName"
              className="lable-style text-sm text-white"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter first name"
              defaultValue={user?.lastName}
              {...register("lastName", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            />
            {errors.lastName && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your last name.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label
              htmlFor="dateOfBirth"
              className="lable-style text-sm text-white"
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              {...register("dateOfBirth", {
                required: {
                  value: true,
                  message: "Please enter your Date of Birth.",
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.additionalData?.dateOfBirth}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            />
            {errors.dateOfBirth && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="lable-style text-sm text-white">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              type="text"
              {...register("gender", { required: true })}
              defaultValue={user?.additionalData?.gender}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            >
              {genders.map((ele, i) => {
                return (
                  <option key={i} value={ele}>
                    {ele}
                  </option>
                );
              })}
            </select>
            {errors.gender && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your Date of Birth.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label
              htmlFor="contactNumber"
              className="lable-style text-sm text-white"
            >
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter Contact Number"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Please enter your Contact Number.",
                },
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalData?.contactNumber}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            />
            {errors.contactNumber && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.contactNumber.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about" className="lable-style text-sm text-white">
              About
            </label>
            <input
              type="text"
              name="about"
              id="about"
              placeholder="Enter Bio Details"
              {...register("about", { required: true })}
              defaultValue={user?.additionalData?.about}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"
            />
            {errors.about && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your About.
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
        <IconBtn type="submit" text="Save" />
      </div>
    </form>
  );
};
