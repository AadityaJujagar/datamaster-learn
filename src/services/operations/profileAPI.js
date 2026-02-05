import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";
import { setLoading, setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const {
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
  GET_USER_DETAILS_API,
} = profileEndpoints;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_USER_DETAILS API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
      dispatch(setUser({ ...response.data.data, image: userImage }));
    } catch (error) {
      dispatch(logout(navigate));
      console.log("GET_USER_DETAILS API ERROR............", error);
      toast.error("Could Not Get User Details");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Fetching enrolled courses...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (err) {
    console.error(err.message);
    toast.error("Could not get enrolled courses, API error");
  }
  toast.dismiss(toastId);
  return result;
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Fetching instructor data...");
  let result = [];

  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("INSTRUCTOR DATA API RESPONSE............ ", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.courses;
  } catch (err) {
    console.error(err.message);
    toast.error("Could not get instructor data, API error");
  }
  toast.dismiss(toastId);
  return result;
}
