import Editor from "@monaco-editor/react";
import { Button, ButtonGroup } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { apiCreateItem, apiUpdateItem, apiDeleteItem } from "./api";
import { BooleanToggle } from "./picker/my-toggle";

export const ThingEditor2 = ({
  sampleThing,
  selectedId,
  db,
  setUserWantsToLoadAll,
  onCreate = apiCreateItem,
  onModify = apiUpdateItem,
  onDelete = apiDeleteItem
}) => {
  const [isMonacoEditor, setIsMonacoEditor] = useState(false);
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
    if (isMonacoEditor) {
      setValue(editorRef.current.getValue());
    } else {
    }

    if (isNewSampleThing) {
      alert("is new sample thing");
      // sampleThing (and value) was changed from above; reset dirty flag.
      setDirty(false);
      // console.log("now clean!");
      setIsNewSampleThing(false); // consume "event"
    } else if (!isDirty && !isNewSampleThing) {
      // value was now changed by editor
      console.log("now dirty");
      setDirty(true);
      if (sampleThingStr !== value) {
        // console.log(getDifference(sampleThingStr, value));
        // console.log(`sampleThingStr: ${sampleThingStr}`);
        // console.log(`value: ${value}`);
        setDirty(true);
        // console.log("now dirty!");
      }
    }
  }, [
    isMonacoEditor,
    isEditorReady,
    isDirty,
    isNewSampleThing,
    sampleThingStr,
    value
  ]);

  useEffect(() => {
    setShortId((sampleThing.id || shortId).replace(/(.{3}).*(.{3})/, "$1..$2"));
  }, [shortId, sampleThing.id]);

  useEffect(() => {
    // console.log("[thing-editor] sampleThing --> sampleThingStr");
    setSampleThingStr(sampleThingToStr(sampleThing).trim());
  }, [sampleThing]);

  useEffect(() => {
    // console.log("[thing-editor] sampleThingStr --> value");
    setValue(sampleThingStr);
  }, [sampleThingStr]);

  function handleEditorDidMount(_valueGetter, editor) {
    setIsEditorReady(true);
    editorRef.current = editor;
    // listen to editor changes.
    editorRef.current.onDidChangeModelContent(ev => {
      setValue(editorRef.current.getValue());
    });
  }

  const sampleThingToStr = sampleThing =>
    JSON.stringify(sampleThing, null, "  ");

  const onClickCreate = () => {
    onCreate(db, JSON.parse(value));
    setUserWantsToLoadAll(true);
  };

  const onClickUpdate = () => {
    onModify(db, JSON.parse(value));
    setUserWantsToLoadAll(true);
  };

  const onClickDelete = () => {
    onDelete(db, JSON.parse(value));
    setUserWantsToLoadAll(true);
  };

  return (
    <div>
      {/* <span>Monaco Editor:</span> */}
      {/* <BooleanToggle choice={isMonacoEditor} setChoice={setIsMonacoEditor} /> */}
      {isMonacoEditor ? (
        <Editor
          height={"40vh"}
          language="json"
          theme="dark"
          value={sampleThingStr} // should be "value"
          editorDidMount={handleEditorDidMount}
        />
      ) : (
        <textarea
          onInput={ev => setValue(ev.target.value)}
          style={{ width: "100%", height: "40vh" }}
          value={value}
        />
      )}
      <MyCoolButtons
        shortId={shortId}
        isMonacoEditor={isMonacoEditor}
        isDirty={isDirty}
        onClickCreate={onClickCreate}
        onClickUpdate={onClickUpdate}
        onClickDelete={onClickDelete}
      />
      {value}
    </div>
  );
};

const MyCoolButtons = ({
  shortId,
  isMonacoEditor,
  isEditorReady,
  isDirty,
  onClickCreate,
  onClickUpdate,
  onClickDelete
}) => (
  <ButtonGroup>
    <Button
      type="button"
      variant="primary"
      disabled={isMonacoEditor && !isEditorReady}
      onClick={onClickCreate}
    >
      create
    </Button>
    <Button
      type="button"
      variant="success"
      disabled={isMonacoEditor && (!isEditorReady || !isDirty)}
      onClick={onClickUpdate}
    >
      modify [{shortId}]
    </Button>
    <Button
      type="button"
      variant="danger"
      disabled={isMonacoEditor && !isEditorReady}
      onClick={onClickDelete}
    >
      delete [{shortId}]
    </Button>
  </ButtonGroup>
);

function getDifference(a, b) {
  var i = 0;
  var j = 0;
  var result = "";

  while (j < b.length) {
    if (a[i] !== b[j] || i === a.length) result += b[j];
    else i++;
    j++;
  }
  return result;
}
