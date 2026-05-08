import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, LayoutDashboard, Database, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/inventory', label: 'Inventory', icon: <Database size={18} /> },
        { path: '/management', label: 'Management', icon: <Settings size={18} /> },
    ];

    return (
        <aside className="glass-morphism no-drag" style={{
            width: '240px',
            height: 'calc(100vh - 64px)',
            margin: '16px',
            marginTop: '48px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 8px' }}>
                <Package className="gradient-text" size={28} />
                <h2 style={{ fontWeight: '800', fontSize: '20px' }}>TalaStock</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {navItems.map(item => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: location.pathname === item.path ? 'var(--primary)' : 'transparent',
                            color: location.pathname === item.path ? 'white' : 'var(--text-muted)',
                            width: '100%',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        {item.icon} <span style={{ fontWeight: '600' }}>{item.label}</span>
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                {/* Theme Toggle Switch */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>Theme</span>
                    </div>
                    <div
                        onClick={toggleTheme}
                        style={{
                            width: '44px',
                            height: '24px',
                            background: theme === 'dark' ? 'var(--primary)' : 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div style={{
                            width: '20px',
                            height: '20px',
                            background: 'white',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            left: theme === 'dark' ? '22px' : '2px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                    </div>
                </div>

                                <button
                    onClick={handleLogout}
                    style={{
                        color: 'var(--danger)',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        width: '100%'
                    }}
                >
                    <LogOut size={18} /> <span style={{ fontWeight: '600' }}>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
