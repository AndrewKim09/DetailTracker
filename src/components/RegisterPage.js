import React, { useState, useRef, useContext } from 'react'
import { faKey, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../App';

export const RegisterPage = () => {
  const { backendLocation } = useContext(Context);
  const loaderRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState('loader');
  const delay = ms => new Promise(res => setTimeout(res, ms));

  /* FOR TESTING BUTTON ANIMATION
  const testButtonRef = useRef(null);
  const [testAnimationClass, setTestAnimationClass] = useState('loader');
  const onAnimationTest = () => {
    if(testButtonRef.current.classList.contains('animate')) {
      setTestAnimationClass('loader');
      return;
    } else{
      setTestAnimationClass('thumbs-up animate');
      delay(1400).then(() => {
        setTestAnimationClass('loader');
      });
    }
  };
  */

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const onSubmit = async () => {

    if (password === '' || email === '' || confirmPassword === '') {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }

    if(!isValidEmail(email)) {
      alert('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    
    try {
      const response = await axios.post(`${backendLocation}/users/register`, {
          email: email,
          password: password
      });

      if (response.data.message) {
          alert(response.data.message)
      } else {
          setAnimationClass('thumbs-up animate');
          await delay(1300);
      }
  } catch (error) {
      alert("registration failed: " + "email in use");
      console.log(error);
  } finally {
      setLoading(false);
      navigate('/');
  }
  };

  return (
    <div className="w-[auto] px-6 py-4 h-[90vh] flex flex-col bg-green-500/10 justify-center rounded-xl min-w-[450px] items-center">
      <h1 className="roboto-bold text-white text-center text-3xl letter-space tracking-wider">Register</h1>

      <div className="flex gap-2 items-center w-[100%]">
        <FontAwesomeIcon icon={faUserCircle} className="text-white mt-6" />
        <input
          className="flex px-2 py-2 rounded-md mt-6 bg-white/30 placeholder-white/70 focus:outline-none w-[100%]"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-2 items-center w-[100%]">
        <FontAwesomeIcon icon={faKey} className="text-white mt-6" />
        <input
          className="flex px-2 py-2 rounded-md mt-6 bg-white/30 placeholder-white/70 focus:outline-none w-[100%]"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-2 items-center w-[100%]">
        <FontAwesomeIcon icon={faKey} className="text-white mt-6" />
        <input
          className="flex px-2 py-2 rounded-md mt-6 bg-white/30 placeholder-white/70 focus:outline-none w-[100%]"
          placeholder="Confirm Password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <a
        className="text-sm text-black-200 text-center mt-3 hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        Already have an account?
      </a>

      <button
        className="flex items-center justify-center px-2 py-2 rounded-md mt-6 bg-green-400/90 text-white w-[50%]"
        onClick={onSubmit}
        disabled={loading}
      >
        {!loading ? (
          <div className="flex-1 text-center">Register</div>
        ) : (
          <div ref={loaderRef} className={animationClass} />
        )}
      </button>

      {/* USE TO TEST ANIMATION
        <button ref={testButtonRef} className={testAnimationClass} onClick={onAnimationTest}/>
      */}
    </div>
  );
};
