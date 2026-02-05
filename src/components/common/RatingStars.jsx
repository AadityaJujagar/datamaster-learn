// /* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
// import {
//   TiStarFullOutline,
//   TiStarHalfOutline,
//   TiStarOutline,
// } from "react-icons/ti";

// export const RatingStars = ({
//   Review_Count,
//   Star_Size,
//   onChange,
//   isEditable = false,
// }) => {
//   const [starCount, SetStarCount] = useState({
//     full: 0,
//     half: 0,
//     empty: 0,
//   });

//   const [hoveredStar, setHoveredStar] = useState(null); // for hover effect

//   useEffect(() => {
//     const ratingToUse = hoveredStar !== null ? hoveredStar : Review_Count;

//     const wholeStars = Math.floor(ratingToUse) || 0;
//     SetStarCount({
//       full: wholeStars,
//       half: Number.isInteger(ratingToUse) ? 0 : 1,
//       empty: Number.isInteger(ratingToUse) ? 5 - wholeStars : 4 - wholeStars,
//     });
//   }, [Review_Count, hoveredStar]);

//   const handleClick = (index) => {
//     if (isEditable && onChange) {
//       onChange(index + 1); // because array is 0-indexed
//     }
//   };

//   const handleMouseEnter = (index) => {
//     if (isEditable) {
//       setHoveredStar(index + 1);
//     }
//   };

//   const handleMouseLeave = () => {
//     if (isEditable) {
//       setHoveredStar(null);
//     }
//   };

//   return (
//     <div className="flex gap-1 text-yellow-100">
//       {Array.from({ length: 5 }, (_, i) => {
//         if (i < starCount.full) {
//           return (
//             <TiStarFullOutline
//               key={i}
//               size={Star_Size || 20}
//               className={isEditable ? "cursor-pointer" : ""}
//               onClick={() => handleClick(i)}
//               onMouseEnter={() => handleMouseEnter(i)}
//               onMouseLeave={handleMouseLeave}
//             />
//           );
//         } else if (i === starCount.full && starCount.half) {
//           return (
//             <TiStarHalfOutline
//               key={i}
//               size={Star_Size || 20}
//               className={isEditable ? "cursor-pointer" : ""}
//               onClick={() => handleClick(i)}
//               onMouseEnter={() => handleMouseEnter(i)}
//               onMouseLeave={handleMouseLeave}
//             />
//           );
//         } else {
//           return (
//             <TiStarOutline
//               key={i}
//               size={Star_Size || 20}
//               className={isEditable ? "cursor-pointer" : ""}
//               onClick={() => handleClick(i)}
//               onMouseEnter={() => handleMouseEnter(i)}
//               onMouseLeave={handleMouseLeave}
//             />
//           );
//         }
//       })}
//     </div>
//   );
// };
