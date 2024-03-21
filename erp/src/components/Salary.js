import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios';
import Navbar from './Navbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar } from 'primereact/calendar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

export default function Salaries() {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedSalary, setEditedSalary] = useState(null);
    const dt = useRef(null);

    const fetchSalaries = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/salary/', {
                params: {
                    first: first,
                    rows: rows
                }
            });
            const salariesData = response.data;

            // Fetch additional employee information for each salary
            const employeeIds = salariesData.map(salary => salary.employeeId);
            const employeesResponse = await axios.get('http://localhost:3001/employee/', {
                params: {
                    employeeIds: employeeIds
                }
            });
            const employeesMap = new Map(employeesResponse.data.map(employee => [employee.id, employee]));

            // Update salaries data with employee information
            const salariesWithEmployeeInfo = salariesData.map(salary => {
                const employee = employeesMap.get(salary.employeeId);
                return {
                    ...salary,
                    baseSalary: employee ? employee.salary : "a",
                    employeeName: employee ? employee.employeeName : 'Unknown'
                };
            });

            setSalaries(salariesWithEmployeeInfo);
            setTotalRecords(salariesWithEmployeeInfo.length);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
        setLoading(false);
    };


    const generatePdf = (rowData) => {
        // Create a new PDF document
        const doc = new jsPDF();

        // Set document properties
        doc.setProperties({
            title: `Salary Slip - ${rowData.employeeName}`,
            author: 'Your Company Name',
        });

        // Add background color
        doc.setFillColor(255, 255, 255); // White
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

        // Add header
        doc.setFont('times', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0); // Black
        doc.text('Salary Slip', doc.internal.pageSize.width / 2, 20, { align: 'center' });

        // Add employee details
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        doc.text(`Employee ID: ${rowData.employeeId}`, 20, 40);
        doc.text(`Employee Name: ${rowData.employeeName}`, 20, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

        // Add separator line
        doc.setLineWidth(0.5);
        doc.setDrawColor(224, 224, 224); // Light Gray
        doc.line(20, 70, doc.internal.pageSize.width - 20, 70);

        // Add salary details using a table layout
        const startY = 90;
        const lineHeight = 12;
        const startX = 20;
        const cellWidth = (doc.internal.pageSize.width - 40) / 5;

        const headers = ['Component', 'Amount', 'Component', 'Amount'];
        const data = [
            ['Base Salary', rowData.baseSalary.toString(), 'Deduct Leaves', rowData.deductLeaves ? 'Yes' : 'No'],
            ['Deducted Leaves', rowData.deductedLeaves.toString(), 'Loan Amount', rowData.totalLoanAmount.toString()],
            ['', '', 'Final Salary', rowData.finalSalary.toString()],
        ];

        doc.autoTable({
            startY: startY,
            head: [headers],
            body: data,
            theme: 'grid',
            margin: { top: 5, right: 0, bottom: 0, left: 35 },
            styles: {
                fontSize: 12,
                textColor: [0, 0, 0], // Black
                lineColor: [224, 224, 224], // Light Gray
                lineWidth: 0.5,
            },
            columnStyles: {
                0: { cellWidth: cellWidth },
                1: { cellWidth: cellWidth },
                // 2: { cellWidth: cellWidth / 2 },
                2: { cellWidth: cellWidth },
                3: { cellWidth: cellWidth },
            },
        });

        // Add separator line
        doc.line(20, startY + 4 * lineHeight, doc.internal.pageSize.width - 20, startY + 4 * lineHeight);

        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Gray
        doc.text('Employee Signature:', 20, doc.internal.pageSize.height - 100);
        doc.text('This is a computer Generated slip', 80, doc.internal.pageSize.height - 20);
        doc.rect(120, doc.internal.pageSize.height - 110, 50, 20); // Add a rectangle for signature

        // Save the PDF
        doc.save(`Salary_Slip_${rowData.employeeName}.pdf`);
    };



    useEffect(() => {
        fetchSalaries();
    }, [first, rows]);

    const SalariesSchema = Yup.object().shape({
        // Define validation schema for salary fields
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Send edited salary data to the server for update
        } catch (error) {
            console.error('Error updating salary:', error.message);
            toast.error('Error updating salary');
        }
        setSubmitting(false);
    };

    const onHide = () => {
        setVisible(false);
    };

    const editSalary = (rowData) => {
        setSelectedSalary(rowData);
        setEditedSalary({ ...rowData });
        setVisible(true);
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editSalary(rowData)} />
                {/* Add delete button with appropriate onClick handler */}
            </div>
        );
    };

    const deleteSalary = async (rowData) => {
        try {
            // Send request to delete the salary
        } catch (error) {
            console.error('Error deleting salary:', error.message);
            toast.error('Error deleting salary');
        }
    };
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        // Implement PDF export functionality
    };

    const navigate = useNavigate();
    const addSalary = () => {
        navigate('/create-salary');
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-plus" rounded onClick={addSalary} />
            <Button type="button" icon="pi pi-file" rounded onClick={exportCSV} />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    const cols = [
        { field: 'employeeId', header: 'Employee ID' },
        { field: 'employeeName', header: 'Employee Name' },
        { field: 'baseSalary', header: 'Base Salary' },
        { field: 'deductLeaves', header: 'Deduct Leaves' },
        { field: 'deductedLeaves', header: 'Deducted Leaves' },
        { field: 'totalLoanAmount', header: 'Loan Amount' },
        { field: 'finalSalary', header: 'Final Salary' },
        {
            header: 'PDF',
            body: (rowData) => (
                <Button
                    type="button"
                    icon="pi pi-file-pdf"
                    className="p-button-rounded p-button-danger"
                    onClick={() => generatePdf(rowData)} // Call a function to generate PDF
                />
            )
        },
        // Other columns...
    ];

    return (
        <>
            <Navbar />
            <div className="card" style={{ textAlign: 'center' }}>
                <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable
                    ref={dt}
                    value={salaries}
                    header={header}
                    paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    onPage={onPageChange}
                    loading={loading}
                    emptyMessage="No Salaries found"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[5, 10, 20]}
                >
                    {cols.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} body={col.body} />
                    ))}
                    {/* <Column header="Actions" body={actionTemplate} className="action-buttons" /> */}
                </DataTable>

            </div>
            <Dialog visible={visible} onHide={onHide}>
                <div>
                    <h2>Edit Salary</h2>
                    <Formik
                        initialValues={editedSalary}
                        validationSchema={SalariesSchema}
                        onSubmit={handleSubmit}
                    >
                        {/* Formik form for editing a salary */}
                    </Formik>
                </div>
            </Dialog>
            <ToastContainer
                position='top-center'
                autoClose={1000}
                theme='colored'
                transition={Flip}
            />
        </>
    );
}
