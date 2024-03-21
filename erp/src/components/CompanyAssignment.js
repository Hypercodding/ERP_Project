import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import Navbar from './Navbar';

const CompanyAssignment = () => {
  const [companies, setCompanies] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchCompanies();
    fetchManagers();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:3001/companies/');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/user/users?role=manager');
      setManagers(response.data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Retrieve the authentication token from wherever it's stored in your application
      const token = localStorage.getItem('authToken'); // Example: Retrieve from localStorage
  
      // Set the authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Make the PUT request with the token included in the headers
      await axios.put(
        `http://localhost:3001/companies/assign-company/${values.companyId}/to-manager/${values.managerId}`,
        null, // Since PUT requests don't typically have a body, pass null or an empty object
        config // Pass the config object with the headers
      );
  
      console.log('Company assigned to manager successfully');
      resetForm();
    } catch (error) {
      console.error('Error assigning company to manager:', error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    
    <div >
      <Navbar/>
      <h2 style={{textAlign: 'center'}}>Assign Company to Manager</h2>
      <div className='flex justify-content-center'>
      <Formik
        initialValues={{ companyId: '', managerId: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              {/* <label htmlFor="companyId">Company:</label> */}
              <Field name="companyId">
                {({ field }) => (
                  <Dropdown
                    {...field}
                    options={companies.map(company => ({ label: company.companyName, value: company.id }))}
                    placeholder="Select a company"
                  />
                )}
              </Field>
              <ErrorMessage name="companyId" component="div" className="error" />
            </div>
            <div className='mt-2'>
              {/* <label htmlFor="managerId">Manager:</label> */}
              <Field name="managerId">
                {({ field }) => (
                  <Dropdown
                    {...field}
                    options={managers.map(manager => ({ label: manager.name, value: manager.id }))}
                    placeholder="Select a manager"
                  />
                )}
              </Field>
              <ErrorMessage name="managerId" component="div" className="error" />
            </div>
            <div className='mt-4 flex justify-content-center '>
            <Button className='' type="submit" disabled={isSubmitting} label={isSubmitting ? 'Submitting...' : 'Submit'} />
            </div>
          </Form>
        )}
      </Formik>
      </div>
    </div>
  );
};

export default CompanyAssignment;
