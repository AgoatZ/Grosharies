import { connect, io } from 'socket.io-client';

let socket;
let usernameAlreadySelected = false;

export const create = (userId) => {

  const auth = {
    purpose: "notification",
    userId: userId
  }

  const auth2 = {
    purpose: "post",
    postId: postId
  }

  if (process.env.NODE_ENV == "development") {
    //Different Ports in Development
    socket = io('ws://localhost:5000', {
      autoConnect: false,
      auth: auth
    });

  } else if (process.env.NODE_ENV == "production") {
    //Same Origin in Production
    socket = io({
      autoConnect: false,
      auth: auth
    });
  }

  socket.on('connect', () => { console.log('Socket connected to server'); })
  socket.on('disconnect', () => { console.log('Socket disconnected ftom server'); })

  socket.connect();
}

//SEND USER ID IF A USER LOGS/IS LOGGED IN
export const connectUser = (username) => {

  //CHECK IF SESSION EXISTS IN LOCAL STORAGE ALREADY
  const sessionID = localStorage.getItem("sessionID");

  if (sessionID) {
    usernameAlreadySelected = true;
    socket.auth = { sessionID };
    socket.connect();
  }
  else {
    usernameAlreadySelected = true;
    socket.auth = { username };
    socket.connect();
  }
}

export const created = () => {

  socket.on('connnection', () => { console.log('connected to server'); })

  //HANDLE PEND POST REQUEST NOTIFICATION
  socket.on('pend post notification', (notification) => {
    console.log(notification);
  })

  //???
  //HANLE TIMER NOTIFICATION
  //var el;
  socket.on('time', function (timeString) {
    //el = document.getElementById('server-time')
    //el.innerHTML = 'Server time: ' + timeString;
    console.log('Server time: ' + timeString);
  });

  //HANDLE DISCONNECTION
  socket.on('disconnect', () => { console.log('Socket disconnecting'); })
}


/*
    //TODO SET UP A CLIENT WEBSOCKET
    useEffect(() => {
      let socket;
      if (process.env.NODE_ENV == "development") {
        socket = io('ws://localhost:5000', { autoConnect: false }); //Different Ports in Development
      } else if (process.env.NODE_ENV == "production") {
        socket = io({ autoConnect: false }); //Same Origin in Production
      }
  
      //TODO SEND USER ID IF A USER LOGS/IS LOGGED IN
      onUsernameSelection(username) {
        this.usernameAlreadySelected = true;
        socket.auth = { username };
        socket.connect();
      },
    },
      //TODO CHECK IF SESSION EXISTS IN LOCAL STORAGE ALREADY
      created() {
      
      const sessionID = localStorage.getItem("sessionID");

      if(sessionID) {
        this.usernameAlreadySelected = true;
        socket.auth = { sessionID };
        socket.connect();
      }
      socket.on('connnection', () => {
        console.log('connected to server');
      })
  
     //TODO HANDLE PEND POST REQUEST NOTIFICATION
      socket.on('pend post notification', (notification) => {
        console.log(notification);
      })
  
     //TODO HANLE TIMER NOTIFICATION
      //var el;
      socket.on('time', function (timeString) {
        //el = document.getElementById('server-time')
        //el.innerHTML = 'Server time: ' + timeString;
        console.log('Server time: ' + timeString);
      });
  
      //TODO HANDLE DISCONNECTION
      socket.on('disconnect', () => {
        console.log('Socket disconnecting');
      })
  
    }, [])
  */