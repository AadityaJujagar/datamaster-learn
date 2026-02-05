/* eslint-disable react/prop-types */
import { FaArrowRight } from "react-icons/fa";
import { CTAButton } from "../../common/CTAButton";
import { TypeAnimation } from "react-type-animation";

export const CodeBlocks = ({
  position,
  heading,
  subHeading,
  ctabtn1,
  ctabtn2,
  codeColor,
  codeblock,
}) => {
  return (
    <div
      className={`relative flex flex-row my-20 justify-between gap-20 ${position}`}
    >
      <div className="lg:w-[500px] flex flex-col gap-8 ">
        {heading}
        <div className="text-start text-base font-medium text-richblack-300">
          {subHeading}
        </div>
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>
      <div
        style={{
          borderImage:
            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0)) 1",
          borderImageSlice: 1,
        }}
        className="h-fit flex flex-row text-[16px] lg:w-[500px] backdrop-blur-52 bg-white bg-opacity-5 p-3 relative text-white bg-gray-800 border-2"
      >
        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
          <p>12</p>
        </div>
        <div
          className={`w-[90%] flex flex-col gap-2 font-mono font-bold ${codeColor} pr-2`}
        >
          <TypeAnimation
            sequence={[codeblock, 3000, ""]}
            omitDeletionAnimation={true}
            cursor={true}
            repeat={Infinity}
            style={{ whiteSpace: "pre-line", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
};
