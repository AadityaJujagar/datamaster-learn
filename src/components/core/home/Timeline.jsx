import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import TimelineImage from "../../../assets/Images/TimelineImage.png";

export const Timeline = () => {
  const timeline = [
    {
      id: 1,
      Logo: Logo1,
      Title: "Leadership",
      Description: "Fully committed to the success company",
    },
    {
      id: 2,
      Logo: Logo2,
      Title: "Responsibility",
      Description: "Students will always be our top priority",
    },
    {
      id: 3,
      Logo: Logo3,
      Title: "Flexibility",
      Description: "The ability to switch is an important skills",
    },
    {
      id: 4,
      Logo: Logo4,
      Title: "Solve the problem",
      Description: "Code your way to a solution",
    },
  ];

  return (
    <div className="flex flex-row gap-14 pb-16">
      <div className="w-[45%] flex flex-col gap-5">
        {timeline.map((ele, i) => {
          return (
            <div className="flex flex-row gap-6" key={i}>
              <div className="w-[50px] h-[50px] bg-white flex justify-center rounded-full items-center">
                <img src={ele.Logo} alt="" />
              </div>
              <div className="">
                <h1 className="font-semibold text-[18px]">{ele.Title}</h1>
                <p className="text-base">{ele.Description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative shadow-[20px_20px_0px_#f5f5f5,5px_10px_64px_rgba(0,120,255,0.8)]">
        <img src={TimelineImage} className="object-cover h-fit" alt="" />
        <div className="absolute bottom-[-12%] left-[4%] bg-caribbeangreen-700 flex flex-row text-white uppercase py-10">
          <div className="flex flex-row gap-5 items-center border-r border-r-caribbeangreen-300 px-7">
            <p className="text-3xl font-bold">10</p>
            <p className="text-caribbeangreen-300">Years of Experience</p>
          </div>
          <div className="flex flex-row gap-5 items-center px-7">
            <p className="text-3xl font-bold">250</p>
            <p className="text-caribbeangreen-300">Type of Courses</p>
          </div>
        </div>
      </div>
    </div>
  );
};
