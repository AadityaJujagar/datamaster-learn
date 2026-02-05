import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CourseAccordionBar } from "../components/core/course/CourseAccordionBar";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { CourseDetailsCard } from "../components/core/course/CourseDetailsCard";
import { BiInfoCircle } from "react-icons/bi";
import { formatDate } from "../services/formatDate";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { Footer } from "../components/common/Footer";
import { Error } from "../pages/Error";
import ReactMarkdown from "react-markdown";

export const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);

  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isActive, setIsActive] = useState(Array(0));

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        setCourseData(result);
      } catch (err) {
        console.error(err);
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  useEffect(() => {
    let lectures = 0;
    courseData?.data?.courseDetails?.courseContent.forEach((item) => {
      lectures += item.subSection.length;
    });
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  const handleBuyCourse = () => {
    if (token) {
      buyCourse({ token, courses: [courseId], user, navigate, dispatch });
      return;
    } else {
      setConfirmationModal({
        text1: "You are not logged in",
        text2: "You need to login to buy this course",
        btn1: "Login",
        btn2: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(false),
      });
    }
  };

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat(id)
        : isActive.filter((item) => item !== id)
    );
  };

  if (loading || paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!courseData?.success) {
    return <Error />;
  }
  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const {
    // _id: course_id,
    courseName,
    courseDescription,
    courseContent,
    price,
    // ratingAndReview,
    instructor,
    studentsEnrolled,
    createdAt,
    whatYouWillLearn,
    thumbnail,
  } = courseData.data.courseDetails;

  return (
    <>
      <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                {courseName}
              </p>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-sm text-richblack-100">{`${studentsEnrolled.length} students enrolled`}</span>
              </div>
              <p className="text-richblack-5 text-md">
                Created By{" "}
                <span className="text-yellow-50 font-normal">{`${instructor.firstName} ${instructor.lastName}`}</span>
              </p>
              <div className="flex flex-wrap gap-5 text-sm">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                ₹ {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
          <div className="right-[4rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={courseData}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you&apos;ll learn</p>
            <div className="mt-5">
              <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
            </div>
          </div>

          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{courseData?.data?.totalDuration} total length</span>
                </div>
                <button
                  className="text-yellow-25"
                  onClick={() => setIsActive([])}
                >
                  Collapse all sections
                </button>
              </div>
            </div>

            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {instructor?.additionalData?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};
