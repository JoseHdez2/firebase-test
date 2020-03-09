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
