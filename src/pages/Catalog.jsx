import { useParams } from "react-router-dom";
import { Footer } from "../components/common/Footer";
import { Error } from "../pages/Error";
import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { Course_Card } from "../components/core/catalog/Course_Card";
import { CourseSlider } from "../components/core/catalog/CourseSlider";
import { useSelector } from "react-redux";

export const Catalog = () => {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [catagoryId, setCatagoryId] = useState("");
  const [active, setActive] = useState(1);

  useEffect(() => {
    const getCatagories = async () => {
      const response = await apiConnector("GET", categories.CATEGORIES_API);
      const category_id = response?.data?.data?.filter(
        (ctg) => ctg.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]._id;
      setCatagoryId(category_id);
    };
    getCatagories();
  }, [catalogName]);

  useEffect(() => {
    if (!catagoryId) return;
    const getCatagoryDetails = async () => {
      try {
        const res = await getCatalogPageData(catagoryId);
        setCatalogPageData(res);
      } catch (err) {
        console.error("Error fetching catalog page data:", err);
      }
    };
    getCatagoryDetails();
  }, [catagoryId]);

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.selectedCategory?.description}
          </p>
        </div>
      </div>

      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="text-2xl text-richblack-5">
          Courses to get you started
        </div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        {/* todo: edit course should remove current course & its category id */}
        <CourseSlider Courses={catalogPageData?.selectedCategory?.courses} />
      </div>

      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <p className="text-2xl text-richblack-5">
          Top Courses in
          <span> {catalogPageData?.selectedCategory?.name}</span>
        </p>
        <div className="py-8">
          {/* todo: edit course should also change category id here */}
          <CourseSlider Courses={catalogPageData?.differentCategory?.courses} />
        </div>
      </div>

      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="text-2xl text-richblack-5">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.topSellingCourse
              ?.slice(0, 4)
              .map((course, index) => {
                return (
                  <Course_Card
                    course={course}
                    key={index}
                    Height={"h-[400px]"}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
