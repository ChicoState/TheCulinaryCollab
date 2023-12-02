import React from 'react';
import { render } from '@testing-library/react';
import LandingPage from './LandingPage';

test('renders LandingPage component', () => {
  const { getByText } = render(<LandingPage />);

  const textToFind = /In TheCullinaryCollab/;
  expect(getByText(textToFind)).toBeInTheDocument();
  
});
