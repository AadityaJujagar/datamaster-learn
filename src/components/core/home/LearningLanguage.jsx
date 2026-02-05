import { HighlightText } from "./HighlightText";
import KnowYourProgress from "../../../assets/Images/Know_your_progress.png";
import CompareWithOthers from "../../../assets/Images/Compare_with_others.png";
import PlanYourLessons from "../../../assets/Images/Plan_your_lessons.png";
import { CTAButton } from "../../common/CTAButton";

export const LearningLanguage = () => {
  return (
    <div className="flex flex-col gap-5 items-center py-16">
      <div className="text-4xl font-semibold text-center">
        Your Swiss Knife For <HighlightText text={"Learning any Language"} />
      </div>
      <div className="text-center font-medium text-richblack-800 mx-auto text-base mt-1">
        Using spin making learning multiple languages easy. with 20+ languages
        realistic voice-over, progress tracking,
        <br /> custom schedule and more.
      </div>
      <div className="flex flex-row items-center">
        <img src={KnowYourProgress} className="object-contain -mr-32" alt="" />
        <img src={CompareWithOthers} className="object-contain -mr-32" alt="" />
        <img src={PlanYourLessons} className="object-contain -mr-32" alt="" />
      </div>
      <CTAButton linkto={"/signup"} active={true}>
        Learn More
      </CTAButton>
    </div>
  );
};
