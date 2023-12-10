import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import EditRecipeModal from './EditRecipeModal';

describe('EditRecipeModal Unit Tests', () => {
  test('renders EditRecipeModal component', () => {
    const { getByText, getByLabelText } = render(
      <EditRecipeModal isOpen={true} onClose={() => {}} updateRecipe={() => {}} recipe={{
        name: 'Test Recipe',
        timing: '1 hour',
        ingredients: [
          {ingredient: 'Ingredient 1', amount: '1', unit: 'cup' },
          {ingredient: 'Ingredient 2', amount: '2', unit: 'cup' },
          {ingredient: 'Ingredient 3', amount: '3', unit: 'cup'}
        ],
        preparation: 'Test preparation',
        cost: '10',
        timeToMake: '10 minutes',
      }} />
    );

    expect(getByText('Name')).toBeInTheDocument();
    expect(getByLabelText('Timing')).toBeInTheDocument();
    // Add similar assertions for other elements
  });

  test('handles input changes correctly', () => {
    const { getByLabelText } = render(
      <EditRecipeModal isOpen={true} onClose={() => {}} updateRecipe={() => {}} recipe={{
        name: 'Test Recipe',
        timing: '1 hour',
        ingredients: [
          {ingredient: 'Ingredient 1', amount: '1', unit: 'cup' },
          {ingredient: 'Ingredient 2', amount: '2', unit: 'cup' },
          {ingredient: 'Ingredient 3', amount: '3', unit: 'cup'}
        ],
        preparation: 'Test preparation',
        cost: '20',
        timeToMake: '10 minutes',
      }} />
    );

    fireEvent.change(getByLabelText('Name'), { target: { value: 'New Recipe' } });
    expect(getByLabelText('Name').value).toBe('New Recipe');
    // Add similar assertions for other input changes
  });

  // Add more unit tests
});