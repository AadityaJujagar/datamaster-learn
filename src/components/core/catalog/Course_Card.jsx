/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
export const Course_Card = ({ course, Height }) => {
  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="rounded-lg">
          <img
            src={course?.thumbnail}
            alt={`thumbnail for ${course?.thumbnail}`}
            className={`w-full ${Height} object-cover rounded-xl`}
          />
        </div>
        <div className="flex flex-col gap-2 px-1 py-3">
          <p className="text-xl text-richblack-5">{course?.courseName}</p>
          <p className="text-sm text-richblack-50">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>
          <p className="text-xl text-richblack-5">₹{course?.price}</p>
        </div>
      </Link>
    </>
  );
};
