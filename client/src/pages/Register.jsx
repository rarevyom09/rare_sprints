import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "./Video.css";
const RegisterPage = () => {
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
    digit: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      // Check password requirements
      const password = value;
      setPasswordValid({
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        specialChar: /[!@#$%^&*()-+]/.test(password),
        digit: /\d/.test(password),
      });
    }

    setFormData({ ...formData, [name]: value });
  };

  const isPasswordValid = () => {
    return (
      passwordValid.length &&
      passwordValid.lowercase &&
      passwordValid.uppercase &&
      passwordValid.specialChar &&
      passwordValid.digit
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isPasswordValid()) {
        console.error('Password does not meet requirements');
        return;
      }

      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration was successful
        setRedirect(true);
        console.log('Registration successful');
        // You can redirect the user to a login page or perform other actions here.
      } else {
        // Registration failed
        console.error('Registration failed');
        // Handle the error or show an error message to the user.
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle any network or other errors that may occur during the request.
    }
  };

  if (redirect) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto md:flex md:items-center">
        <div className="md:w-1/2">
          {/* Left Column: Image */}
          <a
              href="/" // Link to the "/explore" page
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
              Home
          </a>
          {/* <br/> */}
          <img
            className="h-full w-full"
            src="images/inf2.png"
            alt="Register Image"
          />
        </div>
        <div className="md:w-1/2 m-5">
          {/* Right Column: Form */}
          <div>
            {/* <img
              src="images/inf2.png"
              alt="Your Logo"
              className="mx-auto h-16 mb-4" 
            /> */}
            <h2 className="mt-0 text-center text-3xl font-extrabold text-gray-900">
              Register an Account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
              <li className={`flex items-center ${passwordValid.length ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                At least 8 characters
              </li>
              <li className={`flex items-center ${passwordValid.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                At least one lowercase character
              </li>
              <li className={`flex items-center ${passwordValid.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                At least one uppercase character
              </li>
              <li className={`flex items-center ${passwordValid.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                At least one special character, e.g., ! @ # ?
              </li>
              <li className={`flex items-center ${passwordValid.digit ? 'text-green-500' : 'text-red-500'}`}>
                <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                At least one digit
              </li>
            </div>
            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 text-lg font-bold rounded-md text-white ${isPasswordValid() ? 'bgmain hover:bg-indigo-700 border-black border-2' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!isPasswordValid()}
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;