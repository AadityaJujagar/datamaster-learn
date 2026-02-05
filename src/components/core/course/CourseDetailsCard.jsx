/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
import { FaShareSquare } from "react-icons/fa";

export const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const {
    thumbnail,
    price,
    studentsEnrolled,
    // instructions,
    // _id: course_id,
  } = course?.data?.courseDetails;
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Instructors cannot buy courses");
      return;
    }
    if (token) {
      dispatch(addToCart(course?.data?.courseDetails));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to add course to cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(false),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        <img
          src={thumbnail}
          alt="thumbnail image"
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />
        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">₹ {price}</div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton"
              onClick={
                user && studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !studentsEnrolled.includes(user?._id)) && (
              <button onClick={handleAddToCart} className="blackButton">
                Add to Cart
              </button>
            )}
          </div>
          <div className="py-2 text-center text-sm text-richblack-25"></div>

          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
