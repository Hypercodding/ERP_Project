import React from 'react'
import Navbar from "./Navbar"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import * as Yup from "yup";
import "../styles/signup.css";
// Import Axios at the top of your file
import axios from 'axios';
import { useNavigate } from "react-router-dom";



const CompanySchema = Yup.object().shape({
    companyName: Yup.string().required("Name is required"),
    companyStatus: Yup.string().required("Status is required"),
  });
export const Company_Registration = () => {
    const initialValues = {
        companyName: "",
        companyStatus: "",
      };

      const navigate = useNavigate();
    
      const handleSubmit = async (values, { resetForm }) => {
        try {
          // Retrieve the token from localStorage
          const token = localStorage.getItem('token');
      
          // Make sure token exists
          if (!token) {
            console.error('Token not found');
            // Handle error
            return;
          }
      
          // Set authorization header with the token
          const config = {
            headers: {
              Authorization: token
            }
          };
      
          // Make API call to register company with authorization header
          const response = await axios.post('http://localhost:3001/companies/create-company', values, config);
      
          // Handle success response
          console.log('Created Company successful:', response.data);
      
          // Navigate to appropriate page
          navigate("/company");
      
          // Reset the form after successful submission
          resetForm();
      
          // You can also redirect the user to a login page or handle other actions here
        } catch (error) {
          // Handle error
          console.error('Registration failed:', error.message);
        }
      };
      
      const companyStatus = [
        { label: "Select your company Staus", value: null },
        { label: "Active", value: "Active" },
        { label: "InActive", value: "InActive" },
        // Add more roles if needed
      ];
      
    
  return (
    <>
    < Navbar />
    <div>
      <h2 style={{ textAlign: "center" }} className="mt-8">Register Company</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={CompanySchema}
        onSubmit={handleSubmit}
      >
        <div className="grid justify-content-center formDiv  mt-5 ">
          <Form className="p-grid p-fluid">
          <div className="p-col-12 p-md-4">
              
              <Field
                as={InputText}
                id="companyName"
                name="companyName"
                placeholder="Enter your Company Name"
                className="input  w-20rem"
              />
              <ErrorMessage name="companyName" component="div" />
            </div>

            <div className="p-col-12 p-md-3">
              
              <Field
                as={Dropdown}
                id="companyStatus"
                name="companyStatus"
                options={companyStatus}
                placeholder="Select Status"
                className="input mt-3"
              />
              <ErrorMessage name="companyStatus" component="div" />
            </div>

            <div className="p-col-12 mt-4">
              <Button type="submit" label="Register" className="signup "/>
            </div>
          </Form>
        </div>
      </Formik>
    </div>
    </>
  )
  
}
