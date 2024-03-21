import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import * as Yup from "yup";
import "../styles/signup.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Calendar } from 'primereact/calendar';
import moment from 'moment';

const EmployeeSchema = Yup.object().shape({
    employeeName: Yup.string().required("Name is required"),
    cnic: Yup.string().required("cnic is required"),
    gender: Yup.string().required("gender is required"),
    phoneNumber: Yup.string().required("phoneNumber is required"),
    // dateOfBirth: Yup.string().required("date of birth is required"),
    // dateOfJoining: Yup.string().required("Date of Joining is required"),
    designation: Yup.string().required("designation is required"),
    companyId: Yup.string().required("Company is required"),
});

export const AddEmployee = () => {
    const [companies, setCompanies] = useState([]);
   
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('http://localhost:3001/companies');
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };
    const navigate = useNavigate();
    const handleSubmit = async (values, { resetForm }) => {
        try {
          // Format dateOfBirth and dateOfJoining
          const formattedValues = {
            ...values,
            dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD'), // Convert to YYYY-MM-DD format
            dateOfJoining: moment(values.dateOfJoining).format('YYYY-MM-DD'), // Convert to YYYY-MM-DD format
          };
      
          console.log('Form Values:', formattedValues);
      
          // Rest of the code remains the same
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token not found');
            return;
          }
      
          const config = {
            headers: {
              Authorization: token
            }
          };
      
          const response = await axios.post('http://localhost:3001/employee/add-employee', formattedValues, config);
      
          console.log('Employee Added successfully:', response.data);
          navigate("/employee");
          resetForm();
        } catch (error) {
          console.error('Registration failed:', error.message);
        }
      };


    return (
        <>
            <Navbar />
            <div>
                <h2 style={{ textAlign: "center" }} className="">Register Company</h2>
                <Formik
                    initialValues={{
                        employeeName: "",
                        cnic: "",
                        phoneNumber: "",
                        gender: "",
                        dateOfBirth: null,
                        dateOfJoining: null,
                        companyId: "",
                        designation: "",
                    }}
                    validationSchema={EmployeeSchema}
                    onSubmit={handleSubmit}
                >
                    <div className="grid justify-content-center formDiv  mt-5 ">
                        <Form className="p-grid p-fluid">
                            <EmployeeFormFields companies={companies} />
                            <div className="p-col-12 mt-4">
                                <Button type="submit" label="Register" className="signup " />
                            </div>
                        </Form>
                    </div>
                </Formik>
            </div>
        </>
    );
};

const EmployeeFormFields = ({ companies }) => {
    const { values, setFieldValue } = useFormikContext();

    const employeeGender = [
        { label: "Select your company Staus", value: null },
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
    ];

    return (
        <>
            <div className="p-col-12 p-md-4">
                <Field
                    as={InputText}
                    id="employeeName"
                    name="employeeName"
                    placeholder="Enter Employee Name"
                    className="input  w-20rem"
                />
                <ErrorMessage name="employeeName" component="div" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Field
                    as={InputText}
                    id="salary"
                    name="salary"
                    placeholder="Enter salary"
                    className="input  w-20rem"
                />
                <ErrorMessage name="employeeName" component="div" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Field
                    as={InputText}
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    className="input  w-20rem"
                />
                <ErrorMessage name="phoneNumber" component="div" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Field
                    as={InputText}
                    id="cnic"
                    name="cnic"
                    placeholder="Enter CNIC"
                    className="input  w-20rem"
                />
                <ErrorMessage name="cnic" component="div" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Field
                    as={InputText}
                    id="designation"
                    name="designation"
                    placeholder="Designation"
                    className="input  w-20rem"
                />
                <ErrorMessage name="designation" component="div" />
            </div>
            <div className="p-col-12 p-md-3">
                <Field
                    as={Dropdown}
                    id="gender"
                    name="gender"
                    options={employeeGender}
                    placeholder="Select Gender"
                    className="input mt-2"
                />
                <ErrorMessage name="gender" component="div" />
            </div>
            <div className="p-col-12 p-md-3 mt-2">
                <Calendar
                    id="dateOfBirth"
                    name="dateOfBirth"
                    dateFormat="dd-mm-yy"
                    placeholder="Select DOB"
                    value={values.dateOfBirth}
                    onChange={(e) => setFieldValue('dateOfBirth', e.value)}
                    className="input rounded-border"
                />
                <ErrorMessage name="dateOfBirth" component="div" />
            </div>
            <div className="p-col-12 p-md-3 mt-2">
                <Calendar
                    id="dateOfJoining"
                    name="dateOfJoining"
                    dateFormat="dd-mm-yy"
                    placeholder="Select Date of Joining"
                    value={values.dateOfJoining}
                    onChange={(e) => setFieldValue('dateOfJoining', e.value)}
                    className="input rounded-border"
                />
                <ErrorMessage name="dateOfJoining" component="div" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Field
                    as={Dropdown}
                    id="companyId"
                    name="companyId"
                    options={companies.map(company => ({ label: company.companyName, value: company.id }))}
                    placeholder="Select Company"
                    className="input"
                />
                <ErrorMessage name="companyId" component="div" />
            </div>
        </>
    );
};
