import React from 'react';
import "../styles/login.css"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import * as Yup from "yup";
import { Button } from "primereact/button";

// Import Axios at the top of your file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const SignupSchema = Yup.object().shape({
  email: Yup.string().required("Mobile number is required"),
  password: Yup.string().required("Password is required")
});

const Login = () => {

  //navigation
  const navigate = useNavigate()

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      // Make API call to register user
      const response = await axios.post('http://localhost:3001/auth/login', values);

      // localStorage.setItem();
      console.log(response.data)
      // Handle success response
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token);

      navigate('/home')
      

      // You can also redirect the user to a login page or handle other actions here
    } catch (error) {
      // Handle error
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <div>
    <h2 style={{ textAlign: "center" }}>Login</h2>
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={handleSubmit}
    >
      <div className="grid justify-content-center formDiv">
        <Form className="p-grid p-fluid">
       
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
              feedback={false}
            />
            <ErrorMessage name="password" component="div" />
          </div>

        
          <div className="p-col-12 mt-4">
            <Button type="submit" label="Register" className="signup "/>
          </div>
          <div className="flex justify-content-center mt-3">
            <a href='/signup'> Signup</a>
          </div>
        </Form>
      </div>
    </Formik>
  </div>
  
  );
};

export default Login;
