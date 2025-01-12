import React, { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'primereact/button';
import "../styles/signup.css"


import logoImage from './user.png';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false);

  let navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const decoded = jwtDecode(token);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded.role)
      setIsAdmin(decoded.role === "admin" ?  "Admin" : "Manager");
    }
  }, [token]);

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      to: '/home',
    },
    {
      label: 'Employee',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Employee Data',
          icon: 'pi pi-database',
          command: () => navigate('/employee'),
        },
        {
          label: 'Leaves',
          icon: 'pi pi-reply',
          command: () => navigate('/leaves'),
        },
        {
          label: 'Loans',
          icon: 'pi pi-wallet',
          command: () => navigate('/loans'),
        },
      ],
    },
    {
      label: 'Company',
      icon: 'pi pi-building',
      items: [
        {
          label: 'Companies',
          icon: 'pi pi-list',
          command: () => navigate('/company'),
        },
        {
          label: 'Assgn',
          icon: 'pi pi-plus',
          command: () => navigate('/company-Assignment'),
        },
      ]
    },
    {
      label: 'Stock',
      icon: 'pi pi-box',
      items: [
        {
          label: 'Items',
          icon: 'pi pi-ticket',
          command: () => navigate('/Item'),
        },
        {
          label: 'Purchase Item',
          icon: 'pi pi-ticket',
          command: () => navigate('/purchase'),
        },
        {
          label: 'Prchase Table',
          icon: 'pi pi-database',
          command: () => navigate('/Purchase'),
        },
      ]
    },
    {
      label: 'Salary',
      icon: 'pi pi-money-bill',
      command: () => navigate('/salary'),
    },
    {
      label: 'Product',
      icon: 'pi pi-shopping-bag',
      items: [
        {
          label: 'Add Product',
          icon: 'pi pi-plus',
          command: () => navigate('/addProduct'),
        },
        {
          label: 'List Products',
          icon: 'pi pi-list',
          command: () => navigate('/outProduct'),
        },
        {
          label: 'Inventry',
          icon: 'pi pi-list',
          command: () => navigate('/inventry'),
        },
      ],
    },
    {
      label: 'Bank Account',
      icon: 'pi pi-home',
      to: '/account',
    },
    // {
    //   label: 'Register',
    //   icon: 'pi pi-bars',
    //   items: [
    //     {
    //       label: 'Employee',
    //       icon: 'pi pi-plus',
    //       command: () => navigate('/register'),
    //     },
    //     {
    //       label: 'Company',
    //       icon: 'pi pi-plus',
    //       command: () => navigate('/register_company'),
    //     },
    //   ],
    // },
  ];

  const start = <img alt="logo" src={logoImage} height="40" className="mr-2"></img>;

  const end = (
    <div className="flex align-items-center gap-2">
      {(decoded.role === "Admin") && (
        <NavLink to="/signup">
          <i className="pi pi-user-plus mx-3 " size="large" style={{ color: '#708090', fontSize: '1.5rem' }}></i>
        </NavLink>
      )}

      <Button
        icon="pi pi-sign-out"
        className="p-button-text"
        style={{ color: '#708090', fontSize: '1.1rem' }}
        onClick={Logout}
      />
    </div>
  );

  return (
    <div className="card">
      <Menubar
        model={items.map((item) => ({
          ...item,
          template: () => (
            <NavLink to={item.to} className="flex align-items-center p-menuitem-link navbar">
              <span className={item.icon} />
              <span className="mx-2">{item.label}</span>
              {item.badge && <Badge className="ml-auto" value={item.badge} />}
              {item.shortcut && (
                <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                  {item.shortcut}
                </span>
              )}
            </NavLink>
          ),
        }))}
        start={start}
        end={end}
      />
    </div>
  );
}
