import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditRecipeModal from './EditRecipeModal';

describe('EditRecipeModal Component', () => {
  it('renders without crashing', () => {
    render(<EditRecipeModal isOpen={true} onClose={() => {}} updateRecipe={() => {}} recipe={{}} />);
  });

  it('calls handleSubmit on form submission', async () => {
    const updateRecipeMock = jest.fn();
    const { getByLabelText, getByText } = render(
      <EditRecipeModal isOpen={true} onClose={() => {}} updateRecipe={updateRecipeMock} recipe={{}} />
    );

    //Mock input values 
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Test Recipe' } });
    fireEvent.change(getByLabelText('Timing'), { target: { value: '30 minutes' } });
    fireEvent.change(getByLabelText('Taste'), { target: { value: 'Spicy' } });

    fireEvent.click(getByText('Add Ingredient'));
    fireEvent.change(getByLabelText('Ingredient 0'), { target: { value: 'Salt' } });
    fireEvent.change(getByLabelText('Amount 0'), { target: { value: '1' } });
    fireEvent.change(getByLabelText('Unit 0'), { target: { value: 'teaspoon' } });

    fireEvent.click(getByText('Remove'));

    fireEvent.change(getByLabelText('Preparation'), { target: { value: 'Mix all ingredients together.' } });
    fireEvent.change(getByLabelText('Cost'), { target: { value: '5' } });
    fireEvent.change(getByLabelText('Time to Make'), { target: { value: '45 minutes' } });

    fireEvent.click(getByText('Save'));

    await waitFor(() => {
      expect(updateRecipeMock).toHaveBeenCalledTimes(1);
    });
  });
});
