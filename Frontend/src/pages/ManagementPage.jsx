import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Users, Globe, Trash2, Tag, Plus, Save, Edit, UserPlus } from 'lucide-react';
import Modal from '../components/Modal';

const ManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', title: '', data: {} });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [u, r, c, cat] = await Promise.allSettled([
                adminService.getUsers(),
                adminService.getRoles(),
                adminService.getCurrencies(),
                adminService.getCategories()
            ]);

            if (u.status === 'fulfilled') setUsers(u.value);
            if (r.status === 'fulfilled') setRoles(r.value);
            if (c.status === 'fulfilled') setCurrencies(c.value);
            if (cat.status === 'fulfilled') setCategories(cat.value);
        } catch (err) {
            console.error('Data synchronization failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, title, data = {}) => {
        // Ensure data is properly initialized for type
        let initialData = { ...data };
        if (type === 'create_user' && !initialData.roleId) {
            initialData.roleId = roles[0]?.roleId || 2; // Default to 'User' role if available
        }
        setModalConfig({ isOpen: true, type, title, data: initialData });
    };

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { type, data } = modalConfig;
        try {
            if (type === 'create_user') {
                await adminService.createUser(data);
            } else if (type === 'edit_user') {
                await adminService.updateUser(data.userId, { username: data.username, email: data.email });
            } else if (type === 'add_category') {
                await adminService.addCategory(data);
            } else if (type === 'edit_category') {
                await adminService.updateCategory(data.categoryId, data);
            } else if (type === 'add_currency') {
                await adminService.addCurrency(data);
            } else if (type === 'edit_currency') {
                await adminService.updateCurrency(data.currencyId, data);
            }
            await fetchAllData();
            closeModal();
        } catch (err) {
            console.error(`Management [${type}] failed:`, err);
            alert(`Save failed: ${err.response?.data?.message || err.message || 'Server error'}`);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Delete this record? This cannot be undone.')) return;
        try {
            if (type === 'user') await adminService.deleteUser(id);
            if (type === 'category') await adminService.deleteCategory(id);
            if (type === 'currency') await adminService.deleteCurrency(id);
            await fetchAllData();
        } catch (err) {
            alert('Delete failed. Record might be in use or protected.');
        }
    };

    const handleRoleUpdate = async (userId, roleId) => {
        try {
            console.log(`Updating role for user ${userId} to role ${roleId}`);
            const response = await adminService.updateUserRole(userId, roleId);
            console.log('Role update response:', response);
            await fetchAllData();
        } catch (err) {
            console.error('Role update error details:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                stack: err.stack
            });
            alert(`Failed to update role: ${err.response?.data?.message || err.message || 'Server error'}`);
        }
    };

    const handleSetDefaultCurrency = async (id) => {
        try {
            await adminService.setDefaultCurrency(id);
            await fetchAllData();
        } catch (err) {
            alert('Failed to set default currency');
        }
    };

    return (
        <div style={{ height: '100vh', background: 'var(--bg-dark)', display: 'flex', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '272px', padding: '16px', height: '100vh', paddingTop: '48px' }}>
                <div className="glass-morphism" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h1 style={{ fontSize: '20px', fontWeight: '800' }}>System Management</h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Administrative control over users, stock categories, and currencies.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-dark)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                {['users', 'categories', 'currencies'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            padding: '6px 16px',
                                            borderRadius: '6px',
                                            background: activeTab === tab ? 'var(--primary)' : 'transparent',
                                            color: activeTab === tab ? 'white' : 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            textTransform: 'capitalize'
                                        }}>
                                        {tab === 'users' && <Users size={14} />}
                                        {tab === 'categories' && <Tag size={14} />}
                                        {tab === 'currencies' && <Globe size={14} />}
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: activeTab === 'users' ? '0' : '24px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Synchronizing system data...</div>
                        ) : (
                            <>
                                {activeTab === 'users' && (
                                    <>
                                        <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => openModal('create_user', 'Register New User', { username: '', email: '', password: '' })}
                                                style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <UserPlus size={16} /> Add System User
                                            </button>
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10 }}>
                                                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                                    <th style={{ padding: '12px 24px' }}>Username</th>
                                                    <th style={{ padding: '12px 24px' }}>Email</th>
                                                    <th style={{ padding: '12px 24px' }}>Role</th>
                                                    <th style={{ padding: '12px 24px' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(user => (
                                                    <tr key={user.userId} style={{ borderBottom: '1px solid var(--border)' }}>
                                                        <td style={{ padding: '10px 24px', fontWeight: '650' }}>{user.username}</td>
                                                        <td style={{ padding: '10px 24px', color: 'var(--text-muted)' }}>{user.email}</td>
                                                        <td style={{ padding: '10px 24px' }}>
                                                            <select
                                                                value={user.roleId}
                                                                onChange={(e) => handleRoleUpdate(user.userId, parseInt(e.target.value))}
                                                                style={{ padding: '4px 8px' }}
                                                            >
                                                                {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                                                            </select>
                                                        </td>
                                                        <td style={{ padding: '10px 24px' }}>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button 
                                                                    onClick={() => openModal('edit_user', 'Edit User', { 
                                                                        userId: user.userId, 
                                                                        username: user.username, 
                                                                        email: user.email 
                                                                    })} 
                                                                    style={{ color: 'var(--text-muted)', background: 'none' }}
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button onClick={() => handleDelete('user', user.userId)} style={{ color: 'var(--danger)', background: 'none' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {activeTab === 'categories' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Active Stock Categories</h3>
                                            <button
                                                onClick={() => openModal('add_category', 'New Category', { name: '' })}
                                                style={{ background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Plus size={16} /> Add Category
                                            </button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                            {categories.map(cat => (
                                                <div key={cat.categoryId} className="glass-morphism" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <Tag size={16} className="text-primary" />
                                                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{cat.name}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => openModal('edit_category', 'Edit Category', cat)} style={{ color: 'var(--text-muted)', background: 'none' }}><Edit size={16} /></button>
                                                        <button onClick={() => handleDelete('category', cat.categoryId)} style={{ color: 'var(--danger)', background: 'none' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'currencies' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>System Currencies</h3>
                                            <button
                                                onClick={() => openModal('add_currency', 'Add New Currency', { symbol: '', code: '', name: '', isDefault: false })}
                                                style={{ background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Plus size={16} /> Add Currency
                                            </button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                            {currencies.map(curr => (
                                                <div key={curr.currencyId} className="glass-morphism" style={{
                                                    padding: '24px',
                                                    border: curr.isDefault ? '1px solid var(--primary)' : '1px solid var(--border)',
                                                    background: curr.isDefault ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                        <div style={{ fontSize: '20px', fontWeight: '800' }}>{curr.symbol} {curr.code}</div>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => openModal('edit_currency', 'Edit Currency', curr)} style={{ color: 'var(--text-muted)', background: 'none' }}><Edit size={16} /></button>
                                                            {!curr.isDefault && <button onClick={() => handleDelete('currency', curr.currencyId)} style={{ color: 'var(--danger)', background: 'none' }}><Trash2 size={16} /></button>}
                                                        </div>
                                                    </div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>{curr.name}</div>
                                                    {curr.isDefault ? (
                                                        <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em' }}>PRIMARY SYSTEM CURRENCY</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleSetDefaultCurrency(curr.currencyId)}
                                                            style={{ fontSize: '12px', padding: '6px 12px', background: 'var(--primary)', color: 'white', borderRadius: '6px' }}>
                                                            Set as Primary
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Modal isOpen={modalConfig.isOpen} onClose={closeModal} title={modalConfig.title}>
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(modalConfig.type === 'create_user' || modalConfig.type === 'edit_user') && (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Username</label>
                                <input
                                    type="text"
                                    required
                                    value={modalConfig.data.username || ''}
                                    onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, username: e.target.value } })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={modalConfig.data.email || ''}
                                    onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, email: e.target.value } })}
                                />
                            </div>
                            {modalConfig.type === 'create_user' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={modalConfig.data.password || ''}
                                        onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, password: e.target.value } })}
                                    />
                                </div>
                            )}
                            {modalConfig.type === 'create_user' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Initial Role</label>
                                    <select
                                        value={modalConfig.data.roleId || ''}
                                        onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, roleId: parseInt(e.target.value) } })}
                                    >
                                        {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {(modalConfig.type === 'add_category' || modalConfig.type === 'edit_category') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Category Name</label>
                            <input
                                type="text"
                                value={modalConfig.data.name || ''}
                                required
                                onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, name: e.target.value } })}
                            />
                        </div>
                    )}

                    {(modalConfig.type === 'add_currency' || modalConfig.type === 'edit_currency') && (
                        <>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Symbol (e.g. $)</label>
                                    <input
                                        type="text"
                                        value={modalConfig.data.symbol || ''}
                                        required
                                        onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, symbol: e.target.value } })}
                                    />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Code (e.g. USD)</label>
                                    <input
                                        type="text"
                                        value={modalConfig.data.code || ''}
                                        required
                                        onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, code: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Currency Name</label>
                                <input
                                    type="text"
                                    value={modalConfig.data.name || ''}
                                    required
                                    onChange={e => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, name: e.target.value } })}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
                        <Save size={16} /> Save Changes
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ManagementPage;
