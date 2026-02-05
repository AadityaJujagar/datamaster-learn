// eslint-disable no-unused-vars
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId }
    );
    if (!response?.data?.success) {
      throw new Error("Failed to fetch data");
    }
    result = response?.data?.data;
  } catch (err) {
    console.error("Error fetching catalog page data:", err);
    const errorMessage = err.response?.data?.message || err.message || "Failed to fetch data";
    toast.error(errorMessage);
  }

  toast.dismiss(toastId);
  return result;
};
