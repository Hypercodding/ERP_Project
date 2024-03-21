// Signup.js
import React from "react";
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


const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Mobile number is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string().required("Role is required"),
});

const Signup = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "",
  };
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Make API call to register user
      const response = await axios.post('http://localhost:3001/auth/register', values);

      // Handle success response
      console.log('Registration successful:', response.data);

      navigate("/");
      // Reset the form after successful submission
      resetForm();

      // You can also redirect the user to a login page or handle other actions here
    } catch (error) {
      // Handle error
      console.error('Registration failed:', error.message);
    }
  };


  const roles = [
    { label: "Select your role", value: null },
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    // Add more roles if needed
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center" }} className="mt-8">Signup</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        <div className="grid justify-content-center formDiv  mt-5 ">
          <Form className="p-grid p-fluid">
          <div className="p-col-12 p-md-4">
              
              <Field
                as={InputText}
                id="name"
                name="name"
                placeholder="Enter your Name"
                className="input  w-20rem"
              />
              <ErrorMessage name="name" component="div" />
            </div>
            <div className="p-col-12 p-md-4">
              
              <Field
                as={InputText}
                id="email"
                name="email"
                placeholder="Enter your Email"
                className="input  w-20rem mt-3"
              />
              <ErrorMessage name="email" component="div" />
            </div>

            <div className="p-col-12 p-md-4 ">
              
              <Field
                as={Password}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="input rounded-border mt-3"
              />
              <ErrorMessage name="password" component="div" />
            </div>

            <div className="p-col-12 p-md-3">
              
              <Field
                as={Dropdown}
                id="role"
                name="role"
                options={roles}
                placeholder="Select your role"
                className="input mt-3"
              />
              <ErrorMessage name="role" component="div" />
            </div>

            <div className="p-col-12 mt-4">
              <Button type="submit" label="Register" className="signup "/>
            </div>
          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default Signup;
