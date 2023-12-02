import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddRecipeModal from './AddRecipeModal';

// Mock the addRecipe function
const mockAddRecipe = jest.fn();

describe('AddRecipeModal', () => {
  test('renders properly', () => {
    render(<AddRecipeModal isOpen={true} onClose={() => {}} addRecipe={mockAddRecipe} />);
    
    //Assertions based on the expected elements in the modal
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Timing')).toBeInTheDocument();
  });

  test('calls addRecipe function on form submission', () => {
    render(<AddRecipeModal isOpen={true} onClose={() => {}} addRecipe={mockAddRecipe} />);
    
    // Mock user input
    //Add more user input
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Recipe' } });
    fireEvent.change(screen.getByLabelText('Timing'), { target: { value: '30 minutes' } });

    fireEvent.click(screen.getByText('Save'));

    // Check if addRecipe was called with the expected data
    expect(mockAddRecipe).toHaveBeenCalledWith({
      name: 'Test Recipe',
      timing: '30 minutes',
      ingredients: expect.any(Array), 
      preparation: '',
      taste: '',
      timeToMake: '',
      cost: '',
    });
  });
});