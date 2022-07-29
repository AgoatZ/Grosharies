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

export const createPostStatusSocket = (postId) => {
  const dataToServer = {
    purpose: "post",
    postId: postId
  }
  createSocket(dataToServer);

  //Events from server
  socket.on('connect', () => { console.log('PostStatus Socket connected to server'); })
  socket.on('disconnect', () => { console.log('PostStatus Socket disconnected from server'); })

  socket.connect();
}

export const onPostStatusChanged = (callback) => {
  socket.on('post canceled', (postId, userId) => {
    callback(postId, userId);
  })
}