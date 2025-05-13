import React, { useEffect, useState } from "react";
import { getAllEmployees, getAllRole, saveRolesToDatabase,getAllRoleDataByRole } from "../services/rolePermissionService"; // Import API service
import Navbar from "../layouts/Navbar";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";
const RoleManagement = () => {
  const [developerData, setDeveloperData] = useState([]); // State for developer data from DB
  const [roleData, setRoleData] = useState([]); // State for role data from DB
  const [selectedRoles, setSelectedRoles] = useState({}); // Store selected roles/permissions
  const [selectedRole, setSelectedRole] = useState(""); // Store the selected role

  useEffect(() => {
    fetchDeveloper();
    fetchRole();
    
  }, []);

  // Fetch role data from the backend
  const fetchRole = async () => {
    try {
      const response = await getAllRole("1"); // Fetch role data
      if (response && Array.isArray(response)) {
        setRoleData(response);
      } else {
        setRoleData([]);
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
      setRoleData([]);
    }
  };

  // Fetch developer data from the backend
  const fetchDeveloper = async () => {
    try {
      const response = await getAllEmployees("1"); // Fetch developer data
      if (response && Array.isArray(response)) {
        setDeveloperData(response);
      } else {
        setDeveloperData([]);
      }
    } catch (error) {
      console.error("Error fetching developer data:", error);
      setDeveloperData([]);
    }
  };

  // Handle checkbox change for permissions
  const handleCheckboxChange = (path, children) => {
    setSelectedRoles((prev) => {
      const isChecked = !prev[path]; // Toggle the current checkbox state
      const updatedRoles = { ...prev, [path]: isChecked };

      // If unchecking a parent, remove all child selections
      if (!isChecked) {
        children.forEach((child) => {
          delete updatedRoles[child];
        });
      }

      return updatedRoles;
    });
  };

  // Save selected roles and permissions to the database
  const savePermissions = async () => {
    if (!selectedRole) {
      alert("Please select a role first.");
      return;
    }

    try {
      // Call the save API service to send selectedRoles to the database
      const response = await saveRolesToDatabase(selectedRole, selectedRoles);
      if (response.status === 200 && response.data) {
        alert("Permissions saved successfully!");
      } else {
        alert("Failed to save permissions.");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert("Error saving permissions.");
    }
  };

  const roleChangeHandler = async (e) => {
    setSelectedRole(e.target.value);
  
    try {
      const response = await getAllRoleDataByRole(e.target.value);
      console.log("API Response:", response); // Log the full response to inspect its structure
  
      if (response && Array.isArray(response)) {
        setDeveloperData(response);
  
        const activeRoles = {};
  
        response.forEach((menu) => {
          if (menu.menuStatus === "ACTIVE") { // Fix here
            activeRoles[menu.menuName] = true;
          }
          (menu.pages || []).forEach((page) => {
            const pagePath = `${menu.menuName}.${page.pageName}`;
            if (page.pageStatus === "ACTIVE") { // Fix here
              activeRoles[pagePath] = true;
            }
            (page.components || []).forEach((component) => {
              const componentPath = `${pagePath}.${component.componentName}`;
              if (component.componentStatus === "ACTIVE") { // Fix here
                activeRoles[componentPath] = true;
              }
            });
          });
        });
  
        console.log("Active Roles:", activeRoles); // This should now populate correctly
        setSelectedRoles(activeRoles);
      } else {
        setDeveloperData([]);
        setSelectedRoles({});
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
      setDeveloperData([]);
      setSelectedRoles({});
    }
  };
  
  
  
  

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <h2>View Permission </h2>

        <div className="form-group mt-4 mb-4">
          <label htmlFor="roleSelect">Select Role:</label>
          <select
            id="roleSelect"
            className="form-control"
            value={selectedRole}
            onChange={(e) => {
             // setSelectedRole(e.target.value); // Update selected role
              roleChangeHandler(e);

            }}
          >
            <option value="">--Select a Role--</option>
            {roleData.map((role) => (
              <option key={role.id} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        {developerData.length === 0 ? (
          <p>Loading developer data...</p>
        ) : (
          developerData.map((menu) => {
            const menuPath = menu.menuName;
            const menuChildren = (menu.pages || []).flatMap((page) => [
              `${menuPath}.${page.pageName}`,
              ...(page.components || []).map((comp) => `${menuPath}.${page.pageName}.${comp.componentName}`),
            ]);

            return (
              <div
                key={menu.id || menuPath}
                style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}
              >
                {/* Menu Level */}
                <label>
                  <input
                    type="checkbox"
                    checked={!!selectedRoles[menuPath]}
                    onChange={() => handleCheckboxChange(menuPath, menuChildren)}
                  />
                  <b>{menu.menuName}</b>
                </label>

                <div style={{ marginLeft: "20px" }}>
                  {(menu.pages || []).map((page, pIndex) => {
                    const pagePath = `${menu.menuName}.${page.pageName}`;
                    const pageChildren = (page.components || []).map((comp) => `${pagePath}.${comp.componentName}`);

                    return (
                      <div key={page.id || `${menuPath}-${pIndex}`}>
                        {/* Page Level */}
                        <label>
                          <input
                            type="checkbox"
                            checked={!!selectedRoles[pagePath]}
                            onChange={() => handleCheckboxChange(pagePath, pageChildren)}
                          />
                          {page.pageName}
                        </label>

                        {/* Component Level */}
                        {page.components && (
                          <div style={{ marginLeft: "20px" }}>
                            {(page.components || []).map((component, cIndex) => {
                              const componentPath = `${pagePath}.${component.componentName}`;

                              return (
                                <div key={component.id || `${pagePath}-${cIndex}`}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={!!selectedRoles[componentPath]}
                                      onChange={() => handleCheckboxChange(componentPath, [])} // No children at component level
                                    />
                                    {component.componentName}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Save button to send selected roles to the database */}
        <button onClick={savePermissions} className="btn btn-primary mt-4">
          Update Permissions
        </button>

        <h3>Selected Permissions:</h3>
        <pre>{JSON.stringify(selectedRoles, null, 2)}</pre>
      </div>
    </>
  );
};

export default RoleManagement;
