import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <CalendarProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </CalendarProvider>
    </AuthProvider>
  );
}

export default App;
