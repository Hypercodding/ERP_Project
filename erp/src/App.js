import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { Company_Registration } from "./components/Company_Registration";
import PrivateRoutes from './utils/PrivateRoute'
import Companies from "./components/Companies";
import CompanyAssignment from "./components/CompanyAssignment";
import Employee from "./components/Employee";
import { AddEmployee } from "./components/AddEmployee";
import Leaves from "./components/Leaves";
import { AddLeaves } from "./components/AddLeaves";
import Loans from "./components/Loans";
import { AddLoan } from "./components/AddLoan";
import Salaries from "./components/Salary";
import { AddSalary } from "./components/AddSalary";
import Items from "./components/Items";
import { AddItem } from "./components/AddItems";
import PurchaseItem  from "./components/PurchaseItem";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoutes />}>
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/company-Registration" element={<Company_Registration />} />
                <Route path="/company-Assignment" element={<CompanyAssignment />} />
                <Route path="/company" element={<Companies />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/add-employee" element={<AddEmployee/>} />
                <Route path="/leaves" element={<Leaves/>} />
                <Route path="/loans" element={<Loans/>} />
                <Route path="/add-leaves" element={<AddLeaves/>} />
                <Route path="/add-loan" element={<AddLoan/>} />
                <Route path="/salary" element={<Salaries/>} />
                <Route path="/create-salary" element={<AddSalary/>} />
                <Route path="/item" element={<Items/>} />
                <Route path="/add-item" element={<AddItem/>} />
                <Route path="/purchase" element={<PurchaseItem/>} />

            </Route>
          
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
