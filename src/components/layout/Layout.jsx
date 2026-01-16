import React from 'react';
import Header from './Header';
import logo from '../../assets/logo.png'; // Make sure path is correct relative to this file

const Layout = ({ children }) => {
    return (
        <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Background Watermark */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                opacity: 0.03, // Very subtle transparency
                zIndex: -1,
                pointerEvents: 'none',
                backgroundImage: `url(${logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain'
            }}></div>

            <Header />
            <main style={{ flex: 1, padding: '2rem 0', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    {children}
                </div>
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem 0',
                color: 'var(--color-text-light)',
                borderTop: '1px solid var(--color-border)',
                marginTop: 'auto',
                backgroundColor: 'var(--color-bg)'
            }}>
                <p>© {new Date().getFullYear()} CNDES - Sistema de Agenda</p>
            </footer>
        </div>
    );
};

export default Layout;
