import React, { useEffect, useState, useMemo } from 'react';
import { itemService, adminService, systemService } from '../services/api';
import Sidebar from '../components/Sidebar';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import {
    Package,
    Box,
    DollarSign,
    TrendingUp,
    PieChart as PieIcon
} from 'lucide-react';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [analytics, setAnalytics] = useState({ timeline: [], categoryBreakdown: [] });
    const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
        fetchAnalytics();
        fetchCurrency();
    }, [period]);

    const fetchCurrency = async () => {
        try {
            const data = await systemService.getDefaultCurrency();
            setCurrency(data);
        } catch (err) {
            console.error('Failed to fetch currency', err);
            // Fallback to default USD
            setCurrency({ symbol: '$', code: 'USD' });
        }
    };

    const fetchAnalytics = async () => {
        try {
            const data = await systemService.getAnalytics(period);
            setAnalytics(data);
        } catch (err) {
            console.error('Failed to fetch analytics', err);
            // Set empty analytics to prevent crashes
            setAnalytics({ timeline: [], categoryBreakdown: [] });
        }
    };

    const fetchItems = async () => {
        try {
            const data = await itemService.getAll();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items', err);
            // Set empty items array to prevent crashes
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num, decimals = 0) => {
        return new Intl.NumberFormat(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num || 0);
    };

    const totalStockValue = useMemo(() =>
        items.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.quantity || 0)), 0),
        [items]);

    const stats = useMemo(() => [
        { label: 'Total Items', value: formatNumber(items.length), icon: <Package size={20} />, color: '#6366f1' },
        { label: 'Stock Value', value: `${currency.symbol}${formatNumber(totalStockValue, 2)}`, icon: <DollarSign size={20} />, color: '#10b981' },
        { label: 'Low Stock', value: formatNumber(items.filter(i => i.quantity < 5).length), icon: <Box size={20} />, color: '#f59e0b' },
    ], [items, currency, totalStockValue]);

    const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', display: 'flex', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, padding: '16px', marginLeft: '272px', overflowY: 'auto', paddingTop: '48px', height: '100vh' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-morphism" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: `${stat.color}15`, color: stat.color, padding: '12px', borderRadius: '10px' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    {/* Analytics Chart */}
                    <div className="glass-morphism" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <TrendingUp className="gradient-text" size={20} />
                                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Inventory Trends</h3>
                            </div>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                style={{ padding: '4px 8px', borderRadius: '6px' }}
                            >
                                <option value="7d">7 Days</option>
                                <option value="30d">30 Days</option>
                                <option value="90d">90 Days</option>
                            </select>
                        </div>

                        <div style={{ height: '240px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.timeline || []}>
                                    <defs>
                                        <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="totalQuantity" stroke="#6366f1" fillOpacity={1} fill="url(#colorQty)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="glass-morphism" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <PieIcon className="text-primary" size={20} />
                            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Stock by Category</h3>
                        </div>

                        <div style={{ height: '240px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.categoryBreakdown || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="categoryName" type="category" stroke="#94a3b8" fontSize={10} width={80} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        formatter={(value) => `${currency.symbol}${formatNumber(value, 2)}`}
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {(analytics?.categoryBreakdown || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
