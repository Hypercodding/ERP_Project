import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as Yup from "yup";
import "../styles/signup.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SalarySchema = Yup.object().shape({
    deductLeaves: Yup.boolean().required("Deduct Leaves is required"),
});

export const AddSalary = () => {
 const   [first, setFirst] = useState(0); // Current page offset
const [rows, setRows] = useState(10); // Number of rows per page

    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [deductLeaves, setDeductLeaves] = useState(false); // Default value for deductLeaves
   
    useEffect(() => {
        fetchEmployees();
    }, [first, rows]); // Fetch data when first or rows change

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3001/employee/');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleEmployeeSelect = (selectedItems) => {
        setSelectedEmployees(selectedItems);
    };
    
    const navigate = useNavigate();
    const handleSubmit = async (values, { resetForm }) => {
        try {
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
    
            if (!selectedEmployees || selectedEmployees.length === 0) {
                console.error('No employees selected');
                return;
            }
    
            const salariesData = selectedEmployees.map(employee => ({
                employeeId: employee.id,
                deductLeaves: values[`deductLeaves_${employee.id}`] || false
            }));
    
            const response = await axios.post('http://localhost:3001/salary/salaries', { salaries: salariesData }, config);
            
            console.log('Salaries added successfully:', response.data);
            navigate("/salary");
            resetForm();
        } catch (error) {
            console.error('Adding salaries failed:', error.message);
        }
    };
     
    
    return (
        <>
            <Navbar />
            <div>
                <h2 style={{ textAlign: "center" }} className="mt-8">Add Salary</h2>
                <Formik
                    initialValues={{
                        deductLeaves: deductLeaves,
                    }}
                    validationSchema={SalarySchema}
                    onSubmit={handleSubmit}
                >
                    <div className="grid justify-content-center formDiv  mt-5 ">
                        <Form className="p-grid p-fluid">
                        <SalaryFormFields
    employees={employees}
    selectedEmployees={selectedEmployees}
    handleEmployeeSelect={handleEmployeeSelect}
    onPageChange={onPageChange} // Pass the onPageChange function to the SalaryFormFields component
/>


                            <div className="p-col-12 mt-4">
                                <Button type="submit" label="Add Salary" className="signup " />
                            </div>
                        </Form>
                    </div>
                </Formik>
            </div>
        </>
    );
};

const SalaryFormFields = ({ employees, selectedEmployees, handleEmployeeSelect, onPageChange }) => {
    const { setFieldValue } = useFormikContext();

    const handlePageChange = (event) => {
        onPageChange({
            first: event.first,
            rows: event.rows,
            page: event.page, // Add this if you need to access the current page
            pageCount: event.pageCount, // Add this if you need to access the total number of pages
        });
    };

    return (
        <div className="p-grid p-justify-between">
            <div className="p-col-12">
                <DataTable
                    value={employees}
                    selection={selectedEmployees}
                    onSelectionChange={(e) => handleEmployeeSelect(e.value)}
                    paginator={true}
                    rows={10} // Set the number of rows per page
                    first={0} // Set the initial page offset
                    onPage={handlePageChange} // Handle page change event
                >
                    <Column selectionMode="multiple" style={{ width: '3em' }} headerStyle={{ width: '3em' }} />
                    <Column field="employeeName" header="Employee Name" />
                    <Column
                        header="Deduct Leaves"
                        body={(rowData) => (
                            <Field
                                as={Dropdown}
                                id={`deductLeaves_${rowData.id}`}
                                name={`deductLeaves_${rowData.id}`}
                                options={[
                                    { label: "Deduct Leaves", value: true },
                                    { label: "Don't Deduct Leaves", value: false },
                                ]}
                                placeholder="Select Deduction Status"
                                className="input w-20rem"
                                onChange={(e) => setFieldValue(`deductLeaves_${rowData.id}`, e.value)}
                            />
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
};
