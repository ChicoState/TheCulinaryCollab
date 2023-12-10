import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import RegisterPage from './RegisterPage';

// Mock Firebase methods
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn((props) => <div {...props} />),
  },
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use the actual implementation for other components
  useNavigate: jest.fn(),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders RegisterPage component', () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  test('handles user registration correctly', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Mock user input
    act(() => {
      fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
      fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'Test123' } });
    });

    // Mock isUsernameUnique to return true
    jest.spyOn(RegisterPage.prototype, 'isUsernameUnique').mockResolvedValue(true);

    // Mock successful registration
    jest.spyOn(RegisterPage.prototype, 'handleRegister').mockResolvedValueOnce();

    // Trigger registration
    act(() => {
      fireEvent.click(getByText('Register'));
    });

    // Wait for async operations to complete
    await waitFor(() => {
      expect(jest.spyOn(RegisterPage.prototype, 'handleRegister')).toHaveBeenCalled();
    });
  });

  // Add more test cases for edge cases, error handling, etc.
});
