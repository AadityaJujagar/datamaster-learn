import { Template } from "../components/core/auth/Template";
import loginImage from "../assets/Images/login.webp";

export const Login = () => {
  return (
    <Template
      title="Welcome Back!"
      desc1="Build skills for today, tomorrow, and beyond."
      desc2="Education to future-proof your career."
      image={loginImage}
      formType="login"
    />
  );
};
