import { io } from 'socket.io-client';

export function createNotificationSocket(userId = sessionStorage.getItem('userId')) {

  if (!userId) {
    console.log("Socket: Couldnt find userId");
  } else {

    const dataToServer = { userId: userId }

    let socket;
    if (process.env.NODE_ENV === "development") {
      //Different Ports in Development
      socket = io('ws://localhost:5000', { autoConnect: false, auth: dataToServer });
    } else if (process.env.NODE_ENV === "production") {
      //Same Origin in Production
      socket = io({ autoConnect: false, auth: dataToServer });
    }

    socket.on('connect', () => { console.log('User Notification Socket connected to server'); });
    socket.on('disconnect', () => { console.log('User Notification Socket disconnected from server'); });

    //Custom Events from server
    //data: { text:"THE POST HEADLINE" 	title: "",	postId: "" }
    socket.on('New Notification', (data) => {
      console.log('Socket: New Notification', data);
    });

    return socket;
  }
}

export function createSocket(userId = sessionStorage.getItem('userId')) {

  if (!userId) {
    console.log("Socket: Couldnt find userId");
  } else {

    const dataToServer = { userId: userId }

    let socket;
    if (process.env.NODE_ENV === "development") {
      //Different Ports in Development
      socket = io('ws://localhost:5000', { autoConnect: false, auth: dataToServer });
    } else if (process.env.NODE_ENV === "production") {
      //Same Origin in Production
      socket = io({ autoConnect: false, auth: dataToServer });
    }
    socket.on('connect', () => { console.log('User General Socket connected to server'); });
    socket.on('disconnect', () => { console.log('User General Socket disconnected from server'); });

    //EVENTS    

    //Affected pages for all - relevant post
    //Affected pages for relevant collectors - my-orders page
    //data: { postId: "" }
    socket.on('Post Edited', (data) => {
      console.log("Socket: Post Edited", data);
      if (window.location.pathname === "/my-orders" || window.location.pathname === "/post/" + data.postId)
        window.location.reload();
    });

    //Affected pages for all - relevant post
    //Affected pages for relevant collectors - my-orders page
    //data: { postId: "" }
    socket.on('Post Deleted', (data) => {
      console.log("Socket: Post Deleted", data);
      if (window.location.pathname === "/my-orders" || window.location.pathname === "/post/" + data.postId)
        window.location.reload();
    });

    //Affected pages for publisher - my-posts
    //data: { pendingPostId:"", sourcePostId: "", collectorId: "", publisherId: "" }
    socket.on('Pending Created', (data) => {
      console.log("Socket: Pending Created", data);
      if (window.location.pathname === "/my-posts")
        window.location.reload();
    });

    //Affected pages for publisher - my-posts
    //data: { pendingPostId:"", sourcePostId: "", collectorId: "", publisherId: "" }
    socket.on('Pending Edited', (data) => {
      console.log("Socket: Pending Edited", data);
      if (window.location.pathname === "/my-posts")
        window.location.reload();
    });

    //Affected pages for collector - my-orders page, relevant post
    //Affected pages for publisher - my-posts
    //data: { by:"RELEVANT USER ID" pendingPostId:"", sourcePostId: "", collectorId: "", publisherId: "" }
    socket.on('Pending Status Changed', (data) => {
      console.log("Socket: Pending Status Changed", data);

      if (userId !== data.by && userId === data.collectorId &&
        (window.location.pathname === "/my-orders" || window.location.pathname === "/post/" + data.postId))
        window.location.reload();

      if (userId !== data.by && userId === data.publisherId &&
        (window.location.pathname === "/my-posts"))
        window.location.reload();
    });

    //Affected pages for collector - my-orders page, relevant post
    //Affected pages for publisher - my-posts
    //data: { pendingPostId:"", sourcePostId: "", collectorId: "", publisherId: "" }
    socket.on('Pending Expired', (data) => {
      console.log("Socket: Pending Expired", data);

      if (userId !== data.by && userId === data.collectorId &&
        (window.location.pathname === "/my-orders" || window.location.pathname === "/post/" + data.postId))
        window.location.reload();

      if (userId !== data.by && userId === data.publisherId &&
        (window.location.pathname === "/my-posts"))
        window.location.reload();
    });

    return socket;
  }
}