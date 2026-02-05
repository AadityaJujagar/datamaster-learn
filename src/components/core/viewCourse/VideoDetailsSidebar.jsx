/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setCourseSectionData } from "../../../slices/viewCourseSlice";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

export const VideoDetailsSidebar = (/*setReviewModal*/) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const { sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    (() => {
      if (!setCourseSectionData.length) return;
      const currentSectionIndex = courseSectionData.findIndex(
        (section) => section._id === sectionId
      );
      const currentSubSectionIndex = courseSectionData[
        currentSectionIndex
      ]?.subSection.findIndex((subSection) => subSection._id === subSectionId);

      // current active section and subsection by utilizing abve variables
      const activeSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex
        ]?._id;

      // active section name
      setActiveStatus(courseSectionData[currentSectionIndex]?.sectionName);
      // active subsection name
      setVideoBarActive(activeSubSectionId);
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`);
              }}
              className="flex cursor-pointer h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-md font-semibold text-richblack-50">
              {courseEntireData?.courseName}
            </p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((section, index) => (
            <div
              onClick={() => setActiveStatus(section?._id)}
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              key={index}
            >
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {section?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  {/* <span className="text-[12px] font-medium">
                    Lession {course?.subSection.length}
                  </span> */}
                  <span
                    className={`${
                      activeStatus === section?.sectionName
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>
              {activeStatus === section?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {section?.subSection.map((content, index) => (
                    <div
                      key={index}
                      className={`flex gap-5 p-5 ${
                        videoBarActive === content._id
                          ? "bg-yellow-200 text-richblack-900"
                          : "bg-richblack-900 text-white"
                      }`}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${content._id}`
                        );
                        setVideoBarActive(content._id);
                      }}
                    >
                      {/* <input
                        type="checkbox"
                        checked={completedLectures.includes(content._id)}
                        onChange={() => {}}
                      /> */}
                      <span>{content.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
