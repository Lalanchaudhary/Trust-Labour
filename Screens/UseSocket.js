import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from 'react-native-config';
import notifee, { AndroidImportance } from '@notifee/react-native';

const UseSocket = () => {
  const [socket, setSocket] = useState(null);
  const Rest_API = Config.Rest_API;
  const SOCKET_SERVER = `http://${Rest_API}:9000`; // Update with your backend IP

  const displayNotification = async (title, body) => {
    // Request permission for notifications (iOS)
    await notifee.requestPermission();

    // Create a channel for Android
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display the notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Use your app's icon
      },
    });
  };

  useEffect(() => {
    const connectSocket = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const newSocket = io(SOCKET_SERVER);
      setSocket(newSocket);

      // Join room with user ID
      newSocket.emit("join-room", userId);

      // Listen for friend request notifications
      newSocket.on("friend-request", async (data) => {
        console.log("Friend Request Received:", data);
        await displayNotification("New Friend Request", `${data.message} from user ${data.senderId}`);
      });

      return () => newSocket.disconnect();
    };

    connectSocket();
  }, []);

  return socket;
};

export default UseSocket;
