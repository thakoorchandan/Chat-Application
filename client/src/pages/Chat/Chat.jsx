import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import _isNull from "lodash/isNull";

import { ToastContainer, toast } from "react-toastify";
import defaultProfile from "../../img/defaultProfile.png";

import "react-toastify/dist/ReactToastify.css";

import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import { getUser } from "../../api/UserRequests";
import LogoQuick from "../../img/LogoQuick.png";
import { userChats } from "../../api/ChatRequests";
import Statistics from "./Statistics";

import { logout } from "../../actions/AuthActions";

import "./Chat.css";

const Chat = () => {
  const socket = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [userData, setUserData] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const notifySuccess = () =>
    toast.success("Logged out successfully !!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  const handleLogOut = () => {
    notifySuccess();
    setTimeout(() => {
      dispatch(logout())
    }, 2800);
  };

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);

        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);

  // Get the receiver member info
  useEffect(() => {
    if (currentChat === null) {
      return;
    } else {
      const { members } = currentChat;
      const userId = members[1];
      const getUserData = async () => {
        try {
          const { data } = await getUser(userId);
          setUserData(data);
        } catch (error) {
          console.log(error);
        }
      };
      getUserData();
    }
  }, [currentChat]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <>
      <div className="Chat">
        {/* Left Container */}
        <div className="Left-side-chat">
          <div className="ProfileContainer">
            <div className="logo">
              <img src={LogoQuick} alt="" />
            </div>
            <div className="ProfileImages">
              <img
                src={defaultProfile}
                alt="ProfileImage"
              />
            </div>
            <div className="ProfileName">
              <span>
                {user.firstname} {user.lastname}
              </span>
              <button type="button" className="Logout" onClick={handleLogOut}>
                Logout <i class="fa fa-archive" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div className="Chat-container">
            <h2>Chats</h2>
            <div className="Chat-list">
              {chats.map((chat) => (
                <div
                  onClick={() => {
                    setCurrentChat(chat);
                  }}
                >
                  <Conversation
                    data={chat}
                    currentUser={user._id}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="Right-side-chat">
          <ChatBox
            chat={currentChat}
            currentUser={user._id}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
          />
        </div>

        {/* Right Container */}
        <div className="RightContainer">
          <div
            className={
              _isNull(userData)
                ? "RightProfileWithoutUser"
                : "RightProfileWithUser"
            }
          >
            {_isNull(userData) ? (
              <div className="emptyProfileName">
                <span>{"Select Any Chat"}</span>
              </div>
            ) : (
              <div className="UserProfileName">
                <div className="ProfileImages">
                  <img
                    src={defaultProfile}
                    alt="ProfileImage"
                  />
                </div>
                <div className="ProfileName">
                  <span>
                    <i class="fa fa-envelope-o"></i>&nbsp;&nbsp;&nbsp;
                    {userData?.username}
                  </span>
                  <span>
                    <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                    &nbsp;&nbsp;&nbsp;{userData?.firstname} {userData?.lastname}
                  </span>
                  <button type="button" className="Archive">
                    Archive <i class="fa fa-archive" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* <ToastContainer /> */}
          <div className="chart-container">
            <Statistics />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Chat;
