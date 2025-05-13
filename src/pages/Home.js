import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const expiryTime = sessionStorage.getItem("expiry");

    if (expiryTime) {
      const remainingTime = expiryTime - Date.now();

      const timeout = setTimeout(() => {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("expiry");
        navigate("/");
      }, remainingTime);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [navigate]);

  return <h1>Welcome to Home Page</h1>;
};

export default Home;
