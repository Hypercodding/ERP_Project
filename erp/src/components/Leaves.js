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


export default function Leaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedLeave, setEditedLeave] = useState(null);
    const dt = useRef(null);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/leaves/getAllLeaves');
            const formattedLeaves = response.data.map(leave => ({
                ...leave,
                startDate: formatDate(leave.startDate), // Format start date
                endDate: formatDate(leave.endDate), // Format end date
            }));
            setLeaves(formattedLeaves);
            setTotalRecords(response.data.length);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const LeavesSchema = Yup.object().shape({
        employeeId: Yup.number().required('Employee ID is required'),
        startDate: Yup.date().required('Start Date is required'),
        endDate: Yup.date().required('End Date is required'),
        days: Yup.number().required('Days is required'),
        month: Yup.number().required('Month is required'),
        year: Yup.number().required('Year is required'),
        isDeducted: Yup.boolean().required('Is Deducted is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("clicked")
            const response = await axios.put(`http://localhost:3001/leaves/edit-leave/${selectedLeave.id}`, values);
            if (response.status === 200) {
                fetchLeaves();
                setVisible(false);
                console.log("success")
                toast.success('Leave updated successfully');
            } else {
                console.error('Error updating leave:', response.data);
                toast.error('Error updating leave');
            }
        } catch (error) {
            console.error('Error updating leave:', error.message);
            toast.error('Error updating leave');
        }
        setSubmitting(false);
    };

    const onHide = () => {
        setVisible(false);
    };

    const editLeave = (rowData) => {
        setSelectedLeave(rowData);
        setEditedLeave({ ...rowData });
        setVisible(true);
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editLeave(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteLeave(rowData)} />
            </div>
        );
    };

    const deleteLeave = async (rowData) => {
        try {
            const response = await axios.delete(`http://localhost:3001/leaves/delete-leave/${rowData.id}`);
            if (response.status === 200) {
                fetchLeaves();
                toast.success('Leave deleted successfully'); // Success notification
            } else {
                console.error('Error deleting Employee:', response.data);
                toast.error('Error deleting leave'); // Error notification
            }
        } catch (error) {
            console.error('Error deleting leave:', error.message);
            toast.error('Error deleting leave'); // Error notification
        }
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();
    
                // Define columns for PDF export
                const exportColumns = [
                    { title: 'Employee ID', dataKey: 'employeeId' },
                    { title: 'Start Date', dataKey: 'startDate' },
                    { title: 'End Date', dataKey: 'endDate' },
                    { title: 'Days', dataKey: 'days' },
                    { title: 'Month', dataKey: 'month' },
                    { title: 'Year', dataKey: 'year' },
                    { title: 'Is Deducted', dataKey: 'isDeducted' }
                ];
    
                // Convert leaves data to array of objects
                const data = leaves.map(leave => ({
                    employeeId: leave.employeeId,
                    startDate: leave.startDate,
                    endDate: leave.endDate,
                    days: leave.days,
                    month: leave.month,
                    year: leave.year,
                    isDeducted: leave.isDeducted ? 'Yes' : 'No'
                }));
    
                // Add table to PDF
                doc.autoTable(exportColumns, data);
                toast.success('PDF Downloading',{
                    icon: 'fa-solid fa-file-pdf fa-bounce'
                } )
                doc.save('Leaves.pdf');
            });
        });
    };
    

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const addLeave = () => {
        navigate('/add-leaves')
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-plus" rounded onClick={addLeave} />
            <Button type="button" icon="pi pi-file" rounded onClick={exportCSV} />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const cols = [
        { field: 'employeeId', header: 'Employee ID' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'endDate', header: 'End Date' },
        { field: 'days', header: 'Days' },
        { field: 'month', header: 'Month' },
        { field: 'year', header: 'Year' },
        { field: 'isDeducted', header: 'Is Deducted' },
    ];

    return (
        <>
            <Navbar />
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable
                    ref={dt}
                    value={leaves}
                    header={header}
                    paginator
                    rows={rows}
                    totalRecords={totalRecords}
                    lazy
                    onPage={onPage}
                    loading={loading}
                    emptyMessage="No leaves found"
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
                    <h2>Edit Leave</h2>
                    <Formik
                        initialValues={editedLeave}
                        validationSchema={LeavesSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setSubmitting, setFieldValue }) => ( // Add useFormikContext here
                            <Form>
                                <div className="p-grid">
                                    <div className="p-col-12 p-md-6">
                                        <label htmlFor="employeeId">Employee ID</label>
                                        <Field as={InputText} id="employeeId" name="employeeId" />
                                        <ErrorMessage name="employeeId" component="div" className="error" />
                                    </div>
                                    <div className="p-col-12 p-md-6 mt-2">
                                        <label htmlFor="startDate">Start Date</label>
                                        <Calendar id="startDate" name="startDate" value={editedLeave.startDate} placeholder={editedLeave.startDate} onChange={(e) => setFieldValue('startDate', e.value)} showIcon />

                                        <ErrorMessage name="startDate" component="div" className="error" />
                                    </div>
                                    <div className="p-col-12 p-md-6 mt-2">
                                        <label htmlFor="endDate">End Date</label>
                                        <Calendar id="endDate" name="endDate" value={editedLeave.endDate} onChange={(e) => setFieldValue('endDate', e.value)} placeholder={editedLeave.endDate} showIcon />
                                        <ErrorMessage name="endDate" component="div" className="error" />
                                    </div>
                                    {/* Add input fields for other leave properties */}
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-12 p-md-6 pl-4 ml-8 mt-3">
                                        <Button type="submit" label="Update" />
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Dialog>
            <ToastContainer
            position='top-center'
            autoClose={1000}
            theme='colored'
            transition={Flip}/>
        </>
    );
}
