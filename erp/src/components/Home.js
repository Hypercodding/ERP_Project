import Navbar from "./Navbar"
import "../styles/home.css"
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const Home = () => {
  const [name, setUserName] = useState('');
  useEffect(() => {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Decode the token to extract user information
        const decoded = jwtDecode(token);
        
        // Extract the user's name from the decoded token
        const name  = decoded.username;
        console.log(decoded)
        
        // Set the user's name to the state variable
        setUserName(name);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (<>
    < Navbar />
    <div>
      <h1>Welcome, {name}</h1>
    </div>
    </>
  )
  
}

export default Home;