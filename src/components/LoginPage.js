import React, { useContext, useEffect, useRef, useState } from 'react'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { Context } from '../App';
import $ from 'jquery';

export const LoginPage = () => {
  const { backendLocation } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.keyCode === 13) {
        console.log("Enter pressed");
        onSubmit();
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
    /*
    if(localStorage.getItem('token')) {
      navigate('/main')
    }
    */
  }, [email, password]);


  const [animationClass, setAnimationClass] = useState('loader');
  const loaderRef = useRef(null);
  const onSubmit = async () => {
    setLoading(true);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    if(email == '' || password == '') {
      alert('Please fill in all fields')
      setLoading(false);
      return
    }

    try {
      const response = await axios.post(`${backendLocation}/users/login`, {
          email: email,
          password: password
      });

      if (response.data.message) {
          alert(response.data.message)
      } else {
          setAnimationClass('thumbs-up animate');
          localStorage.setItem('token', response.data.token);
          await delay(1400);
          navigate('/main');
      }
    } catch (error) {
        alert("registration failed: " + "email in use");
        console.log(error);
        setLoading(false);
    }
  }

  return (
    <div className="w-[auto] px-6 py-4 h-[90vh] flex flex-col bg-green-500/10 justify-center rounded-xl min-w-[450px] items-center">

          <h1 className="text-3xl tracking-wider text-center text-white roboto-bold letter-space">Login</h1>

          <div className="flex gap-2 items-center w-[100%]">
            <FontAwesomeIcon icon={faUser} className="mt-6 text-white"/>
            <input className="flex px-2 py-2 rounded-md mt-6 bg-white/30 placeholder-white/70 focus:outline-none w-[100%]" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
          </div>
          <div className="flex gap-2 items-center w-[100%]">
            <FontAwesomeIcon icon={faKey} className="mt-6 text-white"/>
            <input className="passwordInput flex px-2 py-2 rounded-md mt-6 bg-white/30 placeholder-white/70 focus:outline-none w-[100%]" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} />
          </div>

          <a className="mt-3 text-sm text-center text-white hover:cursor-pointer" onClick={() => {navigate("/register")}}>Register?</a>

          <button className="flex px-2 py-2 rounded-md mt-6 bg-green-400/90 text-white w-[50%]" onClick={onSubmit}>
          {!loading ? (
            <div className="flex-1 text-center">Login</div>
          ) : (
            <div ref={loaderRef} className={animationClass} />
          )}
          </button>
    </div>
  )
}
