import React, { useEffect, createContext, useState, useContext } from 'react';

const UnreadMessagesContext = createContext();

export const useUnreadMessages = () => useContext(UnreadMessagesContext);

export const UnreadMessagesProvider = ({ children }) => {
	const [friendsWithUnreadMessages, setFriendsWithUnreadMessages] = useState(
		new Set(JSON.parse(localStorage.getItem('unreadMessages')) || [])
	);

	useEffect(() => {
		localStorage.setItem('unreadMessages', JSON.stringify([...friendsWithUnreadMessages]));
	}, [friendsWithUnreadMessages]);
	return (
		<UnreadMessagesContext.Provider value={{ friendsWithUnreadMessages, setFriendsWithUnreadMessages }}>
		{children}
		</UnreadMessagesContext.Provider>
	);
};

