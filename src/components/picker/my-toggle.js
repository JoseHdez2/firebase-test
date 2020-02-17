import React, { useState, useEffect } from "react";
import { ButtonGroup, Button } from "react-bootstrap";

export const MyToggle = ({ choices = ["a", "b"], choice, setChoice }) => (
  <ButtonGroup>
    {choices.map(c => (
      <Button
        variant={c === choice ? "primary" : "secondary"}
        onClick={() => setChoice(c)}
      >
        {c}
      </Button>
    ))}
  </ButtonGroup>
);

export const MyToggleTest = () => {
  let choices = ["on", "off"];
  let [choice, setChoice] = useState("on");
  return (
    <span>
      {choice}
      <MyToggle choices={choices} choice={choice} setChoice={setChoice} />
    </span>
  );
};

export const BooleanToggle = ({
  onStr = "on",
  offStr = "off",
  choice,
  setChoice
}) => (
  <ButtonGroup>
    <Button
      variant={choice ? "success" : "secondary"}
      onClick={() => setChoice(true)}
    >
      {onStr}
    </Button>
    <Button
      variant={!choice ? "danger" : "secondary"}
      onClick={() => setChoice(false)}
    >
      {offStr}
    </Button>
  </ButtonGroup>
);
