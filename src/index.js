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

  const initFirebase = () => {
    if (app) {
      alert("App already initialized");
      return;
    }
    alert("Initialized Firebase");
    setApp(firebase.initializeApp(firebaseConfig));
  };

  const initProvider = () => {
    if (provider) {
      alert("App already initialized");
      return;
    }
    setProvider(new firebase.auth.GoogleAuthProvider());
    alert("Initialized Provider");
  };

  const providerSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
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

  const databaseDoThing = () => {
    setDb(firebase.firestore());
    let gamename = firebase
      .firestore()
      .collection("games")
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot.docs.map(doc => doc.data().name).join());
        setGames(querySnapshot.docs.map(doc => doc.data()));
      });
  };

  return (
    <div className="App">
      <Row>
        <Col>
          <h1>Firebase</h1>
          <div>{app ? "App initialized!" : "App NOT initialized"}</div>
          <div>
            <Button disabled={app} onClick={initFirebase}>
              Initialize Firebase
            </Button>
          </div>
          <div>
            {provider ? "Provider initialized!" : "Provider NOT initialized"}
          </div>
          <div>
            <Button disabled={provider} onClick={initProvider}>
              Initialize Provider
            </Button>
          </div>
          <div>{user ? "User signed in!" : "User NOT signed in"}</div>
          <div>
            <Button disabled={user} onClick={providerSignIn}>
              Provider Sign in
            </Button>
          </div>
          <div>Database</div>
          <div>
            <Button onClick={databaseDoThing}>Database Do Thing</Button>
          </div>
        </Col>
        <Col>
          <Row>
            <h1>Thing App</h1>
          </Row>
          <Row> </Row>
          <Row>
            <RoList items={games} />
            <ThingApp db={db} />
            <VirtRoList items={games.map(g => g.name)} />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
