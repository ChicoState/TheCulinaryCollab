import React from 'react';
import { render } from '@testing-library/react';
import LandingPage from './LandingPage';

// Mock image file
jest.mock('./Yellow_Landingpage_p2.png', () => 'test-image');

describe('LandingPage', () => {
  it('renders without crashing', () => {
    render(<LandingPage />);
  });

});

