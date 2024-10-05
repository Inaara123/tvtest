// src/Login.js
import React from 'react';

const Login = () => {
  const styles = {
    app: {
      display: 'flex',
      flexDirection : 'column',
      alignItems: 'center',
      height: '100%',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif',
      padding: '5%',
    },

    
    input: {
      display: 'block',
      margin: '3% 0',
      padding: '3%',
      width: '60%',
      border: '1% solid #ccc',
      fontSize: '150%'
    },
    button: {
      padding: '3%',
      width: '60%',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '0.5%',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      fontSize: '150%',
    },
    errorMessage: {
      color: 'red',
      marginTop: '3%',
      fontSize: '1.5%',
    },
  };

  return (
    <div style={styles.app}>
     
        <h2>NeoFlow</h2>
        <input type="text" placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <button style={styles.button}>Sign In</button>
        <div style={styles.errorMessage}>Error message here</div>

    </div>
  );
};

export default Login;