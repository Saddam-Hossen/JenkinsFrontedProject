import React, { createContext, useContext, useState } from "react";

// Create RoleContext
const RoleContext = createContext();

export const useRole = () => {
  return useContext(RoleContext); // Custom hook to access the context
};

// Create a provider to wrap your app
export const RoleProvider = ({ children }) => {
  const [roleData, setRoleData] = useState(null); // Default roleData is null

  return (
    <RoleContext.Provider value={{ roleData, setRoleData }}>
      {children}
    </RoleContext.Provider>
  );
};
