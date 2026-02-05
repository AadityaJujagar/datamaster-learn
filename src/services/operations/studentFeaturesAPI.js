import rzpLogo from "../../assets/Logo/rzp_logo.png";
import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function buyCourse({ token, courses, user, navigate, dispatch }) {
  const toastId = toast.loading("Processing...");
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: `${orderResponse.data.message.amount}`,
      order_id: orderResponse.data.message.id,
      name: "DMC.Learn",
      description: "Thank you for purchasing the course.",
      image: rzpLogo,
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          },
          orderResponse.data.message.amount,
          token
        );

        verifyPayment(
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courses,
          },
          token,
          navigate,
          dispatch
        );
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (res) {
      toast.error("Oops.. Payment failed");
      console.log(res.error);
    });
  } catch (err) {
    console.error("Error in buyCourse:", err);
    toast.error("Payment process failed");
  }
  toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying payment...");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment successful! You're enrolled in the course.");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    toast.error("Payment verification failed");
  } finally {
    dispatch(setPaymentLoading(false));
    toast.dismiss(toastId);
  }
}
