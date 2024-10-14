import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const ITEMS_PER_PAGE = 10;
const PAGE_TRANSITION_TIME = 15000;

const getWaitNoStatus = (waitno) => {
  if (waitno === 0) return 'In Consultation';
  if (waitno === 1) return 'Next';
  return `Wait No: ${waitno}`;
};

const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      console.log('I am going inside to fetch the data from firebase');
      const dbRef = ref(database, `/users/${user.uid}/realtime`);

      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          const value = snapshot.val();
          if (value) {
            try {
              const parsedData = JSON.parse(value);
              const formattedData = Object.keys(parsedData).map((key) => ({
                sno: key,
                ...parsedData[key],
              }));
              setData(formattedData);
            } catch (e) {
              console.error('Failed to parse data', e);
            }
          } else {
            setData([]);
          }
        },
        (error) => {
          console.error('Error fetching data', error);
        }
      );

      return () => unsubscribe();
    }
  }, [user?.uid, data]); // Add `data` to dependency array

  useEffect(() => {
    let interval;
    if (data.length > 0) {
      interval = setInterval(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % Math.ceil(data.length / ITEMS_PER_PAGE));
      }, PAGE_TRANSITION_TIME);
    }

    return () => clearInterval(interval);
  }, [data.length]);

  const styles = {
    container: {
      width: '100%',
      margin: 0,
      padding: 0,
      marginTop: '10vh',
    },
    banner: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#3865ad',
      height: '10vh',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 900,
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderColor: 'white',
    },
    header: {
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '5% 30% 20% 20% 25%',
      backgroundColor: '#3865ad',
    },
    headercell: {
      flex: 1,
      textAlign: 'center',
      fontSize: '150%',
      color: '#ffffff',
    },
    scrollView: {
      overflowY: 'auto',
    },
    image: {
      height: '130%',
      width: '14.5%',
      paddingLeft: '45%',
    },
    row: {
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '5% 30% 20% 20% 25%',
      borderBottomWidth: '2px',
      borderColor: '#CCCCCC',
      borderBottomStyle: 'solid',
    },
    cell: {
      flex: 1,
      padding: '18px',
      fontSize: '120%',
      textAlign: 'center',
    },
    signout: {
      position: 'absolute',
      left: '20px',
      borderColor: 'white',
      borderWidth: '2px',
      borderStyle: 'solid',
      zIndex: 1000,
      backgroundColor: 'transparent',
      color: 'white',
      padding: '8px 16px',
      cursor: 'pointer',
    },
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/', { replace: true }); // Redirect to login page after sign out
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = data.slice(startIndex, endIndex);

  return (
    <div>
      <div style={styles.banner}>
        <button style={styles.signout} onClick={handleSignOut}>Sign Out</button>
        <img src='/nobglogo.png' style={styles.image} alt="" />
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.headercell}>SNO</h3>
          <h3 style={styles.headercell}>Patient Name</h3>
          <h3 style={styles.headercell}>Status</h3>
          <h3 style={styles.headercell}>Department</h3>
          <h3 style={styles.headercell}>Doctor Name</h3>
        </div>
      </div>
      
      <div style={styles.scrollView}>
        {currentPageData.map((item) => (
          <div key={item.sno} style={styles.row}>
            <div style={styles.cell}>{item.sno}</div>
            <div style={styles.cell}>{item.name}</div>
            <div style={styles.cell}>{getWaitNoStatus(item.waitno)}</div>
            <div style={styles.cell}>{item.docdept}</div>
            <div style={styles.cell}>{item.docname}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
