import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons';

export const MainPage = () => {
  const { backendLocation } = useContext(Context);
  const [details, setDetails] = useState(); // [ {note: '', username: '', password: '', date: ''}
  const [addState, setAddState] = useState(false);

  const [detailExpanded, setDetailExpanded] = useState();

  const [note, setNote] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [confirmPopUp, setConfirmPopUp] = useState(false);

  const exitStates = () => {
    setAddState(false);
    setDetailExpanded();
    setConfirmPopUp(false);
  }

  const fetchData = async () => {
    try {
      console.log(`Bearer ${localStorage.getItem('token')}`);
      const response = await axios.get(`${backendLocation}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDetails(response.data);
      console.log(response.data);
    }
    catch (error) {
      alert('invalid/missing toked, please login again');
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  const deleteDetail = async () => {
    try {
      const response = await axios.delete(`${backendLocation}/details/${detailExpanded.detailId}`, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      fetchData();
      exitStates();
    } catch (error) {
      alert('something went wrong. Try logging in again');
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  const addDetails = async () => {
    try {
      const response = await axios.post(`${backendLocation}/details`, {
        note: note,
        username: username,
        password: password
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      fetchData();
      exitStates();
    } catch (error) {
      alert('something went wrong. Try logging in again');
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  useEffect(() => {
    if(!localStorage.getItem('token')) {
      alert('Please login to view this page')
      navigate('/')
    }

    fetchData();
  }, [])


  useEffect(() => {
    if(detailExpanded) {
      console.log(detailExpanded);
    }
  }, [detailExpanded])

  
  return (
    <div className='w-[100%] flex flex-col items-center justify-center text-center'>
      {/*----------------------ADDING NEW TABLE----------------------*/}
      {(addState || detailExpanded) && <div className='w-[100vw] h-[100vh] bg-black/30 absolute' onClick={() => {exitStates()}}/>}
      {addState && <div className='w-[30%] flex flex-col items-center bg-white absolute text-black h-auto rounded-md py-4'> 
        <button className='absolute text-2xl text-red-600 top-6 right-6'><FontAwesomeIcon icon={faX} onClick={() => {setAddState(false)}}/></button>
        <h1 className='text-3xl'>Add Details</h1>
        <input className='w-[80%] p-2 m-2' placeholder='Note (e.g: for steam)' onChange={(e) => {setNote(e.target.value)}}/>
        <input className='w-[80%] p-2 m-2' placeholder='Username/Email' onChange={(e) => {setUsername(e.target.value)}}/>
        <input className='w-[80%] p-2 m-2' placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}/>
        <button className='w-[80%] p-2 m-2 bg-green-400 rounded-md' onClick={addDetails}>Add</button>
      </div>}
      {/*----------------------WHEN DETAIL IS CLICKED----------------------*/}

      {detailExpanded && <div className='w-[30%] flex flex-col items-center bg-white absolute text-black h-auto rounded-md py-4'>
        <button className='absolute text-2xl text-red-600 top-6 right-6'><FontAwesomeIcon icon={faX} onClick={() => {setDetailExpanded()}}/></button>
        <h1 className='text-3xl'>Details</h1>
        <p>Note: {detailExpanded.note}</p>
        <p>Username/Email: {detailExpanded.username}</p>
        <p>Password: {detailExpanded.password}</p>
        <p>Date Created: {new Date(detailExpanded.createdDate).toLocaleDateString()}</p>
        <button className='w-[80%] p-2 m-2 bg-red-400 rounded-md' onClick={() => {setConfirmPopUp(true)}}><FontAwesomeIcon icon={faTrash}/>Delete</button>
        </div>}

        {confirmPopUp && <div className='w-[30%] flex flex-col items-center bg-white absolute text-black h-auto rounded-md py-4 border-2 border-solid border-black'>
        <h1 className='text-3xl'>Are you sure?</h1>
        <button className='w-[80%] p-2 m-2 bg-red-400 rounded-md' onClick={deleteDetail}>Yes</button>
        <button className='w-[80%] p-2 m-2 bg-green-400 rounded-md' onClick={() => {setConfirmPopUp(false)}}>No</button>
        </div>}
        {/*----------------------TABLE----------------------*/}

      <div className='grid grid-cols-3 w-[90%]'>
        <div></div>
        <h1 className='text-2xl'>Details</h1>
        <button onClick={() => setAddState(true)} className='p-2  rounded-xl w-[30px] h-[auto] justify-self-end'><FontAwesomeIcon className='text-3xl text-green-400' icon = {faPlus}/></button>
      </div>
      <table className='rounded-t-xl bg-white/70 w-[90%] '>
        <tr>
          <th>Note</th>
          <th>Username/Email</th>
          <th className='hidden md:table-cell'>Password</th>
          <th className='hidden md:table-cell'>Date Created</th>
        </tr>
        {details? details.map((detail) => {
          const date = new Date(detail.createdDate);
          return (
            <tr onClick={() => {setDetailExpanded(detail)}} className="h-[40px] hover:cursor-pointer hover:bg-purple-300">
              <td>{detail.note}</td>
              <td>{detail.username}</td>
              <td className='hidden md:table-cell'>{detail.password}</td>
              <td className='hidden md:table-cell'>{date.toLocaleDateString()}</td>
            </tr>
          )
        }) : <tr><td>Loading...</td></tr>}
        
      </table>

    </div>
  )
}
