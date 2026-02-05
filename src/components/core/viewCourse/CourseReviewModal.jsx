// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/prop-types */
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { IconBtn } from "../../common/IconBtn";
// import { createRating } from "../../../services/operations/courseDetailsAPI";
// import { RatingStars } from "../../common/RatingStars";

// export const CourseReviewModal = ({ setReviewModal }) => {
//   const { user } = useSelector((state) => state.profile);
//   const { token } = useSelector((state) => state.auth);
//   const { courseEntireData } = useSelector((state) => state.viewCourse);
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     watch,
//   } = useForm();

//   useEffect(() => {
//     setValue("courseExperience", "");
//     setValue("courseRating", 0);
//   }, []);
//   // todo: populate b/e data for course, section and its lecture via ID for the respective user
//   const courseRating = watch("courseRating");

//   const onSubmit = async (data) => {
//     await createRating(
//       {
//         courseId: courseEntireData._id,
//         rating: data.courseRating,
//         review: data.courseExperience,
//       },
//       token
//     );
//     setReviewModal(false);
//   };

//   return (
//     <div className="text-white">
//       <div>
//         <div>
//           <p>Add Review</p>
//           <button onClick={() => setReviewModal(false)}>Close</button>
//         </div>
//         <div>
//           <div>
//             <img
//               src={user?.image}
//               alt="user image"
//               className="aspect-square w-[50px] rounded-full object-cover"
//             />
//             <div>
//               <p>
//                 {user?.firstName} {user?.lastName}
//               </p>
//               <p>Posting Publicly</p>
//             </div>
//           </div>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="mt-6 flex flex-col items-center"
//           >
//             <RatingStars
//               Review_Count={courseRating}
//               Star_Size={30}
//               isEditable={true}
//               onChange={(newRating) => setValue("courseRating", newRating)}
//             />
//             <div>
//               <label htmlFor="courseExperience">
//                 Add Your Experience <span>*</span>
//               </label>
//               <textarea
//                 id="courseExperience"
//                 placeholder="Write your experience here..."
//                 {...register("courseExperience", { required: true })}
//                 className="form-style min-h-[130px]"
//               />
//               {errors?.courseExperience && (
//                 <span className="text-red-500 text-sm">
//                   Please add your experience
//                 </span>
//               )}
//             </div>
//             <div>
//               <button onClick={() => setReviewModal(false)}>Cancel</button>
//               <IconBtn text={"Save"} />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
