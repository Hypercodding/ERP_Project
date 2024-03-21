import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios';
import Navbar from './Navbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik'; // Import useFormikContext
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar } from 'primereact/calendar';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

export default function Loans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedLoan, setEditedLoan] = useState(null);
    const dt = useRef(null);

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/loans/getAllLoans');
            setLoans(response.data);
            setTotalRecords(response.data.length);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const LoansSchema = Yup.object().shape({
        // Define validation schema for loan fields
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Send edited loan data to the server for update
        } catch (error) {
            console.error('Error updating loan:', error.message);
            toast.error('Error updating loan');
        }
        setSubmitting(false);
    };

    const onHide = () => {
        setVisible(false);
    };

    const editLoan = (rowData) => {
        setSelectedLoan(rowData);
        setEditedLoan({ ...rowData });
        setVisible(true);
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editLoan(rowData)} />
                {/* Add delete button with appropriate onClick handler */}
            </div>
        );
    };

    const deleteLoan = async (rowData) => {
        try {
            // Send request to delete the loan
        } catch (error) {
            console.error('Error deleting loan:', error.message);
            toast.error('Error deleting loan');
        }
    };

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();
    
                // Define columns for PDF export
                const exportColumns = [
                    { title: 'Employee ID', dataKey: 'employeeId' },
                    { title: 'Loan Amount', dataKey: 'amount' },
                    { title: 'Loan Duration', dataKey: 'durationMonths' },
                    { title: 'Remaining Amount', dataKey: 'remainingAmount' },
                    { title: 'Monthly Installment', dataKey: 'monthlyInstallment' },
                    { 
                        title: 'Availed At', 
                        dataKey: 'createdAt',
                        formatData: (rowData) => moment(rowData.createdAt).format('MMMM Do YYYY') 
                    },
                    // Other columns...
                ];
    
                // Convert loans data to array of objects
                const data = loans.map(loan => ({
                    employeeId: loan.employeeId,
                    amount: loan.amount,
                    durationMonths: loan.durationMonths,
                    remainingAmount: loan.remainingAmount,
                    monthlyInstallment: loan.monthlyInstallment,
                    createdAt: loan.createdAt,
                    // Other fields...
                }));
    
                // Add table to PDF
                doc.autoTable(exportColumns, data);
                toast.success('PDF Downloading',{
                    icon: 'fa-solid fa-file-pdf fa-bounce'
                } )
                doc.save('Loans.pdf');
            });
        });
    };
    

    const navigate = useNavigate();
    const addLoan = ()=>{
        navigate('/add-loan')
    }

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
             <Button type="button" icon="pi pi-plus" rounded onClick={addLoan} />
            <Button type="button" icon="pi pi-file" rounded onClick={exportCSV} />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    

    const cols = [
        { field: 'employeeId', header: 'Employee ID' },
        { field: 'amount', header: 'Loan Amount' },
        { field: 'durationMonths', header: 'Duration' },
        { 
            field: 'remainingAmount', 
            header: 'Remaining Amount',
            body: (rowData) => rowData.remainingAmount.toFixed(2) // Limit to two decimal places
        },
        { 
            field: 'monthlyInstallment', 
            header: 'Monthly Installment',
            body: (rowData) => rowData.monthlyInstallment.toFixed(2) // Limit to two decimal places
        },
        { 
            field: 'createdAt', 
            header: 'Availed At', 
            body: (rowData) => moment(rowData.createdAt).format('MMMM Do YYYY'),
            style: { textAlign: 'center' } // Optional: To align the text to the center
        },
            
            // { field: 'year', header: 'Year' },
        // { field: 'isDeducted', header: 'Is Deducted' },
    ];

    return (

        <>
        <Navbar/>
            <div className="card" style={{textAlign: 'center'}}>
            <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable
                    ref={dt}
                    value={loans}
                    header={header}
                    paginator
                    rows={rows}
                    totalRecords={totalRecords}
                    lazy
                    onPage={onPage}
                    loading={loading}
                    emptyMessage="No Loans found"
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
                    <h2>Edit Loan</h2>
                    <Formik
                        initialValues={editedLoan}
                        validationSchema={LoansSchema}
                        onSubmit={handleSubmit}
                    >
                        {/* Formik form for editing a loan */}
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
