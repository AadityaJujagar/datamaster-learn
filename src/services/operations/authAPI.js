import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apis";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = authEndpoints;

export const sendOTP = (email, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP sent successfully!");
      navigate("/verify-email");
    } catch (err) {
      toast.error(err.message);
      console.error("Could not send OTP", err);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const signUp = (
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Signing up...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      console.error("Could not sign up", err);
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const login = (email, password, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Logged in successfully!");
      dispatch(setToken(response.data.token));
      const userImage = response.data.user.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard/my-profile");
    } catch (err) {
      toast.error(err.message);
      console.error("Could not login", err);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const getPasswordResetToken = (email, setEmailSent) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset link sent successfully!");
      setEmailSent(true);
    } catch (err) {
      toast.error(err.message);
    }
    dispatch(setLoading(false));
  };
};

export const resetPassword = (password, confirmPassword, token, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Resetting password...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      console.error("Could not reset password", err);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const logout = (navigate) => {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };
};
