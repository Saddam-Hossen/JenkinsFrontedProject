import React, { use, useState,useEffect } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../layouts/Navbar";
import {addPositionSettingData,getAllPositionData ,deletePositionData,updatePositionData} from "../services/positionService";
import { addEmployee,getAllEmployees } from "../services/employeeService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";


const EditableTable = () => {
  const [data, setData] = useState([
    
  ]);

  const [editValues, setEditValues] = useState(data.map((row) => row.position));
  const fetchPositionData = async () => {
    try {
      const response = await getAllEmployees("1");
     

      setData(response);
      setEditValues(response.map((row) => row.position));
    } catch (error) {
      console.error("Error fetching position data:", error);
    }
  };
  useEffect(() => {
    

    fetchPositionData();
  }, []);

  const handlePositionChange = (index, value) => {
    const updatedEditValues = [...editValues];
    updatedEditValues[index] = value;
    setEditValues(updatedEditValues);
  };

  const handleKeyPress = async (row,index, event) => {
    if (event.key === "Enter") {
       // console.log("row",row);
     
      const updatedData = [...data];
      updatedData[index].position = editValues[index];
       await updatePositionData( updatedData[index] );
      //console.log("updatedData",updatedData[index]);
      setData(updatedData);
      fetchPositionData();
      alert("Position updated successfully");
    }
  };

  return (
    <> 
      <Navbar />        
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className=" text-center">ID</th>
              <th className=" text-center">Name</th>
              <th className=" text-center">Position</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className=" text-center">{row.idNumber}</td>
                <td className=" text-center">{row.name}</td>
                <td>
                <input
                  type="text"
                  className="form-control text-center"
                  value={editValues[index]}
                  onChange={(e) => handlePositionChange(index, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(row, index, e)}
                  disabled={!checkAccessComponent("Employee", "Position", "Update")}
                />
              </td>

                
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default EditableTable;
