import React, { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";

const TOAST_DELAY_MS = 2000;

export const MyToast = ({
  showToast,
  setShowToast,
  timestampStr,
  toastText
}) => (
  <Toast
    onClose={() => setShowToast(false)}
    show={showToast}
    delay={TOAST_DELAY_MS}
    autohide
  >
    <Toast.Header>
      <strong className="mr-auto">Firebase Test</strong>
      <small>{timestampStr}</small>
    </Toast.Header>
    <Toast.Body>{toastText}</Toast.Body>
  </Toast>
);
