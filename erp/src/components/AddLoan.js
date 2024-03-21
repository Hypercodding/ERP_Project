    import React, { useState, useEffect } from 'react';
    import Navbar from "./Navbar";
    import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
    import { InputText } from "primereact/inputtext";
    import { Dropdown } from "primereact/dropdown";
    import { Button } from "primereact/button";
    import * as Yup from "yup";
    import axios from 'axios';
    import { useNavigate } from "react-router-dom";
    import { Calendar } from 'primereact/calendar';
    import moment from 'moment';
    import { InputNumber } from 'primereact/inputnumber';

    const LoanSchema = Yup.object().shape({
        employeeId: Yup.number().required("Employee ID is required"),
        // startDate: Yup.date().required("Start Date is required"),
        // endDate: Yup.date().required("End Date is required"),
        // isDeducted: Yup.boolean().required("Is Deducted is required"),
    });

    export const AddLoan = () => {
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
                const formattedValues = {
                    ...values,
                    startDate: moment(values.startDate).format('YYYY-MM-DD'),
                    endDate: moment(values.endDate).format('YYYY-MM-DD'),
                };
        
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
        
                const response = await axios.post('http://localhost:3001/loans/grant', formattedValues, config);
        
                console.log('Loan added successfully:', response.data);
                navigate("/loans");
                resetForm();
            } catch (error) {
                console.error('Adding loan failed:', error.message);
            }
        };

        return (
            <>
                <Navbar />
                <div>
                    <h2 style={{ textAlign: "center" }} className="mt-8">Add Loan</h2>
                    <Formik
                        initialValues={{
                            employeeId: "",
                            startDate: null,
                            endDate: null,
                            isDeducted: false,
                        }}
                        validationSchema={LoanSchema}
                        onSubmit={handleSubmit}
                    >
                        <div className="grid justify-content-center formDiv  mt-5 ">
                            <Form className="p-grid p-fluid">
                                <LoanFormFields employees={employees} />
                                <div className="p-col-12 mt-4">
                                    <Button type="submit" label="Add Loan" className="signup " />
                                </div>
                            </Form>
                        </div>
                    </Formik>
                </div>
            </>
        );
    };

    const LoanFormFields = ({ employees }) => {
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
                    <Field
                        as={InputText}
                        id="amount"
                        name="amount"
                        placeholder="Enter Amount"
                        className="input  w-20rem"
                    />
                    <ErrorMessage name="amount" component="div" />
                </div>
                <div className="p-col-12 p-md-4 mt-2">
                    <Field
                        as={InputText}
                        id="durationMonths"
                        name="durationMonths"
                        placeholder="Duration Months"
                        className="input  w-20rem"
                    />
                    <ErrorMessage name="durationMonths" component="div" />
                </div>
                
            </>
        );
    };
