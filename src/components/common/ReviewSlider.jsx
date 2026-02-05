// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import ReactStars from "react-rating-stars-component";
// import { useEffect, useState } from "react";
// import { apiConnector } from "../../services/apiConnector";
// import { ratingsEndpoints } from "../../services/apis";

// export const ReviewSlider = () => {
//   const [review, setReview] = useState([]);
//   const trunculateWords = 15;

//   useEffect(() => {
//     const fetchAllReviews = async () => {
//       const response = await apiConnector(
//         "GET",
//         ratingsEndpoints.REVIEWS_DETAILS_API
//       );
//       console.log("response", response);
//     };
//     fetchAllReviews();
//   }, []);

//   return <div></div>;
// };
