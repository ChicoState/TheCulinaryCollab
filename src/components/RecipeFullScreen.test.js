import React from 'react';
import { render } from '@testing-library/react';
import RecipeFullScreen from './RecipeFullScreen';

describe('RecipeFullScreen', () => {
  test('renders without crashing', () => {
    const mockRecipe = {
      id: '123',
      name: 'Test Recipe',
      description: 'Test Description',
      ingredients: ['Test Ingredient'],
    };
    const { container } = render(<RecipeFullScreen recipe={mockRecipe} onClose={() => {}} />);
    
    expect(container).toBeDefined();
  });
});

