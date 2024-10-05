// src/Login.js
import React, { useState,useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  useEffect(() => {
    if (auth.currentUser) {
        navigate('/home',{replace:true})
    }

  },[navigate]);

  // Styles
  const styles = {
    app: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif',
      padding: '5%',
    },
    input: {
      display: 'block',
      margin: '3% 0',
      padding: '3%',
      width: '60%',
      border: '1px solid #ccc',
      fontSize: '1em',
      borderRadius: '4px',
    },
    button: {
      padding: '3%',
      width: '60%',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      fontSize: '1em',
      marginTop: '10px',
    },
    buttonDisabled: {
      backgroundColor: '#007bff80', // Lighter color to indicate disabled state
      cursor: 'not-allowed',
    },
    errorMessage: {
      color: 'red',
      marginTop: '3%',
      fontSize: '1em',
    },
    loader: {
      marginTop: '20px',
      border: '8px solid #f3f3f3', // Light grey
      borderTop: '8px solid #007bff', // Blue
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 2s linear infinite',
    },
  };

  // Insert keyframes for spinner animation
  const spinnerAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(spinnerAnimation, styleSheet.cssRules.length);

  // Handle login
  const handleLogin = async () => {
    setLoading(true); // Start loading
    setErrorMessage(''); // Clear any previous error messages
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Redirect to home after successful login
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div style={styles.app}>
      <h2>NeoFlow</h2>
      <input
        type="text"
        placeholder="Email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading} // Disable when loading
      />
      <input
        type="password"
        placeholder="Password"
        style={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading} // Disable when loading
      />
      <button
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      {/* Display loader */}
      {loading && <div style={styles.loader}></div>}

      {/* Display error message */}
      {errorMessage && (
        <p style={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
};

export default Login;