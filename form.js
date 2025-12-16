import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingContext } from '../contexts/BookingContext';
import BookingForm from '../components/BookingForm';

// Mock context
const mockSubmitBooking = jest.fn();
const mockContextValue = {
  submitBooking: mockSubmitBooking,
  bookings: [],
  currentBooking: null
};

// Mock API
jest.mock('../utils/API', () => ({
  submitAPI: jest.fn(() => Promise.resolve(true))
}));

describe('BookingForm', () => {
  const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00'];
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BookingContext.Provider value={mockContextValue}>
        <BookingForm 
          availableTimes={mockAvailableTimes}
          dispatchOnDateChange={mockDispatch}
        />
      </BookingContext.Provider>
    );
  };

  test('renders all form fields', () => {
    renderComponent();
    
    expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /make reservation/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /make reservation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /make reservation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('validates guest count', async () => {
    renderComponent();
    
    const guestsInput = screen.getByLabelText(/number of guests/i);
    fireEvent.change(guestsInput, { target: { value: '0' } });
    
    const submitButton = screen.getByRole('button', { name: /make reservation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/at least 1 guest is required/i)).toBeInTheDocument();
    });
    
    fireEvent.change(guestsInput, { target: { value: '15' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/maximum 10 guests per reservation/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    renderComponent();
    
    // Fill in valid data
    const dateInput = screen.getByLabelText(/choose date/i);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(dateInput, { target: { value: tomorrowString } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '4' } });
    
    const submitButton = screen.getByRole('button', { name: /make reservation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmitBooking).toHaveBeenCalled();
    });
  });
});
