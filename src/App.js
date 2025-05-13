import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { isTokenExpired, checkAndRefreshToken } from "./services/Auth";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let inactivityTimer = null;
  
  
  // ✅ Google Translate script loader
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById("google-translate-script")) return;
  
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };
  
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
             includedLanguages: "en,bn,hi,ar,de,zh-CN,ur,fa,ja", // ✅ Added Urdu (ur) and Farsi (fa)

            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false, // ✅ This disables the top bar
          },
          "google_translate_element"
        );
      }
    };
  
    addGoogleTranslateScript();
  }, []);
  
  
  
  
  

  // ✅ Auth check
  useEffect(() => {
    const storedAuthToken = localStorage.getItem("authToken");
    if (storedAuthToken && !isTokenExpired()) {
      setIsAuthenticated(true);
    }

    if (isAuthenticated) {
      const interval = setInterval(checkAndRefreshToken, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // ✅ Auto logout after inactivity
  useEffect(() => {
    if (isAuthenticated) {
      const resetTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          logoutUser();
        }, 20 * 60 * 1000); // 20 minutes
      };

      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keypress", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);

      resetTimer();

      return () => {
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keypress", resetTimer);
        window.removeEventListener("click", resetTimer);
        window.removeEventListener("scroll", resetTimer);
        clearTimeout(inactivityTimer);
      };
    }
  }, [isAuthenticated]);

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* Global Translate Dropdown */}
      <div
  id="google_translate_element"
  style={{
    position: "fixed",
    top: 10,
    right: 10,
    zIndex: 99999,
    background: "white",
    padding: "4px",
    borderRadius: "4px",
  }}
></div>

      <AppRoutes />
    </>
  );
};

export default App;
