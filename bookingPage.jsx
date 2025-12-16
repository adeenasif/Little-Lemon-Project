import React, { useReducer } from 'react';
import BookingForm from './BookingForm';
import { fetchAPI, submitAPI } from '../utils/API';
import { initializeTimes, updateTimes } from '../utils/times';

const BookingPage = () => {
  const [availableTimes, dispatch] = useReducer(updateTimes, [], initializeTimes);

  const handleDateChange = (date) => {
    dispatch({ type: 'UPDATE_TIMES', date });
  };

  return (
    <main className="booking-page" role="main">
      <section className="booking-hero">
        <div className="container">
          <h1>Reserve Your Table</h1>
          <p className="lead">
            Experience the finest Mediterranean cuisine at Little Lemon. 
            Book your table below.
          </p>
        </div>
      </section>

      <section className="booking-content">
        <div className="container">
          <div className="booking-grid">
            <div className="booking-info">
              <article>
                <header>
                  <h2>Restaurant Information</h2>
                </header>
                <ul className="restaurant-details">
                  <li>
                    <strong>Location:</strong> 123 Lemon Street, Chicago, IL 60601
                  </li>
                  <li>
                    <strong>Hours:</strong> 
                    <ul>
                      <li>Monday - Thursday: 11:00 AM - 10:00 PM</li>
                      <li>Friday - Saturday: 11:00 AM - 11:00 PM</li>
                      <li>Sunday: 10:00 AM - 9:00 PM</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Contact:</strong> (312) 555-LEMON
                  </li>
                  <li>
                    <strong>Capacity:</strong> Up to 10 guests per reservation
                  </li>
                </ul>
              </article>

              <aside className="booking-tips" role="complementary">
                <h3>Booking Tips</h3>
                <ul>
                  <li>Reservations are held for 15 minutes past the booking time</li>
                  <li>Please notify us of any allergies in the special requests</li>
                  <li>Weekend evenings book quickly - reserve early!</li>
                  <li>Cancellations must be made 24 hours in advance</li>
                </ul>
              </aside>
            </div>

            <div className="booking-form-container">
              <BookingForm 
                availableTimes={availableTimes}
                dispatchOnDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
