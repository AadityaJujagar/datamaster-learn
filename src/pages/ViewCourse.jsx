/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import { VideoDetailsSidebar } from "../components/core/viewCourse/VideoDetailsSidebar";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

export const ViewCourse = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent));
      dispatch(setEntireCourseData(courseData?.courseDetails));
      dispatch(setCompletedLectures(courseData?.completedVideos));

      let lectures = 0;
      courseData?.courseDetails?.courseContent.forEach((item) => {
        lectures += item.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };
    setCourseSpecificDetails();
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh - 5rem)]">
      <VideoDetailsSidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
