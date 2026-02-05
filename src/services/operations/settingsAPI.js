import toast from "react-hot-toast";
import { settingsEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(token, formData) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Updating display picture...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const currentUser = getState().profile.user;
      const updatedUser = {
        ...currentUser,
        image: response.data.data.image,
      };

      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile Picture Updated!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile picture";
      toast.error(errorMessage);
      console.error(err);
    }
    toast.dismiss(toastId);
  };
}

export function updateProfile(token, formData) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Updating profile...");
    let success = false;
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const existingUser = getState().profile.user;
      const updatedUser = {
        ...existingUser,
        // Update first and last name from formData if provided, else keep existing
        firstName: formData?.firstName || existingUser.firstName,
        lastName: formData?.lastName || existingUser.lastName,
        additionalData: {
          ...response.data.profileDetails,
        },
      };

      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile Updated Successfully");
      success = true;
    } catch (error) {
      console.error(error.message);
      const errorMessage = error.response?.data?.message || error.message || "Could Not Update Profile";
      toast.error(errorMessage);
    }
    toast.dismiss(toastId);
    return success;
  };
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Updating Password...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Updated Successfully");
  } catch (err) {
    console.error(err.message);
    const errorMessage = err.response?.data?.message || err.message || "Could Not Update Password";
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting Account...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Account Deleted Successfully");
      dispatch(logout(navigate));
    } catch (err) {
      console.error(err.message);
      const errorMessage = err.response?.data?.message || err.message || "Could not delete account";
      toast.error(errorMessage);
    }
    toast.dismiss(toastId);
  };
}
