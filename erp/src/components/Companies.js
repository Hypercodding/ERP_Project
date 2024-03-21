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
import { jwtDecode } from 'jwt-decode';


export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedCompany, setEditedCompany] = useState(null);
    const dt = useRef(null);
   
    const cols = [
        { field: 'id', header: 'ID' },
        { field: 'companyName', header: 'Company Name' },
        { field: 'companyStatus', header: 'Company Status' },
        { field: 'managerName', header: 'Manager Name' } // Display manager's name
    ];
    

    const fetchCompanies = async () => {
    setLoading(true);
    try {
        const response = await fetch('http://localhost:3001/companies');
        if (!response.ok) {
            throw new Error('Failed to fetch companies');
        }
        const companiesData = await response.json();

        // Fetch manager names for each company
        const updatedCompaniesData = await Promise.all(companiesData.map(async company => {
            // Fetch manager details using managerId
            const managerResponse = await fetch(`http://localhost:3001/user/users/${company.managerId}`);
            if (!managerResponse.ok) {
                throw new Error(`Failed to fetch manager for company ID ${company.id}`);
            }
            const managerData = await managerResponse.json();
            const managerName = managerData.name;
            return {
                ...company,
                managerName: managerName
            };
        }));

        setCompanies(updatedCompaniesData);
        setTotalRecords(updatedCompaniesData.length);
    } catch (error) {
        console.error('Error fetching companies:', error);
    }
    setLoading(false);
};

    

    // Define validation schema for company form
    const CompanySchema = Yup.object().shape({
        companyName: Yup.string().required('Company Name is required'),
        companyStatus: Yup.string().required('Company Status is required'),
    });

    // Define the handleSubmit function for handling form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Make a PUT request to update the company
            const response = await axios.put(`http://localhost:3001/companies/edit-company/${selectedCompany.id}`, values);
            
            // Check if the update was successful
            if (response.status === 200) {
                // If successful, fetch the updated list of companies
                fetchCompanies();
                setVisible(false); // Hide the modal after successful update
                console.log('Company updated successfully');
            } else {
                console.error('Error updating company:', response.data);
            }
        } catch (error) {
            console.error('Error updating company:', error.message);
        }
        
        setSubmitting(false); // Reset the form submission state
    };

    const onHide = () => {
        setVisible(false);
    };
    const deleteCompany = async (rowData) => {
        try {
            const token = localStorage.getItem('token'); // Assuming you store the token in localStorage after login
    
            const response = await axios.delete(`http://localhost:3001/companies/delete-company/${rowData.id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            });
    
            if (response.status === 200) {
                fetchCompanies();
                console.log('Company deleted successfully');
            } else {
                console.error('Error deleting company:', response.data);
            }
        } catch (error) {
            console.error('Error deleting company:', error.message);
        }
    };

    
    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editCompany(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteCompany(rowData)} />
            </div>
        );
    };
    const editCompany = (rowData) => {
        setSelectedCompany(rowData);
        setEditedCompany({ ...rowData }); // Clone the selected company for editing
        setVisible(true);
    };
    // Call fetchCompanies when component mounts
    useEffect(() => {
        fetchCompanies();
    }, []);

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();

                // Define columns for PDF export
                const exportColumns = [
                    { title: 'ID', dataKey: 'id' },
                    { title: 'Name', dataKey: 'companyName' },
                    
                    { title: 'Manager', dataKey: 'managerId' },
                    { title: 'Status', dataKey: 'companyStatus' }
                ];

                // Convert companies data to array of objects
                const data = companies.map(company => ({
                    id: company.id,
                    companyName: company.companyName,
                    companyStatus: company.companyStatus
                }));

                // Add table to PDF
                doc.autoTable(exportColumns, data);
                doc.save('companies.pdf');
            });
        });
    };

    const navigate = useNavigate();
    const addCompany = ()=>{
        navigate("/company-Registration")
    }

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-plus" rounded onClick={addCompany} data-pr-tooltip="CSV" className="mr-3"/>
            <Button type="button" icon="pi pi-file" rounded onClick={exportCSV} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable
                    ref={dt}
                    value={companies}
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
            {/* Edit Company Modal */}
            <Dialog visible={visible} onHide={onHide}>
                <div>
                    <h2>Edit Company</h2>
                    <Formik
                        initialValues={editedCompany}
                        validationSchema={CompanySchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-6">
                                    <label htmlFor="companyName">Company Name</label>
                                    <Field
                                        as={InputText}
                                        id="companyName"
                                        name="companyName"
                                    />
                                    <ErrorMessage name="companyName" component="div" className="error" />
                                </div>
                                <div className="p-col-12 p-md-6 mt-2">
                                    <label htmlFor="companyStatus">Company Status</label>
                                    <Field
                                        as={InputText}
                                        id="companyStatus"
                                        name="companyStatus"
                                    />
                                    <ErrorMessage name="companyStatus" component="div" className="error" />
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
