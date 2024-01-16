import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './post';
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import ImageUpload from './ImageUpload';
import { Avatar } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [opensignIn, setOpensignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [prob, setProb] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {

        } else {
          // if we just created someone
          return {
            displayName: username,
          }
        }

      } else {
        //user has logged out
        setUser(null);
      }

    })

    return () => {
      //cleanup
      unsub();
    }
  }, [user, username])

  //useEffect -> Runs a piece of code based on a specific condtion...we write the
  // condtion inside []

  async function newfunc() {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    //every time a new post is added, this code fires...
    querySnapshot.forEach((doc) => {
      setPosts(prevValue =>
        [
          ...prevValue,
          {
            id: doc.id,
            username: doc.data().username,
            caption: doc.data().caption,
            imageURL: doc.data().imageURL
          }
        ]

      )
      // console.log(`${doc.id} => ${doc.data().caption}`);
    });


    return null;
  }

  useEffect(() => {

    newfunc();
    console.log("Mount");

  }, [])

  // console.log(`${posts[0].id}=>${posts[0].caption}`);


  //empty[] means it is going to run once


  const signUp = e => {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const newuser = userCredential.user;
        // ...

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        setProb(true);
        // ..
      });
  }

  const signIn = e => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const newuser = userCredential.user;
        console.log(newuser);
        setOpen(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        setProb(true);
      });
  }

  console.log(username);

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style}>
          <form className='app__signup'>
            <center>
              <img className='app__headerImage' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' />
            </center>
            <Input
              type="text"
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="email"
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {prob && <h3 className='error_message'>Incorrect Email or Password</h3>}
            <Button onClick={signUp}>Sign-Up</Button>
          </form>


        </Box>

      </Modal>

      <Modal
        open={opensignIn}
        onClose={() => setOpensignIn(false)}
      >
        <Box sx={style}>
          <form className='app__signup'>
            <center>
              <img className='app__headerImage' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' />
            </center>
            <Input
              type="email"
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {prob && <h3 className='error_message'>Incorrect Email or Password</h3>}
            <Button type='submit' onClick={signIn}>Login</Button>
          </form>


        </Box>

      </Modal>



      <div className='app__header'>
        <img className='app__headerImage' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' />

        {user ? (<div> <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"

        /><Button onClick={() => auth.signOut()}>Log-Out</Button></div>) : (<div>
          <Button onClick={() => setOpen(true)}>Sign-Up</Button> <Button onClick={() => setOpensignIn(true)}>Sign-In</Button></div>)}


      </div>



      <div className='app__posts'>
        {
          posts.map((doc) => (
            <Post key={doc.id} username={doc.username} caption={doc.caption} imageURL={doc.imageURL} />
          ))
        }
      </div>


      {user ? (<ImageUpload username={username} />) : (<h3>Login To Upload</h3>)}

    </div>
  );
}

export default App;

//https://instagram-clone-react-a4f9e.web.app/