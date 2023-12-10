import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RatingStars from './RatingStars';

describe('RatingStars Component', () => {
  test('calls onChange when a star is clicked', () => {
    const onChangeMock = jest.fn();
    const { getAllByText } = render(<RatingStars onChange={onChangeMock} />);

    const stars = getAllByText('★'); // Get all elements with the text '★'
    fireEvent.click(stars[0]); // Click on the first star

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  test('does not call onChange when readOnly is true', () => {
    const onChangeMock = jest.fn();
    const { getAllByText } = render(<RatingStars onChange={onChangeMock} readOnly />);

    const stars = getAllByText('★'); // Get all elements with the text '★'
    fireEvent.click(stars[0]); // Click on the first star

    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
