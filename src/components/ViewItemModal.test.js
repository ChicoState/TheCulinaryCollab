import React from 'react';
import { render } from '@testing-library/react';
import ViewItemModal from './ViewItemModal';

//smoke test for ViewItemModal
test('ViewItemModal renders without crashing', () => {
  render(<ViewItemModal item={{}} onClose={() => {}} onEdit={() => {}} onDelete={() => {}} />);


});

test('ViewItemModal renders the correct content', () => {
  const { getByText } = render(<ViewItemModal item={{ name: 'test item', quantity: 1 }} onClose={() => {}} onEdit={() => {}} onDelete={() => {}} />);

  getByText('test item');
  getByText('Quantity: 1');
});


