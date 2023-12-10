import React from 'react';
import { render, fireEvent, waitFor, findByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewPersonalRecipeModal from './ViewPersonalRecipeModal';

const mockRecipe = {
  id: 1,
  name: 'Rusty Nail',
  timing: 'After dinner',
  taste: 'Boozy',
  ingredients: [
    { amount: 4.5, ingredient: 'Scotch Whisky', unit: 'cl' },
    { amount: 2.5, ingredient: 'Drambuie', unit: 'cl' },
  ],
  preparation: 'Stirred',
  cost: undefined,
  timeToMake: undefined,
};

describe('ViewPersonalRecipeModal', () => {
  test('renders the component with a recipe', async () => { 
    const { container, getByText } = render(
      <ViewPersonalRecipeModal isOpen={true} onClose={() => {}} recipe={mockRecipe} onEdit={() => {}} onDelete={() => {}} />
    );
  
    await waitFor(() => { 
      expect(container).toMatchSnapshot();
    });
    const timingElement = await findByText('Timing: After dinner');
      expect(timingElement).toBeInTheDocument();
      expect(getByText('Rusty Nail')).toBeInTheDocument();
      expect(getByText('Timing: After dinner')).toBeInTheDocument();
      expect(getByText('Taste: Boozy')).toBeInTheDocument();
      expect(getByText('Scotch Whisky (4.5 cl)')).toBeInTheDocument();
      expect(getByText('Drambuie (2.5 cl)')).toBeInTheDocument();
      expect(getByText('Preparation: Stirred')).toBeInTheDocument();
      expect(getByText('Cost:')).not.toBeInTheDocument();
      expect(getByText('Time to Make:')).not.toBeInTheDocument();

  });

  test('calls onEdit and onClose when Edit button is clicked', () => {
    const onEditMock = jest.fn();
    const onCloseMock = jest.fn();

    const { getByText } = render(
      <ViewPersonalRecipeModal isOpen={true} onClose={onCloseMock} recipe={mockRecipe} onEdit={onEditMock} onDelete={() => {}} />
    );

    const editButton = getByText('Edit');
    fireEvent.click(editButton);

    expect(onEditMock).toHaveBeenCalledWith(1); // Assuming the recipe id is 1
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('calls onDelete and onClose when Delete button is clicked', () => {
    const onDeleteMock = jest.fn();
    const onCloseMock = jest.fn();

    const { getByText } = render(
      <ViewPersonalRecipeModal isOpen={true} onClose={onCloseMock} recipe={mockRecipe} onEdit={() => {}} onDelete={onDeleteMock} />
    );

    const deleteButton = getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledWith(1); // Assuming the recipe id is 1
    expect(onCloseMock).toHaveBeenCalled();
  });

  // Add more tests as needed
});

