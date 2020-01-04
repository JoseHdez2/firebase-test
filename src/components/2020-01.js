import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import Editor from "@monaco-editor/react";
import ReactScrollableList from "react-scrollable-list";

import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Row,
  ListGroup
} from "react-bootstrap";

export const RoList = ({ items }) => (
  <div>
    <Badge>{items.length}</Badge>
    <ListGroup style={{ height: 50 }}>
      {items.map(it => (
        <RoItem item={it} />
      ))}
    </ListGroup>
  </div>
);

export const RoItem = ({ item }) => (
  <ListGroup.Item key={item.id}>
    {item.name || item.id || "Undefined"}{" "}
    {(item.tags || []).map(tag => (
      <Badge variant="secondary" style={{ marginRight: "2px" }}>
        {tag}
      </Badge>
    ))}
  </ListGroup.Item>
);

export const FilterBox = ({ filterStr, setFilterStr }) => (
  <input value={filterStr} />
);

// FIL-tered SEL-ectable List
export const FilSelList = () => {};

export const ThingApp = ({ db }) => {
  let [filterStr, setFilterStr] = useState("");
  let [selectedId, setSelectedId] = useState(null);
  let [isAdvancedToggle, setAdvancedToggle] = useState(true);
  let [isAsd, setAsd] = useState();

  return (
    <div>
      {/* <FilterBox filterStr={filterStr} /> */}
      <SampleThingCreator db={db} />
    </div>
  );
};

export const SampleThingCreator = ({ db }) => {
  let [collName, setCollName] = useState("games");
  let [item, setItem] = useState({ name: "Blinx 2" });

  const onChangeInput = ev => {
    setCollName(ev.target.value);
  };

  return (
    <div>
      <input value={collName} onChange={onChangeInput} />
      <Button onClick={() => apiCreateItem(db, collName, item)}>Create</Button>
    </div>
  );
};

export const apiCreateItem = (db, collectionName, item) => {
  console.log(`db:${db}, collectionName:${collectionName}, item:${item}`);
  db.collection(collectionName)
    .add(item)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
};

const JsonEditor = ({ db }) => {
  const [item, setItem] = useState({});
  const [isEditorReady, setIsEditorReady] = useState(false);
  let valueGetter = useRef();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  return (
    <Editor
      height={"40vh"}
      language="json"
      theme="dark"
      editorDidMount={handleEditorDidMount}
    />
  );
};

export const VirtRoList = ({ items }) => {
  const Row2 = ({ index, style }) => (
    <div className="MyRow" style={style}>
      {items[index]}
    </div>
  );

  return (
    <ReactScrollableList
      listItems={items.map(it => (
        <RoItem item={it} />
      ))}
      heightOfItem={30}
      maxItemsToRender={50}
      style={{ color: "#333" }}
    />
  );
};
