import { io } from 'socket.io-client';

let socket;
const createSocket = (dataToServer) => {
  if (process.env.NODE_ENV == "development") {
    //Different Ports in Development
    socket = io('ws://localhost:5000', { autoConnect: false, auth: dataToServer });
  } else if (process.env.NODE_ENV == "production") {
    //Same Origin in Production
    socket = io({ autoConnect: false, auth: dataToServer });
  }
}

export const createNotificationSocket = (userId) => {
  const dataToServer = {
    purpose: "notification",
    userId: userId
  }
  createSocket(dataToServer);

  //Events from server
  socket.on('connect', () => { console.log('Notifications Socket connected to server'); })
  socket.on('disconnect', () => { console.log('Notifications Socket disconnected from server'); })

  socket.connect();
}

export const onNewNotification = (callback) => {
  socket.on('new notification', (notification) => {
    console.log("New Notification", notification);
    callback(notification);
  })
}

  //socket.on('new notification', (notification, postId) => { console.log(notification); })
  //socket.on('time', function (timeString) { console.log('Server time: ' + timeString); });
  //socket.on('pend post notification', (notification) => { console.log(notification); })
