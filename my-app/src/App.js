import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import MyEvents from './pages/MyEvents';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function App() {
  // Shared data for Upcoming Events
  const [allEvents] = useState([
    {
      id: 1,
      title: "Tech Innovators Summit",
      date: "Mar 22 · 6:00 PM",
      location: "Main Auditorium, Block A",
      category: "Tech",
      image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?auto=format&fit=crop&w=800&q=80",
      bannerText: "TECHNOVATE 2026"
    },
    {
      id: 2,
      title: "Annual Cultural Night",
      date: "Mar 22 · 6:30 PM",
      location: "Open Air Theatre",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=800&q=80",
      bannerText: "CULTURAL FEST"
    }
  ]);

  // Shared data for Registered Events
  const [registeredList] = useState([
    { id: 101, name: "Spring Tech Symposium", date: "Mar 18, 2024", venue: "Main Campus Auditorium" },
    { id: 102, name: "Design Thinking Workshop", date: "Mar 22, 2024", venue: "Creative Arts Studio B" },
    { id: 103, name: "Annual Science Fair", date: "Apr 05, 2024", venue: "North Wing Exhibition Hall" }
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Dashboard 
            upcomingEvents={allEvents} 
            upcomingCount={allEvents.length} 
            regCount={registeredList.length} 
          />
        } />
        <Route path="/events" element={<Events events={allEvents} />} />
        <Route path="/my-events" element={<MyEvents events={registeredList} />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;