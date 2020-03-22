import React, { useState, useEffect } from "react";
import { ButtonGroup, Button } from "react-bootstrap";

export const MyToggleLinks = ({ choices = ["a", "b"], choice, setChoice }) => (
  <span>
    {choices.map(c => (
      <Button
        variant={c === choice ? "primary" : "secondary"}
        onClick={() => setChoice(c)}
      >
        {c}
      </Button>
    ))}
  </span>
);

export const MyToggleLinksAdvanced = ({
  choices = [{ name: "a", value: 1 }, { name: "b", value: 2 }],
  choice,
  setChoice,
  printMethod = i => i.name
}) => (
  <span>
    {choices.map(c => (
      <Button
        variant={c === choice ? "primary" : "secondary"}
        onClick={() => setChoice(c.value)}
      >
        {printMethod(c)}
      </Button>
    ))}
  </span>
);
