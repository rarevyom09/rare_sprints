import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "./Video.css";

const LoginPage = () => {
  const { setUserInfo } = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Start loading

      const response = await fetch('https://sprintsbyvyompadalia-rarevyom09.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Login successful');
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
          console.log(userInfo);
          setRedirect(true);
          localStorage.setItem('token', userInfo.token);
        });
      } else {
        console.error('Login failed');
        setAlertMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading when request completes
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 md:flex md:items-center">
        <div className="md:w-1/2">
          <a
            href="/"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            Home
          </a>
          <img
            className="h-full w-full mt-2"
            src="images/inf2.png"
            alt="Login Image"
          />
        </div>
        <div className="md:w-1/2 m-5">
          <div>
            {/* <img
              src="images/inf2.png"
              alt="Your Logo"
              className="mx-auto h-16 mb-4"
            /> */}
            <h2 className="mt-0 text-center text-3xl font-extrabold text-gray-900">
              Login to Your Account
            </h2>
          </div>
          {alertMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4">
              {alertMessage}
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
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
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-black text-lg font-bold rounded-md text-white bgmain hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
