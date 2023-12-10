import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeSearchBar from './RecipeSearchBar';

// Mock data for testing
const personalRecipes = [
  {
    id: '1',
    name: 'Rusty Nail',
    ingredients: [
      { amount: 4.5, ingredient: 'Scotch Whisky', unit: 'cl' },
      { amount: 2.5, ingredient: 'Drambuie', unit: 'cl' },
    ],
    preparation: 'Stirred',
    taste: 'Boozy',
    timing: 'After dinner',
  },

  {
    id: '2',
    name: 'Manhattan',
    ingredients: [
      { amount: 4.5, ingredient: 'Dartdfg', unit: 'cl' },
      { amount: 2.5, ingredient: 'nhjhtr', unit: 'cl' },
    ],
    preparation: 'Stirred',
    taste: 'Boozy',
    timing: 'After dinner',
  },
];

const savedRecipes = [
  {
    id: '3',
    name: 'Spaghetti',
    ingredients: [
      { amount: 4.5, ingredient: 'Vodka Rum', unit: 'cl' },
      { amount: 2.5, ingredient: 'Fetseg', unit: 'cl' },
    ],
    preparation: 'Stirred',
    taste: 'Boozy',
    timing: 'After dinner',
  },
];

const publicRecipes = [
  {
    id: '4',
    name: 'Jello Shots',
    ingredients: [
      { amount: 4.5, ingredient: 'Jello', unit: 'cl' },
      { amount: 2.5, ingredient: 'Gelatin', unit: 'cl' },
    ],
    preparation: 'Stirred',
    taste: 'Boozy',
    timing: 'After dinner',
  },
];

describe('RecipeSearchBar Component', () => {
  test('renders RecipeSearchBar component', () => {
    render(<RecipeSearchBar personalRecipes={personalRecipes} savedRecipes={savedRecipes} publicRecipes={publicRecipes} />);
    
    // Add your assertions here
    // For example:
    expect(screen.getByPlaceholderText('Search for recipe')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('handles input change', () => {
    render(<RecipeSearchBar personalRecipes={personalRecipes} savedRecipes={savedRecipes} publicRecipes={publicRecipes} />);
    
    const searchInput = screen.getByPlaceholderText('Search for recipe');
    fireEvent.change(searchInput, { target: { value: 'Drambuie' } });

    // Add your assertions here
    // For example:
    expect(searchInput.value).toBe('Drambuie');
  });

  test('handles search and displays results', () => {
    render(<RecipeSearchBar personalRecipes={personalRecipes} savedRecipes={savedRecipes} publicRecipes={publicRecipes} />);
    
    const searchInput = screen.getByPlaceholderText('Search for recipe');
    fireEvent.change(searchInput, { target: { value: 'Jello' } });

    // Add your assertions here
    // For example:
    expect(screen.getByText('Jello Shots')).toBeInTheDocument();
  });

  // Add more tests as needed
});
