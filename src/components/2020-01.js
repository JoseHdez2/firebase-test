import React, { useState, useEffect } from "react";
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

export const RoList = ({ items }) => (
  <div>
    <Badge>{items.length}</Badge>
    <ListGroup>
      {items.map(it => (
        <RoItem item={it} />
      ))}
    </ListGroup>
  </div>
);

export const RoItem = ({ item }) => (
  <ListGroup.Item>
    {item.name || item.id || "Undefined"}{" "}
    {(item.tags || []).map(tag => (
      <Badge variant="secondary" style={{ "margin-right": "2px" }}>
        {tag}
      </Badge>
    ))}
  </ListGroup.Item>
);

export const ThingApp = () => {
  let [filterStr, setFilterStr] = useState("");
  let [selectedId, setSelectedId] = useState(null);
  let [isAdvancedToggle, setAdvancedToggle] = useState(true);
  let [is]
};

export const FilterBox = ({ filterStr }) => {};
