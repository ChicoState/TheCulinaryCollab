import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';  // Import MemoryRouter
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';

// Mock the image import
jest.mock('./Champagne.jpg', () => 'mocked-image-path');

test('renders Login page', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
  const emailInput = screen.getByPlaceholderText('Email/Username');
  const passwordInput = screen.getByPlaceholderText('Password');
  const loginButton = screen.getByText('Login');
  const createAccountButton = screen.getByText('Create Account');

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  expect(createAccountButton).toBeInTheDocument();
});

test('updates email and password state on input change', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
  const emailInput = screen.getByPlaceholderText('Email/Username');
  const passwordInput = screen.getByPlaceholderText('Password');

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
});

// Add more unit tests as needed
