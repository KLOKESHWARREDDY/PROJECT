import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MessageCircle, ChevronRight } from 'lucide-react';
import './MyCreatedEvents.css';

const MyCreatedEvents = () => {
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Draft', 'Published', 'Completed'];

    // Mock data for events
    const events = [
        {
            id: 1,
            title: 'Summer Tech Conference 2026',
            date: 'Aug 15, 2026',
            time: '09:00 AM',
            status: 'PUBLISHED',
            thumbnail: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?q=80&w=200&h=200&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'Marketing Workshop: Next Gen',
            date: 'Sept 10, 2026',
            time: '02:30 PM',
            status: 'DRAFT',
            thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=200&h=200&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'Global Leadership Summit',
            date: 'Oct 05, 2026',
            time: '10:00 AM',
            status: 'PUBLISHED',
            thumbnail: 'https://images.unsplash.com/photo-1475721027187-4024733924f3?q=80&w=200&h=200&auto=format&fit=crop'
        },
        {
            id: 4,
            title: 'Community Meetup & Networking',
            date: 'Nov 12, 2026',
            time: '06:00 PM',
            status: 'DRAFT',
            thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=200&h=200&auto=format&fit=crop'
        }
    ];

    const filteredEvents = activeTab === 'All'
        ? events
        : events.filter(event => event.status.toLowerCase() === activeTab.toLowerCase());

    return (
        <div className="mce-container">
            {/* Header Area */}
            <header className="mce-header">
                <button className="mce-back-btn" onClick={() => window.history.back()} aria-label="Go back">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="mce-title">My Created Events</h1>
            </header>

            {/* Filter Tabs */}
            <nav className="mce-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`mce-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            {/* Event List */}
            <div className="mce-list">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="mce-card">
                        {/* Left: Thumbnail */}
                        <div className="mce-card-left">
                            <img
                                src={event.thumbnail}
                                alt={event.title}
                                className="mce-thumbnail"
                            />
                        </div>

                        {/* Middle: Main Content */}
                        <div className="mce-card-middle">
                            <h2 className="mce-event-title">{event.title}</h2>
                            <div className="mce-event-meta">
                                <span className="mce-meta-item">
                                    <Calendar size={14} />
                                    {event.date}
                                </span>
                                <span className="mce-meta-item">
                                    <Clock size={14} />
                                    {event.time}
                                </span>
                            </div>
                        </div>

                        {/* Right: Status & Action */}
                        <div className="mce-card-right">
                            <span className={`mce-status ${event.status.toLowerCase()}`}>
                                {event.status}
                            </span>
                            <ChevronRight size={20} className="mce-chevron" />
                        </div>
                    </div>
                ))}

                {filteredEvents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        No events found for "{activeTab}" status.
                    </div>
                )}
            </div>

            {/* Floating Button */}
            <button className="mce-floating-btn" aria-label="Open chat">
                <MessageCircle size={24} />
            </button>
        </div>
    );
};

export default MyCreatedEvents;
