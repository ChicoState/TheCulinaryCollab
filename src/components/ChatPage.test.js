import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { firestore, auth } from '../firebase';
import ChatPage from './ChatPage';

// Mock Firebase functions
jest.mock('../firebase', () => ({
  ...jest.requireActual('../firebase'),
  firestore: {
    ...jest.requireActual('../firebase').firestore,
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        where: jest.fn(() => ({
          orderBy: jest.fn(() => ({
            onSnapshot: jest.fn(),
          })),
        })),
      })),
      addDoc: jest.fn(),
      doc: jest.fn(),
      updateDoc: jest.fn(),
    })),
    onSnapshot: jest.fn(),
  },
  auth: {
    currentUser: {
      uid: 'user123',
    },
  },
  useNavigate: jest.fn(),
}));

describe('ChatPage', () => {
  test('renders ChatPage component', () => {
    render(
      <MemoryRouter initialEntries={['/chat/123']}>
        <Routes>
          <Route path="/chat/:friendId" element={<ChatPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Add assertions based on your UI, for example:
    expect(screen.getByText('Back to Social Page')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
  });

  test('renders messages correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/chat/123']}>
        <Routes>
          <Route path="/chat/:friendId" element={<ChatPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate onSnapshot callback with sample data
    await act(async () => {
      firestore.onSnapshot.mockImplementationOnce((callback) => {
        callback({
          docs: [
            {
              id: 'message1',
              data: () => ({
                senderId: 'user123',
                receiverId: 'friend123',
                timestamp: { seconds: 1234567890 },
                text: 'Hello!',
              }),
            },
          ],
        });
      });
    });

    // Add assertions based on the UI
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  test('handles sending messages', async () => {
    render(
      <MemoryRouter initialEntries={['/chat/123']}>
        <Routes>
          <Route path="/chat/:friendId" element={<ChatPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate typing a message and clicking Send button
    fireEvent.change(screen.getByPlaceholderText('Type a message...'), { target: { value: 'Test message' } });
    fireEvent.click(screen.getByText('Send'));

    // Add assertions based on the logic
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        text: 'Test message',
      })
    );
  });
});
