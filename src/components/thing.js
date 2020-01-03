import { Button, ButtonGroup, Col, Row, ListGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";

const ThingApp = () => (
  <div>
    <h3>[{this.props.type}] List</h3>
    {this.state.isLoading ? (
      <div>Loading...</div>
    ) : (
      <div>
        {this.state.notification}
        <label>Search:</label>
        <input />
        <ThingList
          items={this.state.items}
          onSelectThing={this.onSelectThing}
          selectedId={this.state.selectedId}
        />
        <ThingEditor
          sampleThing={this.state.sampleThing}
          onCreate={this.onCreate}
          onModify={this.onModify}
          onDelete={this.onDelete}
        />
      </div>
    )}
  </div>
);

const ThingList = ({ items, onSelectThing, selectedId }) => (
  <ListGroup>
    {items.map(item => (
      <ListGroup.Item
        key={item._id}
        action
        disabled={item._id === selectedId}
        onClick={() => onSelectThing(item._id)}
      >
        {item.thing ? item.thing.name : "(nothing)"}{" "}
        {item._id === selectedId ? "(selected)" : ""}
      </ListGroup.Item>
    ))}
  </ListGroup>
);

const ThingEditor = ({
  sampleThing,
  selectedId,
  shortId,
  onCreate,
  onModify,
  onDelete
}) => {
  const [value, setValue] = useState("");

  const componentDidUpdate = prevProps => {
    if (prevProps.sampleThing === this.props.sampleThing) {
      return;
    }
    const text = JSON.stringify(this.props.sampleThing, null, 2);
    this.setState({
      value: text,
      dirty: false
    });
  };

  const onInput = ev => {
    this.setState({
      value: ev.target.value,
      dirty: true
    });
  };

  return (
    // let selectedId = this.props.sampleThing._id;
    // let shortId = selectedId
    //   ? selectedId.replace(/(.{3}).*(.{3})/, "$1..$2")
    //   : "Nothing";
    <div>
      <textarea
        style={{ width: "95%" }}
        value={this.state.value}
        onInput={this.onInput}
        rows={30}
      />
      <ButtonGroup>
        <Button
          type="button"
          variant="primary"
          onClick={() => this.props.onCreate(this.state.value)}
        >
          create
        </Button>
        <Button
          type="button"
          variant="success"
          disabled={!this.state.dirty}
          onClick={() => this.props.onModify(this.state.value)}
        >
          modify [{shortId}]
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => this.props.onDelete(selectedId)}
        >
          delete [{shortId}]
        </Button>
      </ButtonGroup>
    </div>
  );
};
