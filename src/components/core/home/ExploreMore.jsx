import { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import { HighlightText } from "./HighlightText";
import { CourseCard } from "./CourseCard";

const tabsName = [
  "Free",
  "New to Coding",
  "Most Popular",
  "Skills Paths",
  "Career Paths",
];

export const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className="flex flex-col items-center mb-52 relative">
      <div className="text-4xl font-semibold text-center">
        Unlock the <HighlightText text={"Power of Code"} />
      </div>
      <p className="text-center text-richblack-300 text-lg font-semibold mt-2">
        Learn to Build Anything You Can Imagine
      </p>
      <div className="flex flex-row mt-8 items-center gap-12 rounded-full bg-richblack-800 p-[4px]">
        {tabsName.map((tab, index) => {
          return (
            <div
              className={`text-[16px] rounded-full transition-all duration-200 cursor-pointer 
                hover:bg-richblack-900 hover:text-richblack-5 px-6 py-[8px]
                ${
                  currentTab === tab
                    ? "bg-richblack-900 ring-richblack-5 font-medium"
                    : "text-richblack-200"
                }`}
              key={index}
              onClick={() => setMyCards(tab)}
            >
              {tab}
            </div>
          );
        })}
      </div>
      <div className="w-full gap-16 mt-52 absolute flex items-center justify-between mx-auto">
        {courses.map((course, index) => {
          return (
            <CourseCard
              key={index}
              course={course}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};
