import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios';
import Navbar from './Navbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function Items() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [selectedItem, setSelectedItem] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedItem, setEditedItem] = useState(null);
    const dt = useRef(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/items', {
                params: {
                    first: first,
                    rows: rows
                }
            });
            setItems(response.data);
            setTotalRecords(response.headers['x-total-count']);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [first, rows]);

    const ItemSchema = Yup.object().shape({
        itemName: Yup.string().required('Item Name is required'),
        itemNo: Yup.string().required('Item Number is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put(`http://localhost:3001/items/edit-item/${selectedItem.id}`, values);
            if (response.status === 200) {
                fetchItems();
                setVisible(false);
                console.log('Item updated successfully');
            } else {
                console.error('Error updating item:', response.data);
            }
        } catch (error) {
            console.error('Error updating item:', error.message);
        }
        setSubmitting(false);
    };

    const onHide = () => {
        setVisible(false);
    };

    const deleteItem = async (rowData) => {
        try {
            const response = await axios.delete(`http://localhost:3001/items/delete-item/${rowData.id}`);
            if (response.status === 200) {
                fetchItems();
                console.log('Item deleted successfully');
            } else {
                console.error('Error deleting item:', response.data);
            }
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editItem(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteItem(rowData)} />
            </div>
        );
    };

    const editItem = (rowData) => {
        setSelectedItem(rowData);
        setEditedItem({ ...rowData });
        setVisible(true);
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const navigate = useNavigate();
    const addNewItem = () => {
        navigate('/add-item');
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-plus" rounded onClick={addNewItem} />
            <Button type="button" icon="pi pi-file" rounded onClick={exportCSV} />
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable
                    ref={dt}
                    value={items}
                    header={header}
                    paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    onPage={onPageChange}
                    loading={loading}
                    emptyMessage="No records found"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[5, 10, 20]}
                >
                    {/* <Column field="id" header="ID" /> */}
                    <Column field="itemName" header="Item Name" />
                    <Column field="itemNo" header="Item Number" />
                    <Column field="createdAt" header="Created At" body={(rowData) => moment(rowData.createdAt).format('MMMM Do YYYY')} />
                    <Column header="Actions" body={actionTemplate} className="action-buttons" />
                </DataTable>
            </div>
            <Dialog visible={visible} onHide={onHide}>
                <div>
                    <h2>Edit Item</h2>
                    <Formik
                        initialValues={editedItem}
                        validationSchema={ItemSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-6">
                                    <label htmlFor="itemName">Item Name</label>
                                    <Field
                                        as={InputText}
                                        id="itemName"
                                        name="itemName"
                                    />
                                    <ErrorMessage name="itemName" component="div" className="error" />
                                </div>
                                <div className="p-col-12 p-md-6">
                                    <label htmlFor="itemNo">Item Number</label>
                                    <Field
                                        as={InputText}
                                        id="itemNo"
                                        name="itemNo"
                                    />
                                    <ErrorMessage name="itemNo" component="div" className="error" />
                                </div>
                            </div>
                            <Button type="submit" label="Submit" />
                        </Form>
                    </Formik>
                </div>
            </Dialog>
        </>
    );
}
