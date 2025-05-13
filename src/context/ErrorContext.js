// ErrorContext.js
import React, { createContext, useState, useContext } from "react";

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showError = (message) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
  };

  return (
    <ErrorContext.Provider value={{ showError, errorMessage, isModalOpen, closeModal }}>
      {children}
    </ErrorContext.Provider>
  );
};
