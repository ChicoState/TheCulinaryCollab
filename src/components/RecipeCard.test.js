import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeCard from './RecipeCard';

/*describe('RecipeCard Component', () => {
  const recipe = { name: 'Test Recipe' };

  it('renders recipe name correctly', () => {
    const { getByText } = render(<RecipeCard recipe={recipe} />);
    expect(getByText('Test Recipe')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const onClickMock = jest.fn();
    const { container } = render(<RecipeCard recipe={recipe} onClick={onClickMock} />);
    
    fireEvent.click(container.firstChild);
    
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});*/

test('RecipeCard renders without crashing', () => {
  const recipe = { name: 'Test Recipe' };
  const { container } = render(<RecipeCard recipe={recipe} />);
  expect(container.firstChild).toBeInTheDocument();
});

