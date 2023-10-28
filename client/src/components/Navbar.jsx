import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Navbar.css";
const Header = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:4000/profile", {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          console.log(data);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch user information:", errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserInfo();
  }, [setUserInfo]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('token');
        setUserInfo(null);
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 600) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const token = localStorage.getItem('token');
  const token_available = token ? true : false;

  return (
    <div className={`flex justify-center items-center mt-11 mb-11`}>
      <nav className={`fixed w-1/2 z-20 border-2 border-black rounded-3xl my-3 navbg ${scrolled ? 'w-1/3 border-white' : ''}`}>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/">
            <a href="/" className={`flex items-center ${scrolled ? 'ml-2' : ''}`}>
              <img
                src={require("../images/inf2.png")}
                className={`h-8 mr-3 ${scrolled ? 'h-9' : ''}`}
                alt="Flowbite Logo"
              />
              <span className={`self-center ${scrolled ? 'hidden' : 'text-white font-bold text-4xl'}`}>
                Sprint(s)
              </span>
            </a>
          </Link>
          <div className="flex md:order-2">
            {token_available ? (
              <>
                <Link to="/mysprint">
                  <button
                    type="button"
                    className="text-blue-800 bg-white hover:bg-black hover:text-white  font-medium rounded-3xl text-sm px-4 py-2 text-center mr-3"
                  >
                    My Sprints
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button
                    type="button"
                    className="text-blue-800 bg-white hover:bg-black hover:text-white  font-medium rounded-3xl text-sm px-4 py-2 text-center mr-3"
                  >
                    +
                  </button>
                </Link>
                <button
                  type="button"
                  className="text-blue-800 bg-white hover:bg-red-300 hover:text-black  font-medium rounded-3xl text-sm px-4 py-2 text-center"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-3xl text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800"
                >
                  Login / Register
                </button>
              </Link>
            )}
          </div>
          
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
          </div>
          
        </div>
        
      </nav>
    </div>
  );
};

export default Header;
