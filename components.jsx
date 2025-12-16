import React, { useState, useContext } from 'react';
import { BookingContext } from '../contexts/BookingContext';
import { validateBookingForm } from '../utils/validate';
import { submitAPI } from '../utils/API';

const BookingForm = ({ availableTimes, dispatchOnDateChange }) => {
  const { submitBooking } = useContext(BookingContext);
  
  const [formData, setFormData] = useState({
    date: '',
    time: availableTimes[0] || '17:00',
    guests: 2,
    occasion: 'Birthday',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const occasions = ['Birthday', 'Anniversary', 'Engagement', 'Business', 'Other'];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      dispatchOnDateChange(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateBookingForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API submission
      const success = await submitAPI(formData);
      
      if (success) {
        submitBooking(formData);
        // Navigate programmatically (handle in parent)
        window.location.href = '/confirmed';
      } else {
        setErrors({ submit: 'Failed to submit booking. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <form 
      className="booking-form" 
      onSubmit={handleSubmit}
      aria-labelledby="booking-form-title"
      noValidate
    >
      <h2 id="booking-form-title" className="visually-hidden">Make a Reservation</h2>
      
      {/* Date Field */}
      <div className="form-group">
        <label htmlFor="date" className="required">
          Choose Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          min={minDate}
          max={maxDate}
          required
          aria-required="true"
          aria-describedby={errors.date ? 'date-error' : undefined}
          className={errors.date ? 'error' : ''}
        />
        {errors.date && (
          <span id="date-error" className="error-message" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      {/* Time Field */}
      <div className="form-group">
        <label htmlFor="time" className="required">
          Choose Time
        </label>
        <select
          id="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
          aria-required="true"
          aria-describedby={errors.time ? 'time-error' : undefined}
          className={errors.time ? 'error' : ''}
        >
          {availableTimes.map(time => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {errors.time && (
          <span id="time-error" className="error-message" role="alert">
            {errors.time}
          </span>
        )}
      </div>

      {/* Number of Guests */}
      <div className="form-group">
        <label htmlFor="guests" className="required">
          Number of Guests
        </label>
        <input
          type="number"
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={handleInputChange}
          min="1"
          max="10"
          required
          aria-required="true"
          aria-describedby={errors.guests ? 'guests-error' : undefined}
          className={errors.guests ? 'error' : ''}
        />
        {errors.guests && (
          <span id="guests-error" className="error-message" role="alert">
            {errors.guests}
          </span>
        )}
      </div>

      {/* Occasion */}
      <div className="form-group">
        <label htmlFor="occasion">
          Occasion (Optional)
        </label>
        <select
          id="occasion"
          name="occasion"
          value={formData.occasion}
          onChange={handleInputChange}
        >
          {occasions.map(occasion => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
      </div>

      {/* Contact Information */}
      <fieldset className="contact-section">
        <legend>Contact Information</legend>
        
        <div className="name-group">
          <div className="form-group">
            <label htmlFor="firstName" className="required">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && (
              <span id="firstName-error" className="error-message" role="alert">
                {errors.firstName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="required">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && (
              <span id="lastName-error" className="error-message" role="alert">
                {errors.lastName}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="required">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && (
            <span id="phone-error" className="error-message" role="alert">
              {errors.phone}
            </span>
          )}
        </div>
      </fieldset>

      {/* Special Requests */}
      <div className="form-group">
        <label htmlFor="specialRequests">
          Special Requests (Optional)
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          rows="4"
          placeholder="Any dietary restrictions, allergies, or special accommodations..."
          aria-describedby={errors.specialRequests ? 'requests-error' : undefined}
          className={errors.specialRequests ? 'error' : ''}
        />
        {errors.specialRequests && (
          <span id="requests-error" className="error-message" role="alert">
            {errors.specialRequests}
          </span>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="submit-error" role="alert">
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Make Reservation'}
      </button>

      {/* Accessibility Notice */}
      <div className="accessibility-notice" role="note">
        <p>
          <small>
            All required fields are marked with "<span className="required-marker">*</span>".
            We'll send a confirmation email to the address provided.
          </small>
        </p>
      </div>
    </form>
  );
};

export default BookingForm;
