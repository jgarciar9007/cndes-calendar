import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCalendar } from '../../context/CalendarContext';
import logo from '../../assets/logo.png';

const Header = () => {
    const { user, logout } = useAuth();
    const { setView, setCurrentDate } = useCalendar();
    const navigate = useNavigate();

    const handleLogoClick = (e) => {
        e.preventDefault();
        setView('week');
        setCurrentDate(new Date());
        navigate('/');
    };

    const formattedDate = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dateStr = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <header className="header" style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '0.75rem 0',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container flex items-center justify-between">
                <a href="/" onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                    <div style={{
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src={logo} alt="Logo CNDES" style={{ height: '100%', width: 'auto' }} />
                    </div>
                    <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem' }}>
                        <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, lineHeight: 1.2 }}>Agenda CNDES</h1>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                            {dateStr}
                        </span>
                    </div>
                </a>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2" style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                                <div style={{ padding: '6px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={16} />
                                </div>
                                {user.name}
                            </span>
                            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem', minWidth: 'auto', border: 'none', background: 'transparent' }} title="Cerrar sesión">
                                <LogOut size={20} color="var(--color-text-light)" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
                    )}
                </nav>
            </div >
        </header >
    );
};

export default Header;
