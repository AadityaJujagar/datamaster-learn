import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { HighlightText } from "../components/core/home/HighlightText";
import { CTAButton } from "../components/common/CTAButton";
import { CodeBlocks } from "../components/core/home/CodeBlocks";
import { Timeline } from "../components/core/home/Timeline";
import { LearningLanguage } from "../components/core/home/LearningLanguage";
import { InstructorSection } from "../components/core/home/InstructorSection";
import { ExploreMore } from "../components/core/home/ExploreMore";
import { Footer } from "../components/common/Footer";
import Banner from "../assets/Images/banner.mp4";
// import { ReviewSlider } from "../components/common/ReviewSlider";

export const Home = () => {
  return (
    <>
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between">
        <Link to={"/signup"}>
          <div className="group mx-auto rounded-full mt-16 p-1 bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]">
            <div className="group-hover:bg-richblack-900 flex flex-row items-center rounded-full px-10 py-[5px] gap-2">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>
        <div className="width-[90%] text-center text-base font-medium text-richblack-300 mt-4">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a <br />
          wealth of resources, including hands-on projects, quizzes, and
          personalized feedback from instructors.
        </div>
        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>
        <div className="mx-16 my-16 shadow-[20px_20px_0_#f5f5f5,0px_-12px_42px_rgba(0,120,255,0.3)]">
          <video muted loop autoPlay>
            <source src={Banner} />
          </video>
        </div>

        <div>
          <div className="relative">
            <div
              className="absolute right-60 top-10 w-60 h-60 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #8A2BE2 20%, #FFA500 40%, #F8F8FF 100%)",
              }}
            ></div>
            <CodeBlocks
              position={"lg:flex-row"}
              heading={
                <div className="text-4xl font-semibold">
                  Unlock your <HighlightText text={"Coding Potential"} />
                  <br />
                  with our Online Courses
                </div>
              }
              subHeading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={{
                btnText: "Try It Yourself",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeblock={`<!DOCTYPE html>
                        <head>
                          <title>Example</title>
                          <link rel="stylesheet" href="styles.css">
                        </head>
                        <body>
                          <h1><a href="/">Header</a></h1>
                          <nav>
                            <a href="/one">One</a>
                            <a href="/two">Two</a>
                            <a href="/three">Three</a>
                          </nav>`}
              codeColor={"text-yellow-25"}
            />
          </div>
          <div className="relative">
            <div
              className="absolute left-6 top-12 w-60 h-60 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #1FA2FF 20%, #12D8FA 40%, #A6FFCB 100%)",
              }}
            ></div>
            <CodeBlocks
              position={"lg: flex-row-reverse"}
              heading={
                <div className="text-4xl font-semibold">
                  Start
                  <HighlightText
                    text={`Coding 
                   in Seconds`}
                  />
                </div>
              }
              subHeading={
                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              }
              ctabtn1={{
                btnText: "Continue Lession",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeblock={`import React from "react";
                        import CTAButton from "./Button";
                        import TypeAnimation from "react-type";
                        import { FaArrowRight } from "react-icons/fa";
                                    
                        const Home = () => {
                        return (
                        <div>Home</div>
                        )
                        }
                        
                        export default Home;`}
              codeColor={"text-richblack-50"}
            />
          </div>
          <ExploreMore />
        </div>

        <div className="bg-pure-greys-5 text-richblack-700">
          <div className="homepage_bg">
            <div className="w-11/12 max-w-maxContent justify-center flex items-center g-5 mx-auto">
              <div className="flex mt-52 flex-row gap-7 text-white">
                <CTAButton active={true} linkto={"/signup"}>
                  <div className="flex flex-row items-center gap-3">
                    Explore Full Catalog <FaArrowRight />
                  </div>
                </CTAButton>
                <CTAButton active={false} linkto={"/signup"}>
                  <div className="flex flex-row items-center gap-3">
                    Learn More
                    <FaArrowRight />
                  </div>
                </CTAButton>
              </div>
            </div>
          </div>

          <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
            <div className="flex flex-row justify-between mb-10 mt-[82px]">
              <div className="text-4xl font-semibold w-[45%]">
                Get the Skills you need for a{" "}
                <HighlightText text={"Job that is in demand"} />
              </div>
              <div className="flex flex-col gap-10 w-[40%] items-start">
                <p className="text-[16px]">
                  The modern DMC.Learn is the dictates its own terms. Today,
                  to
                  <br /> be a competitive specialist requires more than
                  professional skills.
                </p>
                <CTAButton active={true} linkto={"/signup"}>
                  Learn More
                </CTAButton>
              </div>
            </div>
            <Timeline />
            <LearningLanguage />
          </div>

          <div className="mx-auto flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            <InstructorSection />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
