import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RecipeSearchBarBrowse from './RecipeSearchBarBrowse';

// Mock recipe data for testing
const recipes = [
  {
    name: 'Rusty Nail',
    ingredients: [
      {
        amount: 4.5,
        ingredient: 'Scotch Whisky',
        unit: 'cl',
      },
      {
        amount: 2.5,
        ingredient: 'Drambuie',
        unit: 'cl',
      },
    ],
    preparation: 'Stirred',
    taste: 'Boozy',
    timing: 'After dinner',
    createdBy: { username: 'chef123' },
  },
  {
    name: 'Mojito',
    ingredients: [
      {
        amount: 4.5,
        ingredient: 'Scotch Whisky',
        unit: 'cl',
      },
      {
        amount: 2.5,
        ingredient: 'Drambuie',
        unit: 'cl',
      },
    ],
    preparation: 'Stirred',
    taste: 'Boozy',
    timing: 'After dinner',
    createdBy: { username: 'chef12' },
  },
];

describe('RecipeSearchBarBrowse', () => {
  test('renders the component', () => {
    const { container } = render(<RecipeSearchBarBrowse recipes={recipes} onView={() => {}} />);
    expect(container).toMatchSnapshot();
  });

  test('handles input change and triggers search', () => {
    const { getByPlaceholderText } = render(<RecipeSearchBarBrowse recipes={recipes} onView={() => {}} />);

    const input = getByPlaceholderText('Search for recipe');
    fireEvent.change(input, { target: { value: 'Rusty Nail' } });

    expect(input.value).toBe('Rusty Nail');

  });

  test('handles search button click', () => {
    const onViewMock = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <RecipeSearchBarBrowse recipes={recipes} onView={onViewMock} />
    );

    const input = getByPlaceholderText('Search for recipe');
    fireEvent.change(input, { target: { value: 'Rusty Nail' } });

    const viewButton = queryAllByText('View');
    fireEvent.click(viewButton);

    expect(onViewMock).toHaveBeenCalledWith(recipes[0]);
    
  });
});

