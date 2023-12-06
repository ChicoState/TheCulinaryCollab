import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, query, where, orderBy, getDocs, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import './ChatPage.css';
const ChatPage = () => {
	const { friendId } = useParams();
	const [messages, setMessages] = useState([]);
	const [currentMessage, setCurrentMessage] = useState('');
	const navigate = useNavigate();
	const currentUser = auth.currentUser;

	useEffect(() => {
		if (!currentUser || !friendId) return;

		const messagesQuery = query(
			collection(firestore, 'messages'),
			where('senderId', 'in', [currentUser.uid, friendId]),
			where('receiverId', 'in', [currentUser.uid, friendId]),
			orderBy('timestamp', 'asc')
		);

		const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
			const fetchedMessages = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
			setMessages(fetchedMessages);
		}, error => {
			console.error("Error fetching messages: ", error);
		});

		const updateUserLastRead = async () => {
			const userRef = doc(firestore, 'users', currentUser.uid);
			await updateDoc(userRef, {
				[`lastReadTimestamp.${friendId}`]: new Date()
			});
		};

		updateUserLastRead().catch(console.error);
		return unsubscribe;
	}, [currentUser, friendId]);


	const sendMessage = async () => {
		if (currentMessage.trim() !== '' && currentUser) {
			const message = {
				senderId: currentUser.uid,
				receiverId: friendId,
				timestamp: new Date(),
				text: currentMessage
			};

			await addDoc(collection(firestore, 'messages'), message);
			setCurrentMessage('');
		}
	};

	return (
		<div className="chat-page">
		<button onClick={() => navigate(-1)}>Back to Social Page</button>
		<div className="chat-history">
		{messages.map(msg => (
			<div key={msg.id} className={`message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
			<p>{msg.text}</p>
			<span className="timestamp">{new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}</span>
			</div>
		))}
		</div>

		<div className="message-input">
		<input
		type="text"
		value={currentMessage}
		onChange={(e) => setCurrentMessage(e.target.value)}
		placeholder="Type a message..."
		/>
		<button onClick={sendMessage}>Send</button>
		</div>
		<Link to={`/user/${friendId}`}>View Profile</Link>
		</div>
	);
};

export default ChatPage;
