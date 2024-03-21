import React, { useState } from 'react';
import Navbar from "./Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ItemSchema = Yup.object().shape({
    itemName: Yup.string().required("Item Name is required"),
    itemNo: Yup.string().required("Item Number is required"),
    // quantity: Yup.number().required("Quantity is required").positive("Quantity must be positive").integer("Quantity must be an integer"),
});

export const AddItem = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await axios.post('http://localhost:3001/items/add-item', values);
            console.log('Item added successfully:', response.data);
            navigate("/item");
            resetForm();
        } catch (error) {
            console.error('Adding item failed:', error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div>
                <h2 style={{ textAlign: "center" }} className="mt-8">Add Item</h2>
                <Formik
                    initialValues={{
                        itemName: "",
                        itemNo: "",
                        quantity: "",
                    }}
                    validationSchema={ItemSchema}
                    onSubmit={handleSubmit}
                >
                    <div className="grid justify-content-center formDiv mt-5 ">
                        <Form className="p-grid p-fluid">
                            <ItemFormFields />
                            <div className="p-col-12 mt-4">
                                <Button type="submit" label="Add Item" className="signup" />
                            </div>
                        </Form>
                    </div>
                </Formik>
            </div>
        </>
    );
};

const ItemFormFields = () => {
    return (
        <>
            <div className="p-col-12 p-md-4">
                <Field
                    as={InputText}
                    id="itemName"
                    name="itemName"
                    placeholder="Enter Item Name"
                    className="input w-20rem"
                />
                <ErrorMessage name="itemName" component="div" className="error" />
            </div>
            <div className="p-col-12 p-md-4 mt-2">
                <Field
                    as={InputText}
                    id="itemNo"
                    name="itemNo"
                    placeholder="Enter Item Number"
                    className="input w-20rem"
                />
                <ErrorMessage name="itemNo" component="div" className="error" />
            </div>
           
        </>
    );
};
