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

const LeavesSchema = Yup.object().shape({
    employeeId: Yup.number().required("Employee ID is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
    
    isDeducted: Yup.boolean().required("Is Deducted is required"),
});

export const AddLeaves = () => {
    const [employees, setEmployees] = useState([]);
   
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3001/employee/');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };
    const navigate = useNavigate();
    const handleSubmit = async (values, { resetForm }) => {
        try {
          // Format startDate and endDate
           const formattedValues = {
            ...values,
            startDate: moment(values.startDate).format('YYYY-MM-DD'),
            endDate: moment(values.endDate).format('YYYY-MM-DD'),
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
      
          const response = await axios.post('http://localhost:3001/leaves/add-leaves', formattedValues, config);
      
          console.log('Leave Added successfully:', response.data);
          navigate("/leaves");
          resetForm();
        } catch (error) {
          console.error('Adding leave failed:', error.message);
        }
      };


    return (
        <>
            <Navbar />
            <div>
                <h2 style={{ textAlign: "center" }} className="mt-8">Add Leaves</h2>
                <Formik
                    initialValues={{
                        employeeId: "",
                        startDate: null,
                        endDate: null,
                        days: "",
                        month: "",
                        year: "",
                        isDeducted: false,
                    }}
                    validationSchema={LeavesSchema}
                    onSubmit={handleSubmit}
                >
                    <div className="grid justify-content-center formDiv  mt-5 ">
                        <Form className="p-grid p-fluid">
                            <LeavesFormFields employees={employees} />
                            <div className="p-col-12 mt-4">
                                <Button type="submit" label="Add Leave" className="signup " />
                            </div>
                        </Form>
                    </div>
                </Formik>
            </div>
        </>
    );
};

const LeavesFormFields = ({ employees }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <>
            <div className="p-col-12 p-md-4">
                <Field
                    as={Dropdown}
                    id="employeeId"
                    name="employeeId"
                    options={employees.map(employee => ({ label: employee.employeeName, value: employee.id }))}
                    placeholder="Select Employee"
                    className="input w-20rem"
                />
                <ErrorMessage name="employeeId" component="div" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Calendar
                    id="startDate"
                    name="startDate"
                    dateFormat="dd-mm-yy"
                    placeholder="Select Start Date"
                    value={values.startDate}
                    onChange={(e) => setFieldValue('startDate', e.value)}
                    className="input rounded-border"
                />
                <ErrorMessage name="startDate" component="div" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Calendar
                    id="endDate"
                    name="endDate"
                    dateFormat="dd-mm-yy"
                    placeholder="Select End Date"
                    value={values.endDate}
                    onChange={(e) => setFieldValue('endDate', e.value)}
                    className="input rounded-border"
                />
                <ErrorMessage name="endDate" component="div" />
            </div>
            
            <div className="p-col-12 p-md-4 mt-2">
                <Field
                    as={Dropdown}
                    id="isDeducted"
                    name="isDeducted"
                    options={[
                        { label: "Deducted", value: true },
                        { label: "Not Deducted", value: false },
                    ]}
                    placeholder="Select Deduction Status"
                    className="input w-20rem"
                />
                <ErrorMessage name="isDeducted" component="div" />
            </div>
        </>
    );
};
