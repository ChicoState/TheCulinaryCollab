import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import firebase from '../firebase'; 
import DrinkViewPage from './DrinkViewPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../firebase', () => ({
  firestore: {
    collection: jest.fn(),
  },
  auth: {
    currentUser: {
      uid: 'mockUserId',
    },
  },
}));

describe('DrinkViewPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <DrinkViewPage />
      </BrowserRouter>
    );
  });

  it('fetches and displays personal recipes on button click', async () => {
    // Mock the firestore functions
    const getDocsMock = jest.fn();
    firebase.firestore.collection.mockReturnValue({
      getDocs: getDocsMock,
    });

    // Mock the data
    const personalRecipesData = [{ id: '1', name: 'Recipe 1' }];
    getDocsMock.mockResolvedValueOnce({
      docs: personalRecipesData.map((data) => ({ data, id: data.id })),
    });

    render(
      <BrowserRouter>
        <DrinkViewPage />
      </BrowserRouter>
    )

    // Click the 'My Personal Recipes' button
    fireEvent.click(screen.getByText('My Personal Recipes'));

    // Wait for data to be fetched and displayed
    await screen.findByText('Recipe 1');

    // Verify the mock function calls
    expect(firebase.firestore.collection).toHaveBeenCalledWith('users/mockUserId/personalRecipes');
    expect(getDocsMock).toHaveBeenCalled();
  });
});

