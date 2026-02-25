import React, { useEffect, useState, useMemo } from 'react';
import { itemService, systemService } from '../services/api';
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar';
import {
    Plus,
    Trash2,
    Edit,
    Search,
    Save,
    ChevronLeft,
    ChevronRight,
    Tag
} from 'lucide-react';

const InventoryPage = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', quantity: 0, price: 0, categoryId: '' });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        fetchItems();
        fetchCurrency();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await systemService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const fetchCurrency = async () => {
        try {
            const data = await systemService.getDefaultCurrency();
            setCurrency(data);
        } catch (err) {
            console.error('Failed to fetch currency', err);
        }
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await itemService.getAll();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await itemService.delete(id);
                setItems(items.filter(i => i.itemId !== id));
            } catch (err) {
                alert('Action failed: Requires Admin permissions');
            }
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                categoryId: item.categoryId || ''
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', description: '', quantity: 0, price: 0, categoryId: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                categoryId: formData.categoryId === '' ? null : parseInt(formData.categoryId)
            };

            if (editingItem) {
                await itemService.update(editingItem.itemId, { ...dataToSubmit, itemId: editingItem.itemId });
            } else {
                await itemService.create(dataToSubmit);
            }
            fetchItems();
            setIsModalOpen(false);
        } catch (err) {
            alert('Operation failed. Check permissions.');
        }
    };

    const filteredItems = useMemo(() => items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [items, searchTerm]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredItems, currentPage, itemsPerPage]);

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
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
                                <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Inventory</h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Track and manage your warehouse stock.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        style={{ paddingLeft: '32px', width: '220px', padding: '6px 32px' }}
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                                <button onClick={() => openModal()} className="glass-morphism" style={{
                                    padding: '8px 16px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'var(--primary)',
                                    borderRadius: '8px'
                                }}>
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10 }}>
                                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '12px 24px' }}>Item Details</th>
                                    <th style={{ padding: '12px 24px' }}>Category</th>
                                    <th style={{ padding: '12px 24px' }}>Qty</th>
                                    <th style={{ padding: '12px 24px' }}>Price</th>
                                    <th style={{ padding: '12px 24px' }}>Status</th>
                                    <th style={{ padding: '12px 24px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(item => (
                                    <tr key={item.itemId} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}>
                                        <td style={{ padding: '10px 24px' }}>
                                            <div style={{ fontWeight: '650' }}>{item.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                                        </td>
                                        <td style={{ padding: '10px 24px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                <Tag size={12} className="text-primary" />
                                                {item.categoryName || 'None'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 24px' }}>{formatNumber(item.quantity)}</td>
                                        <td style={{ padding: '10px 24px' }}>{currency.symbol}{formatNumber(item.price.toFixed(2))}</td>
                                        <td style={{ padding: '10px 24px' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                background: item.quantity < 5 ? '#ef444415' : '#10b98115',
                                                color: item.quantity < 5 ? '#ef4444' : '#10b981',
                                                border: `1px solid ${item.quantity < 5 ? '#ef444430' : '#10b98130'}`
                                            }}>
                                                {item.quantity < 5 ? 'LOW' : 'STOCKED'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 24px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => openModal(item)} style={{ color: 'var(--text-muted)', background: 'none' }}><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(item.itemId)} style={{ color: 'var(--danger)', background: 'none' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {loading && <div style={{ textAlign: 'center', padding: '24px', fontSize: '13px' }}>Loading...</div>}
                    </div>

                    {!loading && totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 24px',
                            borderTop: '1px solid var(--border)',
                            background: 'rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                Page {currentPage} of {totalPages} ({formatNumber(filteredItems.length)} items)
                            </div>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ padding: '6px', borderRadius: '6px', background: 'var(--bg-card)', opacity: currentPage === 1 ? 0.3 : 1 }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '6px', borderRadius: '6px', background: 'var(--bg-card)', opacity: currentPage === totalPages ? 0.3 : 1 }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Item' : 'New Item'}
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Category</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="">None</option>
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quantity</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '8px'
                    }}>
                        <Save size={16} /> {editingItem ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default InventoryPage;
