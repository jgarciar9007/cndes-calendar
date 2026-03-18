import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Reports from './pages/Reports';

function App() {
    return (
        <AuthProvider>
            <CalendarProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/reports" element={<Reports />} />
                                </Routes>
                            </Layout>
                        } />
                    </Routes>
                </Router>
            </CalendarProvider>
        </AuthProvider>
    );
}

export default App;
