/* eslint-disable react/prop-types */
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

export const CourseCard = ({ course, currentCard, setCurrentCard }) => {
  return (
    <div
      className={`flex w-[360px] lg:w-[30%] text-richblack-25
         box-border flex-col items-start p-4 cursor-pointer gap-4
        ${
          course.heading === currentCard
            ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
            : "text-white bg-richblack-800"
        }`}
      onClick={() => setCurrentCard(course.heading)}
    >
      <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <div
          className={` ${
            currentCard === course.heading && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {course.heading}
        </div>
        <div className="text-richblack-400">{course.description}</div>
      </div>
      <div
        className={`flex justify-between gap-8 ${
          currentCard === course.heading
            ? "text-blue-300"
            : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{course.level}</p>
        </div>
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{course.lessionNumber} Lession</p>
        </div>
      </div>
    </div>
  );
};
