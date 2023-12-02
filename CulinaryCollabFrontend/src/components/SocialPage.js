import React, { useState, useEffect } from 'react';
import { firestore, storage, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, arrayRemove, arrayUnion, runTransaction, query, where, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './SocialPage.css';
//const user = auth.currentUser;
const SocialPage = () => {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [friendRequests, setFriendRequests] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [friends, setFriends] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentMessage, setCurrentMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [currentChatPartner, setCurrentChatPartner] = useState(null);
	const navigate = useNavigate();
	const defaultProfilePicUrl = 'https://firebasestorage.googleapis.com/v0/b/culinarycollab.appspot.com/o/profilePictures%2FD.png?alt=media&token=a23fae95-8ed6-4c3f-81da-9a49e92aa543';


	const selectChatPartner = (friend) => {
		navigate(`/chat/${friend.uid}`);
	};

	const sendMessage = async () => {
		if (currentChatPartner && currentMessage.trim() !== '') {
			const message = {
				senderId: auth.currentUser.uid,
				receiverId: currentChatPartner.uid,
				timestamp: new Date(),
				text: currentMessage
			};


			await addDoc(collection(firestore, 'messages'), message);

			setCurrentMessage('');
			fetchMessagesForChat(currentChatPartner);
		}
	};


	const fetchMessagesForChat = async (friend) => {
		if (!friend) return;

		const messagesQuery = query(
			collection(firestore, 'messages'),
			where('senderId', 'in', [auth.currentUser.uid, friend.uid]),
			where('receiverId', 'in', [auth.currentUser.uid, friend.uid]),
			orderBy('timestamp', 'asc')
		);

		const querySnapshot = await getDocs(messagesQuery);
		const fetchedMessages = querySnapshot.docs.map(doc => doc.data());

		setMessages(fetchedMessages);
	};

	useEffect(() => {
		const fetchUsers = async () => {
			const usersRef = collection(firestore, 'users');
			try {
				const querySnapshot = await getDocs(usersRef);
				const usersList = querySnapshot.docs.map(doc => ({
					uid: doc.id,
					username: doc.data().username,
					profilePic: ''
				}));
				const usersWithPics = await Promise.all(
					usersList.map(async (user) => {
						const picRef = ref(storage, `profilePictures/${user.uid}`);
						try {
							const picURL = await getDownloadURL(picRef);
							return { ...user, profilePic: picURL };
						} catch (error) {
							console.error('Error fetching profile picture:', error);
							return { ...user, profilePic: defaultProfilePicUrl };
						}
					})
				);

				setUsers(usersWithPics);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};
		const fetchFriendsList = async () => {
			if (auth.currentUser) {
				const userRef = doc(firestore, 'users', auth.currentUser.uid);
				try {
					const userSnap = await getDoc(userRef);
					if (userSnap.exists() && userSnap.data().friendsList) {

						const friendsUids = userSnap.data().friendsList;
						const friendsPromises = friendsUids.map(async (friendUid) => {
							const friendSnap = await getDoc(doc(firestore, 'users', friendUid));
							if (friendSnap.exists()) {

								let profilePicUrl = defaultProfilePicUrl;
								try {
									const profilePicRef = ref(storage, `profilePictures/${friendUid}`);
									profilePicUrl = await getDownloadURL(profilePicRef);
								} catch (error) {
									console.error('Error fetching profile picture for friend:', error);

								}
								return {
									uid: friendUid,
									username: friendSnap.data().username,
									profilePic: profilePicUrl
								};
							} else {
								return null;
							}
						});

						const friendsData = await Promise.all(friendsPromises);
						setFriends(friendsData.filter(Boolean));
					}
				} catch (error) {
					console.error('Error fetching friends list:', error);
				}
			}
		};


		fetchFriendsList();

		const fetchFriendRequests = async () => {
			if (auth.currentUser) {
				const userRef = doc(firestore, 'users', auth.currentUser.uid);
				try {
					const userSnap = await getDoc(userRef);
					if (userSnap.exists() && userSnap.data().friendRequests) {
						setFriendRequests(userSnap.data().friendRequests);
					}
				} catch (error) {
					console.error('Error fetching friend requests:', error);
				}
			}
		};
		const fetchMessages = async () => {
			const querySnapshot = await getDocs(collection(firestore, 'messages'));
			const fetchedMessages = querySnapshot.docs.map(doc => doc.data());
			setMessages(fetchedMessages);
		};

		fetchMessages();
		fetchUsers();
		fetchFriendRequests();
	}, []);

	const handleAccept = async (requestingUserid) => {
		//console.log("handle accept called <---");
		//console.log("Current user: ", auth.currentUser);
		//console.log("Requesting user: ", requestingUserid);
		const currentUserid = auth.currentUser.uid;

		const currentUserRef = doc(firestore, 'users', currentUserid);
		const requestingUserRef = doc(firestore, 'users', requestingUserid);
		try {
			await runTransaction(firestore, async (transaction) => {
				const currentUserDoc = await transaction.get(currentUserRef);
				const requestingUserDoc = await transaction.get(requestingUserRef);

				if (!currentUserDoc.exists() || !requestingUserDoc.exists()) {
					throw new Error('Document not found');
				}
				const currentUserData = currentUserDoc.data();
				const requestingUserData = requestingUserDoc.data();
				const updatedFriendRequests = currentUserData.friendRequests.filter(req => req.uid !== requestingUserid);
				transaction.update(currentUserRef, {
					friendsList: arrayUnion(requestingUserid),
					friendRequests: updatedFriendRequests
				});
				transaction.update(requestingUserRef, {
					friendsList: arrayUnion(currentUserid)
				});
			});
			alert("Friend request accepted!");
			setFriendRequests(friendRequests.filter(req => req.uid !== requestingUserid));
			const newFriendData = {
				uid: requestingUserid,
				username: requestingUserid.username,
				profilePic: requestingUserid.profilePic || defaultProfilePicUrl
			};
			setFriends([...friends, newFriendData]);
		} catch (error) {
			alert("Error accepting friend request: ", error);
		}
	};


	const handleReject = async (requestingUserId) => {
		const currentUserRef = doc(firestore, 'users', auth.currentUser.uid);
		try {
			const currentUserSnap = await getDoc(currentUserRef);
			if (currentUserSnap.exists()) {
				const currentUserData = currentUserSnap.data();
				const updatedFriendRequests = currentUserData.friendRequests.filter(request => request.uid !== requestingUserId);

				await updateDoc(currentUserRef, {
					friendRequests: updatedFriendRequests
				});
				setFriendRequests(updatedFriendRequests);

				alert("Friend request rejected");
			} else {
				alert("Current user document not found");
			}
		} catch (error) {
			alert("Error rejecting friend request: ", error);
		}
	};

	const handleUserClick = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
		navigate(`/user/${user.uid}`);
	};

	const filteredUsers = users.filter(user =>
		user.username.toLowerCase().includes(searchTerm.toLowerCase())
	);


	if (!auth.currentUser) {
		return (
			<div className="login-prompt">
			<h1>Please Log In</h1>
			<p>To access this page, you need to be logged in.</p>

			</div>
		);
	}
	return (
		<div className="social-page-container">
		<div className="users-section">
		<h1>All Users</h1>
		<input
		type="text"
		placeholder="Search users..."
		value={searchTerm}
		onChange={(e) => setSearchTerm(e.target.value)}
		/>
		<ul className="users-list">
		{filteredUsers.map((user, index) => (
			<li key={index} className="user-item" onClick={() => handleUserClick(user)}>
			<span className="username">{user.username}</span>
			<img src={user.profilePic || defaultProfilePicUrl} alt={user.username} className="user-profile-picture" />
			</li>
		))}
		</ul>



		</div>
		{/* Friends request section */}
		<div className="friend-requests-section">
		<button onClick={() => setShowDropdown(!showDropdown)}>Friend Requests</button>
		{showDropdown && (
			<div className="friend-requests-dropdown">
			<ul>
			{friendRequests.map((request, index) => (
				<li key={index}>
				{request.username}
				<button onClick={() => handleAccept(request.uid)}>Accept</button>
				<button onClick={() => handleReject(request.uid)}>Reject</button>
				</li>
			))}
			</ul>
			</div>
		)}

		</div>
		{/* Friends list */}
		<div className="friends-list">
		<h2>My Friends</h2>
		<ul>
		{friends.map((friend) => (
			<li key={friend.uid} className="friend-item" onClick={() => selectChatPartner(friend)}>
			<span className="friend-username">{friend.username}</span>
			<img src={friend.profilePic} alt={`${friend.username}'s profile`} className="friend-profile-picture" />
			</li>
		))}
		</ul>
		</div>
		{/* Messaging interface */}
		<div className="messaging-interface">
		{currentChatPartner && <h2>Chat with {currentChatPartner.username}</h2>}
		<div className="messages-display">
		{/* Display messages */}
		</div>
		{currentChatPartner && (
			<>
			<input
			type="text"
			value={currentMessage}
			onChange={(e) => setCurrentMessage(e.target.value)}
			/>
			<button onClick={sendMessage}>Send</button>
			</>
		)}
		</div>              </div>
	);
};

export default SocialPage;
