import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  const submitBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      bookingRef: `LL-${Date.now().toString().slice(-6)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
    setCurrentBooking(newBooking);
    
    // In a real app, you would save to localStorage or backend
    localStorage.setItem('littleLemonBookings', JSON.stringify([...bookings, newBooking]));
    
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    if (currentBooking?.id === bookingId) {
      setCurrentBooking(null);
    }
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      currentBooking,
      submitBooking,
      cancelBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within BookingProvider');
  }
  return context;
};

export { BookingContext };
