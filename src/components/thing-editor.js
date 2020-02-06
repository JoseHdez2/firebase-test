import Editor from "@monaco-editor/react";
import { Button, ButtonGroup } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { apiCreateItem, apiUpdateItem, apiDeleteItem } from "./api";

export const ThingEditor2 = ({
  sampleThing,
  selectedId,
  db,
  setUserWantsToLoadAll,
  onCreate = apiCreateItem,
  onModify = apiUpdateItem,
  onDelete = apiDeleteItem
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [value, setValue] = useState("");
  const [sampleThingStr, setSampleThingStr] = useState("");
  const [isNewSampleThing, setIsNewSampleThing] = useState(true);
  const [isDirty, setDirty] = useState(false);
  const [shortId, setShortId] = useState("Nothing");

  const editorRef = useRef();

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }
    setValue(editorRef.current.getValue());

    if (isNewSampleThing) {
      // sampleThing (and value) was changed from above; reset dirty flag.
      setDirty(false);
      // console.log("now clean!");
      setIsNewSampleThing(false); // consume "event"
    } else if (!isDirty && !isNewSampleThing) {
      // value was now changed by editor
      if (sampleThingStr !== value) {
        // console.log(getDifference(sampleThingStr, value));
        // console.log(`sampleThingStr: ${sampleThingStr}`);
        // console.log(`value: ${value}`);
        setDirty(true);
        // console.log("now dirty!");
      }
    }
  }, [isEditorReady, isDirty, isNewSampleThing, sampleThingStr, value]);

  useEffect(() => {
    setShortId((sampleThing.id || shortId).replace(/(.{3}).*(.{3})/, "$1..$2"));
  }, [shortId, sampleThing.id]);

  // sampleThing was changed from above; reset dirty flag.
  useEffect(() => {
    setIsNewSampleThing(true);
    setSampleThingStr(JSON.stringify(sampleThing, null, "\t").trim());
  }, [sampleThing]);

  function handleEditorDidMount(_valueGetter, editor) {
    setIsEditorReady(true);
    editorRef.current = editor;
    // listen to editor changes.
    editorRef.current.onDidChangeModelContent(ev => {
      setValue(editorRef.current.getValue());
    });
  }

  const sampleThingToStr = sampleThing =>
    JSON.stringify(sampleThing, null, "\t");

  return (
    <div>
      <Editor
        height={"40vh"}
        language="json"
        theme="dark"
        value={sampleThingStr}
        editorDidMount={handleEditorDidMount}
      />
      <ButtonGroup>
        <Button
          type="button"
          variant="primary"
          disabled={!isEditorReady}
          onClick={() => {
            onCreate(db, JSON.parse(value));
            setUserWantsToLoadAll(true);
          }}
        >
          create
        </Button>
        <Button
          type="button"
          variant="success"
          disabled={!isDirty}
          onClick={() => {
            onModify(db, JSON.parse(value));
            setUserWantsToLoadAll(true);
          }}
        >
          modify [{shortId}]
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={!isEditorReady}
          onClick={() => {
            onDelete(db, JSON.parse(value));
            setUserWantsToLoadAll(true);
          }}
        >
          delete [{shortId}]
        </Button>
      </ButtonGroup>
    </div>
  );
};

function getDifference(a, b) {
  var i = 0;
  var j = 0;
  var result = "";

  while (j < b.length) {
    if (a[i] != b[j] || i == a.length) result += b[j];
    else i++;
    j++;
  }
  return result;
}
