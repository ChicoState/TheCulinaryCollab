import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublicRecipesPage from './PublicRecipesPage';

describe('PublicRecipesPage component', () => {
  test('renders PublicRecipesPage component', () => {
    const { getByPlaceholderText, getByText } = render(<PublicRecipesPage />);

    // Use getByPlaceholderText for input placeholder text
    expect(getByPlaceholderText('Search for recipe')).toBeInTheDocument();

    // Use getByText for button text
    expect(getByText('Search')).toBeInTheDocument();
  });

  test('handles search input change and displays search results', () => {
    const { getByText, getByPlaceholderText } = render(<PublicRecipesPage />);

    // Mock user input and trigger change event
    const searchInput = getByPlaceholderText('Search for recipe');
    fireEvent.change(searchInput, { target: { value: 'Margarita' } });

    // Ensure that the search results popup is displayed
    expect(getByText('Margarita')).toBeInTheDocument();
  });

});
