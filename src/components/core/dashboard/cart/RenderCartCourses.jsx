// import { FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from "../../../../slices/cartSlice";

export const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course, index) => (
        <div
          key={course._id}
          className={`
            flex w-full flex-wrap items-start justify-between gap-6 
            ${index !== 0 && "mt-6"}
            ${
              index !== cart.length - 1 &&
              "border-b border-b-richblack-400 pb-6"
            }`}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {course?.courseName}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4">
            <button
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
              onClick={() => dispatch(removeFromCart(course))}
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-yellow-100">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
