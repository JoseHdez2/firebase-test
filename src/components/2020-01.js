import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import Editor from "@monaco-editor/react";

import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Row,
  ListGroup
} from "react-bootstrap";

export const FilterBox = ({ filterStr, setFilterStr }) => (
  <span>
    <span>Filter: </span>
    <input value={filterStr} onChange={ev => setFilterStr(ev.target.value)} />
  </span>
);

export const ThingApp = ({ games, db }) => {
  let [filterStr, setFilterStr] = useState("");
  let [selectedId, setSelectedId] = useState(null);
  let [isAdvancedToggle, setAdvancedToggle] = useState(true);
  let [newItem, setNewItem] = useState({});
  let [userWantsToSave, setUserWantsToSave] = useState(false);
  let [games2, setGames2] = useState([]);

  useEffect(() => {
    async function doIt() {
      if (userWantsToSave) {
        console.log("Saving...");
        apiUpdateItem(db, "games", newItem);
        loadGamesFromDatabase(db);
        setUserWantsToSave(false);
        console.log("Saved!(?)");
      }
    }
    doIt();
  }, [db, userWantsToSave, newItem]);

  const setSelectedIdAndItem = item => {
    setSelectedId(item.id);
    setNewItem(item);
  };

  const docToItem = doc => ({ id: doc.id, ...doc.data() });

  const loadGamesFromDatabase = async db => {
    console.log("Loading games from database!");
    db.collection("games")
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot.docs.map(doc => doc.data().name).join());
        setGames2(querySnapshot.docs.map(docToItem));
      });
  };

  const apiUpdateItem = (db, collectionName, item) => {
    console.dir(db);
    console.log(
      `db:${db.keys}, collectionName:${collectionName}, id:${item.id}`
    );
    const { id, ...itemNoId } = item;
    db.collection(collectionName)
      .doc(id)
      .set(itemNoId);
  };

  const apiDeleteItem = (db, collectionName, item) =>
    apiUpdateItem(db, collectionName, {
      deletedOn: new Date(),
      ...item
    });

  return (
    <Row>
      <Col>
        <Row className="justify-content-sm-center">
          <FilterBox filterStr={filterStr} setFilterStr={setFilterStr} />
        </Row>
        <Row>
          <RoList
            items={games}
            filterItems={it => filterItem(it, filterStr)}
            onClickItem={setSelectedIdAndItem}
          />
          ---
          <RoList
            items={games2}
            filterItems={it => filterItem(it, filterStr)}
            onClickItem={setSelectedIdAndItem}
          />
        </Row>
      </Col>
      <Col>
        <pre>{selectedId}</pre>
        <ThingEditor
          item={newItem}
          setItem={setNewItem}
          setUserWantsToSave={setUserWantsToSave}
        />
        <ThingCreator db={db} item={newItem} />
      </Col>
    </Row>
  );
};

const filterItem = (item, filterStr) => {
  let filStr = filterStr.toLowerCase();
  return (
    (item.name || "").toLowerCase().includes(filStr) ||
    (item.tags || []).some(tag => tag.toLowerCase().includes(filStr))
  );
};

export const RoList = ({ items, filterItems, onClickItem }) => (
  <div>
    <Badge>{items.length}</Badge>
    <Badge variant="warning">{items.filter(filterItems).length}</Badge>
    <ListGroup>
      {items.filter(filterItems).map(it => (
        <RoItem key={it.id} item={it} onClickItem={onClickItem} />
      ))}
    </ListGroup>
  </div>
);

export const RoItem = ({ item, onClickItem }) => (
  <ListGroup.Item key={item.id} onClick={() => onClickItem(item)}>
    {item.name || item.id || "Undefined"}{" "}
    {(item.tags || []).map(tag => (
      <Badge key={tag} variant="secondary" style={{ marginRight: "2px" }}>
        {tag}
      </Badge>
    ))}
  </ListGroup.Item>
);

//
// THING / JSON EDITOR
//

const ThingEditor = ({ item, setItem, setUserWantsToSave }) => {
  const [isJsonEditor, setIsJsonEditor] = useState(true);

  return (
    <div>
      <JsonEditor
        item={item}
        setItem={setItem}
        setUserWantsToSave={setUserWantsToSave}
      />
    </div>
  );
};

const JsonEditor = ({ item, setItem, setUserWantsToSave }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  let valueGetter = useRef();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  async function updateItem() {
    let json = "";
    try {
      json = JSON.parse(valueGetter.current());
    } catch (err) {
      console.err(err);
    }
    await setItem(JSON.parse(valueGetter.current()));
    setUserWantsToSave(true);
  }

  return (
    <span>
      <Editor
        height={"40vh"}
        language="json"
        theme="dark"
        value={JSON.stringify(item, null, "\t")}
        editorDidMount={handleEditorDidMount}
      />
      <Button onClick={() => updateItem()} disabled={!isEditorReady}>
        Update
      </Button>
    </span>
  );
};

//
// THING CREATOR
//

export const ThingCreator = ({ db, item }) => {
  let [collName, setCollName] = useState("games");

  const onChangeInput = ev => {
    setCollName(ev.target.value);
  };

  return (
    <span>
      <Button onClick={() => apiCreateItem(db, collName, item)}>Create</Button>
      <span> in </span>
      <input value={collName} onChange={onChangeInput} />
    </span>
  );
};

//
// FIREBASE API METHODS
//

export const apiCreateItem = (db, collectionName, item) => {
  console.log(
    `db:${db}, collectionName:${collectionName}, item:${JSON.stringify(item)}`
  );
  const { id, ...itemWithoutId } = item;
  db.collection(collectionName)
    .add(itemWithoutId)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
};
