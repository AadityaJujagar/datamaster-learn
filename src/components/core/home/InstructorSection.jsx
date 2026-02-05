import { FaArrowRight } from "react-icons/fa";
import InstructorImage from "../../../assets/Images/Instructor.png";
import { CTAButton } from "../../common/CTAButton";
import { HighlightText } from "./HighlightText";

export const InstructorSection = () => {
  return (
    <div className="flex mt-16 flex-row gap-20 items-center">
      <div className="w-[50%]">
        <img
          src={InstructorImage}
          className="shadow-[20px_20px_0_#f5f5f5,0px_-12px_42px_rgba(0,120,255,0.3)]"
          alt=""
        />
      </div>
      <div className="w-[50%] flex flex-col gap-10">
        <div className="text-4xl font-semibold">
          Become an <br />
          <HighlightText text={"Instructor"} />
        </div>
        <p className="text-[16px] font-medium w-[90%] text-richblack-300">
          Instructors from around the world teach millions of students on <br />
          DMC.Learn. We provide the tools and skills to teach what you love.
        </p>
        <div className="w-fit">
          <CTAButton active={true}>
            <div className="flex flex-row items-center gap-3">
              Start Teaching Today <FaArrowRight />
            </div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
