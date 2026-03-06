import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Award, CheckCircle, CalendarDays, TrendingUp, Calendar, Hash } from 'lucide-react';
import styles from './StudentReports.module.css';

const StudentReports = ({ theme }) => {
    // ── MOCK DATA ──
    const summaryStats = {
        totalRegistered: 12,
        eventsAttended: 8,
        certificatesEarned: 5,
    };

    const monthlyData = [
        { name: 'Sep', events: 1 },
        { name: 'Oct', events: 3 },
        { name: 'Nov', events: 2 },
        { name: 'Dec', events: 0 },
        { name: 'Jan', events: 4 },
        { name: 'Feb', events: 5 },
        { name: 'Mar', events: 2 },
    ];

    const categoryData = [
        { name: 'Hackathon', value: 4 },
        { name: 'Workshop', value: 5 },
        { name: 'Seminar', value: 2 },
        { name: 'Cultural', value: 1 },
    ];

    const recentParticipation = [
        { id: 'ev1', name: 'Spring AI Hackathon', date: 'Feb 15, 2026', status: 'Completed', certificate: 'Available' },
        { id: 'ev2', name: 'React Development Workshop', date: 'Feb 28, 2026', status: 'Completed', certificate: 'Available' },
        { id: 'ev3', name: 'Future of Tech Seminar', date: 'Mar 08, 2026', status: 'Registered', certificate: 'Pending' },
        { id: 'ev4', name: 'Cloud Computing Fundamentals', date: 'Mar 15, 2026', status: 'Registered', certificate: 'Pending' },
        { id: 'ev5', name: 'Winter Coding Bootcamp', date: 'Jan 10, 2026', status: 'Completed', certificate: 'Available' },
    ];

    // Colors for charts mapping to the theme
    const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];

    // Custom Tooltip for Bar Chart explicitly styled for SaaS dark/light mode
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.chartTooltip}>
                    <p className={styles.tooltipLabel}>{label}</p>
                    <p className={styles.tooltipValue}>
                        <span className={styles.tooltipDot} style={{ background: payload[0].fill }}></span>
                        Events: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.reportsContainer}>
            {/* ── Header ── */}
            <div className={styles.headerArea}>
                <div className={styles.titleWrapper}>
                    <div className={styles.titleIcon}>
                        <TrendingUp size={28} />
                    </div>
                    <h1 className={styles.pageTitle}>My Participation Reports</h1>
                </div>
                <p className={styles.pageSubtitle}>Track your event registrations, attendance, and achievements.</p>
            </div>

            {/* ── Summary Stats ── */}
            <div className={styles.statsGrid}>

                {/* Stat Card 1 */}
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}>
                        <CalendarDays size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Total Registered</p>
                        <h3 className={styles.statValue}>{summaryStats.totalRegistered}</h3>
                    </div>
                    <div className={styles.sparkline}></div>
                </div>

                {/* Stat Card 2 */}
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Events Attended</p>
                        <h3 className={styles.statValue}>{summaryStats.eventsAttended}</h3>
                    </div>
                    <div className={styles.sparkline}></div>
                </div>

                {/* Stat Card 3 (Emphasized) */}
                <div className={`${styles.statCard} ${styles.emphasizedCard}`}>
                    <div className={styles.statIconWrapper} style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.15)' }}>
                        <Award size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Certificates Earned</p>
                        <h3 className={styles.statValue}>{summaryStats.certificatesEarned}</h3>
                    </div>
                    <div className={styles.sparklineActive}></div>
                </div>

            </div>

            {/* ── Charts Section ── */}
            <div className={styles.chartsGrid}>

                {/* Bar Chart: Monthly Participation */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3>Monthly Participation</h3>
                        <span className={styles.chartBadge}>Current Academic Year</span>
                    </div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                />
                                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--treg-glass-bg)' }} />
                                <Bar
                                    dataKey="events"
                                    fill="var(--treg-primary)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Category Distribution */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3>Category Distribution</h3>
                    </div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value, entry) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* ── Recent Participation Table ── */}
            <div className={styles.tableCard}>
                <div className={styles.cardHeader}>
                    <h3>Recent Participation</h3>
                    <button className={styles.viewAllBtn}>View All</button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th><Hash size={14} /> Event Name</th>
                                <th><Calendar size={14} /> Date</th>
                                <th>Status</th>
                                <th>Certificate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentParticipation.map((row) => (
                                <tr key={row.id}>
                                    <td className={styles.boldCell}>{row.name}</td>
                                    <td className={styles.dateCell}>{row.date}</td>
                                    <td>
                                        <span className={`${styles.statusPill} ${row.status === 'Completed' ? styles.statusCompleted : styles.statusRegistered}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.certPill} ${row.certificate === 'Available' ? styles.certAvailable : styles.certPending}`}>
                                            {row.certificate === 'Available' ? <Award size={12} /> : null}
                                            {row.certificate}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default StudentReports;
