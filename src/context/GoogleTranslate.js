// GoogleTranslate.js
import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const addTranslateScript = () => {
      if (!window.google?.translate) {
        const script = document.createElement("script");
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,bn,de,hi", // Customize as needed
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      };
    };

    addTranslateScript();
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}
    />
  );
};

export default GoogleTranslate;
