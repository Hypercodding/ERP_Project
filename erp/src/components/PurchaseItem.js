import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import * as Yup from 'yup';
import axios from 'axios';
import Navbar from './Navbar';

const PurchaseItem = () => {
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchAccounts();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const initialValues = {
    itemId: '',
    quantity: '',
    amountPerPiece: '',
    totalAmount: '',
    vendorName: '',
    accountId: '',
    expiryDate: '',
    purchaseDate: '',
    receipt: null,
  };

  const validationSchema = Yup.object().shape({
    itemId: Yup.string().required('Item is required'),
    quantity: Yup.number().required('Quantity is required'),
    amountPerPiece: Yup.number().required('Amount per Piece is required'),
    totalAmount: Yup.number().required('Total Amount is required'),
    vendorName: Yup.string().required('Vendor Name is required'),
    accountId: Yup.string().required('Account is required'),
    expiryDate: Yup.date().required('Expiry Date is required'),
    purchaseDate: Yup.date().required('Purchase Date is required'),
    receipt: Yup.mixed().required('Receipt is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      const response = await axios.post('http://localhost:3001/purchase-item/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      // Optionally, handle success response here

    } catch (error) {
      console.error('Error submitting form:', error);
      // Optionally, handle error here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-content-center">
        <div className="card">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="p-grid p-fluid">
                <div className="p-col-12">
                  <label htmlFor="itemId">Item</label>
                  <Field name="itemId">
                    {({ field }) => (
                      <Dropdown
                        {...field}
                        value={field.value}
                        options={items.map(item => ({ label: item.itemName, value: item.id }))}
                        onChange={(e) => setFieldValue('itemId', e.value)}
                        placeholder="Select an Item"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="itemId" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="quantity">Quantity</label>
                  <Field name="quantity" type="number" className="p-inputtext p-component" />
                  <ErrorMessage name="quantity" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="amountPerPiece">Amount Per Piece</label>
                  <Field name="amountPerPiece" type="number" className="p-inputtext p-component" />
                  <ErrorMessage name="amountPerPiece" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="totalAmount">Total Amount</label>
                  <Field name="totalAmount" type="number" className="p-inputtext p-component" placeholder="amount" />
                  <ErrorMessage name="totalAmount" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="vendorName">Vendor Name</label>
                  <Field name="vendorName" className="p-inputtext p-component" />
                  <ErrorMessage name="vendorName" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="accountId">Account</label>
                  <Field name="accountId">
                    {({ field }) => (
                      <Dropdown
                        {...field}
                        value={field.value}
                        options={accounts.map(account => ({ label: account.account_name, value: account.id }))}
                        onChange={(e) => setFieldValue('accountId', e.value)}
                        placeholder="Select an Account"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="accountId" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <Field name="expiryDate" type="date" className="p-inputtext p-component" />
                  <ErrorMessage name="expiryDate" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="purchaseDate">Purchase Date</label>
                  <Field name="purchaseDate" type="date" className="p-inputtext p-component" />
                  <ErrorMessage name="purchaseDate" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <label htmlFor="receipt">Receipt</label>
                  <input
                    type="file"
                    id="receipt"
                    name="receipt"
                    onChange={(e) => setFieldValue('receipt', e.target.files[0])}
                    className="p-inputtext p-component"
                  />
                  <ErrorMessage name="receipt" component="div" className="p-error" />
                </div>
                <div className="p-col-12">
                  <Button label="Submit" type="submit" disabled={isSubmitting} />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default PurchaseItem;
