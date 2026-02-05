/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconBtn } from "../../common/IconBtn";
import {
  // getCourseProgress,
  markLectureAsComplete,
} from "../../../services/operations/courseDetailsAPI";
import {
  updateCompletedLectures,
  // setCompletedLectures,
} from "../../../slices/viewCourseSlice";

export const VideoDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState("");

  const { courseId, sectionId, subSectionId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  // Load video data when path changes
  useEffect(() => {
    const setVideoSpecificDetails = () => {
      if (!courseSectionData) return;
      if (!courseId || !sectionId || !subSectionId) {
        navigate("/dashboard/enrolled-courses");
        return;
      }
      const currentSection = courseSectionData.find(
        (section) => section._id === sectionId
      );
      const currentVideo = currentSection?.subSection.find(
        (video) => video._id === subSectionId
      );
      setVideoData(currentVideo);
      setPreviewSource(courseEntireData.thumbnail);
    };
    setVideoSpecificDetails();
  }, [courseEntireData, courseSectionData, location.pathname]);

  const getCurrentIndices = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((sub) => sub._id === subSectionId);
    return { currentSectionIndex, currentSubSectionIndex };
  };

  const isFirstVideo = () => {
    const { currentSectionIndex, currentSubSectionIndex } = getCurrentIndices();
    return currentSectionIndex === 0 && currentSubSectionIndex === 0;
  };

  const isLastVideo = () => {
    const { currentSectionIndex, currentSubSectionIndex } = getCurrentIndices();
    const totalSections = courseSectionData.length;
    const totalSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length;
    return (
      currentSectionIndex === totalSections - 1 &&
      currentSubSectionIndex === totalSubSections - 1
    );
  };

  const goToNextVideo = () => {
    const { currentSectionIndex, currentSubSectionIndex } = getCurrentIndices();
    const currentSection = courseSectionData[currentSectionIndex];
    const nextSubSection =
      currentSection.subSection[currentSubSectionIndex + 1];

    if (nextSubSection) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSection._id}`
      );
    } else {
      const nextSection = courseSectionData[currentSectionIndex + 1];
      if (nextSection) {
        navigate(
          `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
        );
      }
    }
  };

  const goToPreviousVideo = () => {
    const { currentSectionIndex, currentSubSectionIndex } = getCurrentIndices();
    const currentSection = courseSectionData[currentSectionIndex];

    if (currentSubSectionIndex > 0) {
      const prevSubSection =
        currentSection.subSection[currentSubSectionIndex - 1];
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSection._id}`
      );
    } else {
      const prevSection = courseSectionData[currentSectionIndex - 1];
      if (prevSection) {
        const prevSubSection =
          prevSection.subSection[prevSection.subSection.length - 1];
        navigate(
          `/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSection._id}`
        );
      }
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      {
        courseId: courseId,
        subSectionId: subSectionId,
      },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  const plyrOptions = {
    controls: [
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "fullscreen",
    ],
    autoplay: false,
    muted: false,
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {videoData ? (
        <>
          <Plyr
            ref={playerRef}
            source={{
              type: "video",
              sources: [
                {
                  src: videoData.videoUrl,
                  type: "video/mp4",
                },
              ],
            }}
            options={plyrOptions}
          />

          <div className="flex justify-between items-center px-8 py-6">
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold">{videoData?.title}</h1>
              <p className="pt-2 pb-6">{videoData?.description}</p>
            </div>
            <div className="flex flex-col gap-4">
              {!completedLectures.includes(videoData._id) && (
                <IconBtn
                  disabled={loading}
                  onClick={() => handleLectureCompletion()}
                  text="Mark as Completed"
                />
              )}

              <div className="flex justify-center text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPreviousVideo}
                    className="blackButton"
                  >
                    Previous
                  </button>
                )}

                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>{" "}
          </div>
        </>
      ) : (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      )}
    </div>
  );
};
