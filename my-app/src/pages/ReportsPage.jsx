import React, { useState, useMemo, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Users, Calendar, CheckCircle,
    Download, FileText, Search, ArrowUpRight,
    BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import './ReportsPage.css';

const ReportsPage = ({ theme, events = [], registrations = [] }) => {
    const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(theme);
    const [selectedRange, setSelectedRange] = useState('This Year');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeChartFilter, setActiveChartFilter] = useState(null); // { type: 'category', value: 'Technical' } or { type: 'date', value: '2024-03-01' }
    const [isLoading, setIsLoading] = useState(false);

    // Simulate loading on filter change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [selectedRange]);

    // 📊 CALCULATE ANALYTICS FROM REAL DATA
    const analyticsData = useMemo(() => {
        const now = new Date();

        // Helper to check if date is within range or previous period
        const getRangeStatus = (dateStr) => {
            if (!dateStr) return { current: false, previous: false };
            const cleanedDate = dateStr.includes('·') ? dateStr.split('·')[0] : dateStr;
            const date = new Date(cleanedDate);
            if (isNaN(date)) return { current: false, previous: false };

            if (selectedRange === 'All Time') return { current: true, previous: false };

            let currentStart = new Date();
            let previousStart = new Date();

            if (selectedRange === 'Last 30 Days' || selectedRange === '1month') {
                currentStart.setDate(now.getDate() - 30);
                previousStart.setDate(currentStart.getDate() - 30);
            } else if (selectedRange === 'Last 3 Months') {
                currentStart.setMonth(now.getMonth() - 3);
                previousStart.setMonth(currentStart.getMonth() - 3);
            } else if (selectedRange === 'This Year') {
                currentStart = new Date(now.getFullYear(), 0, 1);
                previousStart = new Date(now.getFullYear() - 1, 0, 1);
            }

            return {
                current: date >= currentStart,
                previous: date < currentStart && date >= previousStart
            };
        };

        const filteredEvents = events.filter(e => getRangeStatus(e.createdAt || e.date).current);
        const prevEvents = events.filter(e => getRangeStatus(e.createdAt || e.date).previous);

        const filteredRegistrations = registrations.filter(r => getRangeStatus(r.createdAt).current);
        const prevRegistrations = registrations.filter(r => getRangeStatus(r.createdAt).previous);

        const calcStats = (evts, regs) => {
            const totalRegs = regs.length;
            const approved = regs.filter(r => r.status === 'approved').length;
            const eventCount = evts.length;

            // Fill rate logic: (Total Regs / (Total Events * Avg Capacity)) * 100
            const fillRate = eventCount > 0 ? Math.min(100, Math.round((totalRegs / (eventCount * 50)) * 100)) : 0;

            return {
                totalEvents: eventCount,
                totalRegistrations: totalRegs,
                approvedRegistrations: approved,
                averageFillRate: fillRate
            };
        };

        const stats = calcStats(filteredEvents, filteredRegistrations);
        const prevStats = calcStats(prevEvents, prevRegistrations);

        const calcGrowth = (curr, prev) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return Math.round(((curr - prev) / prev) * 100);
        };

        const growth = {
            events: calcGrowth(stats.totalEvents, prevStats.totalEvents),
            registrations: calcGrowth(stats.totalRegistrations, prevStats.totalRegistrations),
            approved: calcGrowth(stats.approvedRegistrations, prevStats.approvedRegistrations),
            fillRate: calcGrowth(stats.averageFillRate, prevStats.averageFillRate)
        };

        // Helper for dynamic aggregation
        const getAggregatedData = (items, dateGetter) => {
            const dataMap = {};
            const now = new Date();

            // Determine grouping type
            let type = 'month';
            let count = 12;
            if (selectedRange === 'Last 30 Days' || selectedRange === '1month') {
                type = 'day';
                count = 30;
            } else if (selectedRange === 'Last 3 Months') {
                type = 'month';
                count = 3;
            } else if (selectedRange === 'All Time') {
                type = 'year';
                count = 5; // Show last 5 years
            }

            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Initialize data points (avoid gaps)
            for (let i = count - 1; i >= 0; i--) {
                let label = '';
                let key = '';
                const d = new Date();

                if (type === 'day') {
                    d.setDate(now.getDate() - i);
                    label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                    key = d.toISOString().split('T')[0];
                } else if (type === 'month') {
                    d.setMonth(now.getMonth() - i);
                    label = monthNames[d.getMonth()];
                    key = `${d.getFullYear()}-${d.getMonth()}`;
                } else {
                    d.setFullYear(now.getFullYear() - i);
                    label = d.getFullYear().toString();
                    key = label;
                }

                dataMap[key] = { label, events: 0, registrations: 0, sortKey: d.getTime() };
            }

            // Group events
            items.events.forEach(item => {
                const dateStr = item.date || item.createdAt;
                if (!dateStr) return;
                const cleanedDate = dateStr.includes('·') ? dateStr.split('·')[0] : dateStr;
                const d = new Date(cleanedDate);
                if (isNaN(d)) return;

                let key = '';
                if (type === 'day') key = d.toISOString().split('T')[0];
                else if (type === 'month') key = `${d.getFullYear()}-${d.getMonth()}`;
                else key = d.getFullYear().toString();

                if (dataMap[key]) dataMap[key].events++;
            });

            // Group registrations
            items.registrations.forEach(item => {
                if (!item.createdAt) return;
                const d = new Date(item.createdAt);
                if (isNaN(d)) return;

                let key = '';
                if (type === 'day') key = d.toISOString().split('T')[0];
                else if (type === 'month') key = `${d.getFullYear()}-${d.getMonth()}`;
                else key = d.getFullYear().toString();

                if (dataMap[key]) dataMap[key].registrations++;
            });

            return Object.values(dataMap)
                .sort((a, b) => a.sortKey - b.sortKey)
                .map(d => ({ label: d.label, events: d.events, registrations: d.registrations }));
        };

        const chartData = getAggregatedData({ events: filteredEvents, registrations: filteredRegistrations });

        // Category Distribution
        const categories = ['Technical', 'Cultural', 'Workshop', 'Sports', 'Other'];
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat] = 0;
            return acc;
        }, {});

        filteredEvents.forEach(event => {
            const eventCat = event.category || 'Other';
            const matchedCat = categories.find(c =>
                c.toLowerCase() === eventCat.toLowerCase() ||
                (c === 'Technical' && eventCat === 'Tech')
            ) || 'Other';

            categoryMap[matchedCat]++;
        });

        const categoryData = categories.map(name => ({
            name,
            value: categoryMap[name]
        })).filter(item => item.value > 0);

        const finalCategoryData = categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 0 }];

        // Event Performance Data (All events matching search)
        const performanceData = filteredEvents.map(event => {
            const eventRegs = registrations.filter(r => {
                const regEventId = r.event?._id || r.event;
                const eventId = event._id || event.id;
                return regEventId === eventId;
            });

            const approvedRegs = eventRegs.filter(r => r.status === 'approved').length;

            return {
                id: event._id || event.id,
                title: event.title || 'Untitled Event',
                date: event.date || 'TBD',
                category: event.category || 'Other',
                status: event.status || 'draft',
                registrations: eventRegs.length,
                approved: approvedRegs,
                conversion: eventRegs.length > 0
                    ? Math.round((approvedRegs / eventRegs.length) * 100)
                    : 0
            };
        });

        // Identify Top 3 Performing Events
        const topEvents = performanceData.length > 0
            ? [...performanceData].sort((a, b) => b.registrations - a.registrations).slice(0, 3)
            : [];

        return { stats, growth, chartData, categoryData: finalCategoryData, performanceData, topEvents };
    }, [events, registrations, selectedRange]);

    const filteredPerformance = analyticsData.performanceData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

        if (!activeChartFilter) return matchesSearch;

        if (activeChartFilter.type === 'category') {
            return matchesSearch && item.category.toLowerCase() === activeChartFilter.value.toLowerCase();
        }

        if (activeChartFilter.type === 'date') {
            const eventDate = new Date(item.date);
            const filterDate = activeChartFilter.value; // e.g. "Mar 01"
            const label = eventDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
            return matchesSearch && label === filterDate;
        }

        return matchesSearch;
    });

    const categoryColors = {
        'Technical': '#2563EB',
        'Cultural': '#7C3AED',
        'Workshop': '#F59E0B',
        'Sports': '#10B981',
        'Other': '#64748B',
        'No Data': isDark ? '#334155' : '#E2E8F0'
    };

    const formatYAxis = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
        return value;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'var(--card-bg)',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow)',
                    color: 'var(--text-primary)'
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color || 'var(--text-primary)', fontSize: '13px' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`reports-container ${isDark ? 'dark-mode' : ''}`}>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="reports-header" data-aos="fade-down">
                <div className="header-title">
                    <h1>Reports & Analytics</h1>
                    <p>Track your event performance and registration trends.</p>
                </div>
                <div className="header-actions">
                    <select
                        className="filter-select"
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                    >
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="Last 3 Months">Last 3 Months</option>
                        <option value="This Year">This Year</option>
                        <option value="All Time">All Time</option>
                    </select>
                    <div className="export-dropdown">
                        <button className="export-btn btn-pdf">
                            <Download size={18} /> Export <ArrowUpRight size={14} />
                        </button>
                        <div className="export-menu">
                            <button onClick={() => alert('Exporting PDF...')}>PDF Document</button>
                            <button onClick={() => alert('Exporting Excel...')}>Excel Spreadsheet</button>
                            <button onClick={() => alert('Exporting CSV...')}>CSV Data</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
                {[
                    { label: 'Total Events', val: analyticsData.stats.totalEvents, growth: analyticsData.growth.events, icon: BarChart3, color: '#3B82F6' },
                    { label: 'Total Registrations', val: analyticsData.stats.totalRegistrations, growth: analyticsData.growth.registrations, icon: Users, color: '#8B5CF6' },
                    { label: 'Approved Tickets', val: analyticsData.stats.approvedRegistrations, growth: analyticsData.growth.approved, icon: CheckCircle, color: '#10B981' },
                    { label: 'Avg. Fill Rate', val: `${analyticsData.stats.averageFillRate}%`, growth: analyticsData.growth.fillRate, icon: TrendingUp, color: '#F59E0B' }
                ].map((stat, i) => (
                    <div key={i} className="stat-card" data-aos="zoom-in" data-aos-delay={100 * (i + 1)}>
                        <div className="stat-info">
                            <p className="stat-label">{stat.label}</p>
                            <h3>{stat.val}</h3>
                            <div className={`growth-indicator ${stat.growth >= 0 ? 'positive' : 'negative'}`}>
                                {stat.growth >= 0 ? '↑' : '↓'} {Math.abs(stat.growth)}%
                                <span>vs last period</span>
                            </div>
                        </div>
                        <div className="stat-icon" style={{ background: stat.color }}>
                            <stat.icon size={22} color="white" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Performers Grid */}
            {analyticsData.topEvents.length > 0 && (
                <div className="top-performers-section" data-aos="fade-up">
                    <div className="section-header">
                        <h2>Top Performing Events</h2>
                        <TrendingUp size={20} color="var(--primary)" />
                    </div>
                    <div className="top-performers-grid">
                        {analyticsData.topEvents.map((event, idx) => (
                            <div key={event.id || idx} className="top-performer-card showcase">
                                <div className="card-rank">#{idx + 1}</div>
                                <div className="top-performer-content">
                                    <div className="badge">{idx === 0 ? 'Best This Period' : 'Top Performer'}</div>
                                    <div className="details">
                                        <p>Event Title</p>
                                        <h3>{event.title}</h3>
                                    </div>
                                    <div className="metrics">
                                        <div className="metric">
                                            <span>Registrations</span>
                                            <strong>{event.registrations}</strong>
                                        </div>
                                        <div className="metric">
                                            <span>Conversion</span>
                                            <strong>{event.conversion}%</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="top-performer-action">
                                    <button onClick={() => setSearchTerm(event.title)}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Charts */}
            <div className="charts-grid">
                <div className="chart-container full-width" data-aos="fade-up">
                    <h2>Registered Events</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        {analyticsData.stats.totalRegistrations > 0 ? (
                            <ResponsiveContainer>
                                <BarChart
                                    data={analyticsData.chartData}
                                    onClick={(data) => {
                                        if (data && data.activePayload) {
                                            setActiveChartFilter({ type: 'date', value: data.activeLabel });
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'var(--border-subtle)' : '#E2E8F0'} opacity={0.6} />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}
                                        allowDecimals={false}
                                        tickFormatter={formatYAxis}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="registrations" name="Registrations" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart-msg">
                                <Users size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <p>No registration data yet</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-container" data-aos="fade-right">
                    <h2>Events by Category</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        {analyticsData.stats.totalEvents > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={analyticsData.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setActiveChartFilter({ type: 'category', value: data.name });
                                            }
                                        }}
                                    >
                                        {analyticsData.categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={categoryColors[entry.name] || categoryColors['Other']}
                                                style={{ cursor: 'pointer', outline: 'none' }}
                                            />
                                        ))}
                                    </Pie>
                                    <text
                                        x="50%"
                                        y="48%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="pie-center-text"
                                        fill="var(--text-main)"
                                        style={{ fontSize: '24px', fontWeight: '800' }}
                                    >
                                        {analyticsData.stats.totalEvents}
                                    </text>
                                    <text
                                        x="50%"
                                        y="58%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="var(--text-muted)"
                                        style={{ fontSize: '12px', fontWeight: '600' }}
                                    >
                                        EVENTS
                                    </text>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart-msg">
                                <PieChartIcon size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <p>No events found</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-container" data-aos="fade-left">
                    <h2>Event Distribution</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        {analyticsData.stats.totalEvents > 0 ? (
                            <ResponsiveContainer>
                                <BarChart
                                    data={analyticsData.chartData}
                                    onClick={(data) => {
                                        if (data && data.activePayload) {
                                            setActiveChartFilter({ type: 'date', value: data.activeLabel });
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'var(--border-subtle)' : '#E2E8F0'} opacity={0.6} />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}
                                        allowDecimals={false}
                                        tickFormatter={formatYAxis}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="events" name="Events" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart-msg">
                                <BarChart3 size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <p>No events found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Event Performance Table */}
            <div className="performance-section" data-aos="fade-up">
                <div className="table-header">
                    <div className="table-header-title">
                        <h2>Event Performance Table</h2>
                        {activeChartFilter && (
                            <button className="clear-filter-badge" onClick={() => setActiveChartFilter(null)}>
                                Showing {activeChartFilter.value} ×
                            </button>
                        )}
                    </div>
                    <div className="search-box">
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            className="search-input"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    {filteredPerformance.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Event Title</th>
                                    <th>Event Date</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Total Reg.</th>
                                    <th>Approved</th>
                                    <th>Conv. Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPerformance.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td style={{ fontWeight: 600 }}>{item.title}</td>
                                        <td style={{ fontSize: '13px' }}>{item.date}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <span className={`badge badge-${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.registrations}</td>
                                        <td>{item.approved}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    flex: 1,
                                                    height: '6px',
                                                    backgroundColor: isDark ? '#334155' : '#E2E8F0',
                                                    borderRadius: '3px',
                                                    width: '60px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${item.conversion}%`,
                                                        backgroundColor: item.conversion > 70 ? 'var(--success)' : item.conversion > 30 ? 'var(--primary)' : 'var(--warning)'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.conversion}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <p>No events found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
