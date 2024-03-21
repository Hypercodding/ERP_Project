import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios';
import Navbar from './Navbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import Formik components
import * as Yup from 'yup'; // Import Yup for form validation
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function Employee() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(null);
    const dt = useRef(null);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/employee/');
            const formattedEmployees = response.data.map(employee => ({
                ...employee,
                dateOfBirth: moment(employee.dateOfBirth).format("MMM Do YYYY"), // Format date of birth
                dateOfJoining: moment(employee.dateOfJoining).format("MMM Do YYYY"), // Format date of joining
            }));
            setEmployees(formattedEmployees);
            setTotalRecords(response.data.length);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
        setLoading(false);
    };
    // Function to format date as 'dd/mm/yyyy'
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

    useEffect(() => {
        fetchEmployees();
    }, []);

    const EmployeeSchema = Yup.object().shape({
        employeeName: Yup.string().required('Employee Name is required'),
        cnic: Yup.string().required('CNIC is required'),
        phoneNumber: Yup.string().required('Phone Number is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put(`http://localhost:3001/employee/edit-employee/${selectedEmployee.id}`, values);
            if (response.status === 200) {
                fetchEmployees();
                setVisible(false);
                console.log('Employee updated successfully');
            } else {
                console.error('Error updating Employee:', response.data);
            }
        } catch (error) {
            console.error('Error updating Employee:', error.message);
        }
        setSubmitting(false);
    };

    const onHide = () => {
        setVisible(false);
    };

    const deleteEmployee = async (rowData) => {
        try {
            const response = await axios.delete(`http://localhost:3001/employee/delete-employee/${rowData.id}`);
            if (response.status === 200) {
                fetchEmployees();
                console.log('Employee deleted successfully');
            } else {
                console.error('Error deleting Employee:', response.data);
            }
        } catch (error) {
            console.error('Error deleting Employee:', error.message);
        }
    };
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();

                // Define columns for PDF export
                const exportColumns = [
                    { title: 'ID', dataKey: 'id' },
                    { title: 'Name', dataKey: 'employeeName' },
                    
                    { title: 'CNIC', dataKey: 'cnic' },
                    { title: 'Phone Number', dataKey: 'phoneNumber' },
                    { title: 'Gender', dataKey: 'gender' },
                    { title: 'DOB', dataKey: 'dateOfBirth' },
                    { title: 'DOJ', dataKey: 'dateOfJoining' }
                ];

                // Convert companies data to array of objects
                const data = employees.map(company => ({
                    id: company.id,
                    employeeName: company.employeeName,
                    cnic: company.cnic,
                    dateOfBirth: company.dateOfBirth,
                    dateOfJoining: company.dateOfJoining,
                    phoneNumber: company.phoneNumber,
                    gender: company.gender,
                }));

                // Add table to PDF
                doc.autoTable(exportColumns, data);
                doc.save('Employee.pdf');
            });
        });
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editEmployee(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteEmployee(rowData)} />
            </div>
        );
    };

    const editEmployee = (rowData) => {
        setSelectedEmployee(rowData);
        setEditedEmployee({ ...rowData });
        setVisible(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const addEmployee = () => {
        navigate("/add-employee");
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-plus" rounded onClick={addEmployee} />
            <Button type="button" icon="pi pi-file" rounded onClick={exportCSV} />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />

        </div>
    );

    const navigate = useNavigate();
    
    const cols = [
        { field: 'id', header: 'ID' },
        { field: 'employeeName', header: 'Company Name' },
        { field: 'cnic', header: 'CNIC' },
        { field: 'gender', header: 'Gender' }, // Display manager's name
        { field: 'phoneNumber', header: 'Phone Number' },
        { field: 'designation', header: 'Designation' },
        { field: 'dateOfBirth', header: 'DOB', dateFormat: 'dd/mm/yyyy' }, // Specify the date format for DOB
    { field: 'dateOfJoining', header: 'Joining', dateFormat: 'dd/mm/yyyy' },
        { field: 'companyId', header: 'Company' },
        // { field: 'dateOfJoining', header: 'Joining' },
    ];
   
    
    return (
        <>
            <Navbar />
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable
                    ref={dt}
                    value={employees}
                    header={header}
                    paginator
                    rows={rows}
                    totalRecords={totalRecords}
                    lazy
                    onPage={onPage}
                    loading={loading}
                    emptyMessage="No records found"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[5, 10, 20]}
                >
                    {cols.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} />
                    ))}
                    <Column header="Actions" body={actionTemplate} className="action-buttons" />
                </DataTable>
            </div>
            <Dialog visible={visible} onHide={onHide}>
                <div>
                    <h2>Edit Employee</h2>
                    <Formik
                        initialValues={editedEmployee}
                        validationSchema={EmployeeSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-6">
                                    <label htmlFor="employeeName">Employee Name</label>
                                    <Field as={InputText} id="employeeName" name="employeeName" />
                                    <ErrorMessage name="employeeName" component="div" className="error" />
                                </div>
                                <div className="p-col-12 p-md-6 mt-2">
                                    <label htmlFor="designation">Designation</label>
                                    <Field as={InputText} id="designation" name="designation" />
                                    <ErrorMessage name="designation" component="div" className="error" />
                                </div>
                                <div className="p-col-12 p-md-6 mt-2">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <Field as={InputText} id="phoneNumber" name="phoneNumber" />
                                    <ErrorMessage name="phoneNumber" component="div" className="error" />
                                </div>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-6 pl-4 ml-8 mt-3">
                                    <Button type="submit" label="Update" />
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </Dialog>
        </>
    );
}
