import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Body from './components/Body';
import Footer from './components/Footer';
import Login from './pages/Login';
import Video from './pages/Video';
import Dashboard from './pages/Dashboard';
import { AuthContextProvider } from './AuthContext';
import Register from './pages/Register';
import MySprint from './pages/MySprint';
// import { HotToastProvider } from 'react-hot-toast';

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Route for the "/login" path */}
            <Route 
              path="/login" 
              element={
              <Login/>
              } 

            />
            <Route path="/video" element={<Layout> {/* Wrap content in Layout */}
              <Video /> {/* Display the Login component */}
            </Layout>} />
            
            <Route
              path="/video/:id"
              element={
                <Layout>
                  {/* Pass event data by fetching it based on the id parameter */}
                  <Video />
                </Layout>
              }
            />

            <Route 
              path="/register" 
              element={
              <Register/>
              } 

            />

            {/* Route for the "/dashboard" path */}
            <Route path="/dashboard" element={<Layout> {/* Wrap content in Layout */}
              <Dashboard /> {/* Display the Body component */}
            </Layout>} />

            {/* Route for the "/mysprint" path */}
            <Route path="/mysprint" element={<Layout> {/* Wrap content in Layout */}
              <MySprint /> {/* Display the Body component */}
            </Layout>} />

            {/* Route for the "/" path */}
            <Route path="/" element={<Layout> {/* Wrap content in Layout */}
              <Body /> {/* Display the Body component */}
            </Layout>} />



          </Routes>

        </div>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
