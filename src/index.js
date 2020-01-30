import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Row,
  ListGroup
} from "react-bootstrap";
import { RoList, ThingApp, VirtRoList } from "./components/2020-01";
import "./styles.css";

const firebaseConfig = {
  apiKey: "AIzaSyBQlfGzy-TFJkTOmx-QKxa-XxUmKgn4cfA",
  authDomain: "test-273b1.firebaseapp.com",
  databaseURL: "https://test-273b1.firebaseio.com",
  projectId: "test-273b1",
  storageBucket: "test-273b1.appspot.com",
  messagingSenderId: "351009168254",
  appId: "1:351009168254:web:c891b0f914c24c8293b12f"
};

const App = () => {
  let [app, setApp] = useState(false);
  let [provider, setProvider] = useState(false);
  let [user, setUser] = useState(false);
  let [games, setGames] = useState([]);
  let [db, setDb] = useState(null);

  useEffect(() => {
    if (!app) {
      setApp(firebase.initializeApp(firebaseConfig));
    }
    if (!provider) {
      setProvider(new firebase.auth.GoogleAuthProvider());
    }
    if (!db) {
      setDb(firebase.firestore()); // flimsy?
    }
  }, [app, provider, db]);

  const providerSignIn = () => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => firebase.auth().signInWithPopup(provider))
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        setUser(result.user);
        alert(`Signed in! user:[${user.displayName}]`);
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        alert(error.message);
      });
  };

  const docToItem = doc => ({ id: doc.id, ...doc.data() });

  const loadGamesFromDatabase = async () => {
    console.log("Loading games from database!");
    db.collection("games")
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot.docs.map(doc => doc.data().name).join());
        setGames(querySnapshot.docs.map(docToItem));
      });
  };

  return (
    <div className="App">
      <Col>
        <Row>
          <ButtonGroup>
            <Button disabled={user} onClick={providerSignIn}>
              Google Sign in
            </Button>
            <Button onClick={loadGamesFromDatabase}>Load data</Button>
          </ButtonGroup>
        </Row>
        <ThingApp games={games} db={db} />
      </Col>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
