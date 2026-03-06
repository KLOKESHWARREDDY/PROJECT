import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import styles from './Calendar.module.css';

const Calendar = ({ allEvents = [], theme }) => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        try {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            if (isNaN(d1) || isNaN(d2)) return false;

            return d1.getDate() === d2.getDate() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getFullYear() === d2.getFullYear();
        } catch (e) {
            return false;
        }
    };

    const getEventsForDate = (date) => {
        return allEvents.filter(event => isSameDay(event.date, date));
    };

    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return allEvents
            .filter(e => {
                const d = new Date(e.date);
                return !isNaN(d) && d >= now;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5); // Show top 5
    }, [allEvents]);

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysCount = daysInMonth(month, year);
        const firstDay = firstDayOfMonth(month, year);

        const days = [];
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Headers
        weekdays.forEach(day => {
            days.push(
                <div key={`header-${day}`} className={styles.dayHeader}>
                    {day}
                </div>
            );
        });

        // Empty padding days
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={`${styles.dayCell} ${styles.emptyDay}`}></div>);
        }

        // Actual days
        const today = new Date();
        for (let i = 1; i <= daysCount; i++) {
            const date = new Date(year, month, i);
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            const dayEvents = getEventsForDate(date);
            const hasEvents = dayEvents.length > 0;

            days.push(
                <div
                    key={`day-${i}`}
                    className={`${styles.dayCell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''} ${hasEvents ? styles.hasEvents : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className={styles.dateNumber}>{i}</span>
                    {hasEvents && (
                        <div className={styles.eventIndicators}>
                            {dayEvents.slice(0, 3).map((e, idx) => (
                                <span key={idx} className={styles.indicatorDot} title={e.title}></span>
                            ))}
                            {dayEvents.length > 3 && <span className={styles.indicatorPlus}>+</span>}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    const selectedDayEvents = getEventsForDate(selectedDate);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className={styles.calendarContainer}>
            <h1 className={styles.pageTitle}>Event Calendar</h1>

            <div className={styles.contentLayout}>
                {/* Left Side: Calendar Grid */}
                <div className={styles.calendarBox}>
                    <div className={styles.calendarHeader}>
                        <button className={styles.navBtn} onClick={handlePrevMonth}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className={styles.monthTitle}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button className={styles.navBtn} onClick={handleNextMonth}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className={styles.calendarGrid}>
                        {renderCalendarDays()}
                    </div>

                    {/* Selected Date Details */}
                    <div className={styles.selectedDateSection}>
                        <h3 className={styles.selectedDateTitle}>
                            Events on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </h3>

                        {selectedDayEvents.length > 0 ? (
                            <div className={styles.selectedEventsList}>
                                {selectedDayEvents.map(event => (
                                    <div key={event._id || event.id} className={styles.eventRow} onClick={() => navigate(`/events/${event._id || event.id}`)}>
                                        <div className={styles.eventTimeInfo}>
                                            <Clock size={14} />
                                            <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={styles.eventRowDetails}>
                                            <h4>{event.title}</h4>
                                            <p><MapPin size={12} /> {event.location || 'TBA'}</p>
                                        </div>
                                        <span className={styles.categoryPill}>{event.category || 'Event'}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noEventsState}>
                                <CalendarIcon size={32} />
                                <p>No events scheduled for this day.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Upcoming Events */}
                <div className={styles.upcomingSidebar}>
                    <div className={styles.upcomingHeader}>
                        <h3>Upcoming Events</h3>
                        <span className={styles.badge}>{upcomingEvents.length}</span>
                    </div>

                    <div className={styles.upcomingList}>
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map(event => (
                                <div
                                    key={`upcoming-${event._id || event.id}`}
                                    className={styles.upcomingCard}
                                    onClick={() => navigate(`/events/${event._id || event.id}`)}
                                >
                                    <div className={styles.upcomingIcon}>
                                        <CalendarIcon size={18} />
                                    </div>
                                    <div className={styles.upcomingContent}>
                                        <h4>{event.title}</h4>
                                        <p className={styles.upcomingDate}>
                                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <div className={styles.upcomingMeta}>
                                            <span className={styles.smallPill}><Tag size={10} /> {event.category || 'General'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyText}>No upcoming events found.</p>
                        )}

                        {upcomingEvents.length > 0 && (
                            <button
                                className={styles.viewAllBtn}
                                onClick={() => navigate('/events')}
                            >
                                View All Events
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
