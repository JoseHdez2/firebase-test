import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { RoList, ThingTypeFilterDropdown, filterItem } from "./thing-list";
import { ThingEditor2 } from "./thing-editor";
import { MyToggle } from "./picker/my-toggle";

export const FilterBox = ({ filterStr, setFilterStr }) => (
  <span>
    <span>Filter: </span>
    <input value={filterStr} onChange={ev => setFilterStr(ev.target.value)} />
  </span>
);

const ThemeContext = React.createContext('light');

export const ThingApp = ({ db }) => {
  let [filterStr, setFilterStr] = useState("");
  let [selectedThingType, setSelectedThingType] = useState("thing");
  let [selectedId, setSelectedId] = useState(null);
  let [isAdvancedToggle, setAdvancedToggle] = useState(true);
  let [newItem, setNewItem] = useState({});
  let [userWantsToLoadAll, setUserWantsToLoadAll] = useState(true);
  let [things, setThings] = useState([]);
  let [thingTypes, setThingTypes] = useState(["thing"]);

  useEffect(() => {
    async function doIt() {
      if (userWantsToLoadAll && db != null) {
        loadThingsFromDatabase(db);
        setUserWantsToLoadAll(false);
      }
    }
    doIt();
  }, [db, userWantsToLoadAll, newItem]);

  const setSelectedIdAndItem = item => {
    setSelectedId(item.id);
    setNewItem(item);
  };

  const docToItem = doc => ({ id: doc.id, ...doc.data() });
  const docToName = doc => doc.data().name;

  const loadThingsFromDatabase = async db => {
    console.log("Loading things from database!");
    db.collection("things")
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot.docs.map(doc => doc.data().name).join());
        setThings(querySnapshot.docs.map(docToItem));
      });
    db.collection("things")
      .where("type", "==", "thing-type")
      .get()
      .then(querySnapshot => {
        setThingTypes(querySnapshot.docs.map(docToName));
      });
  };
  return (
    <Row>
      <Col>
        <Row className="justify-content-sm-center">
          <ThingTypeFilterDropdown
            thingTypes={thingTypes}
            selectedThingType={selectedThingType}
            setSelectedThingType={setSelectedThingType}
          />
        </Row>
        <Row className="justify-content-sm-center">
          <FilterBox filterStr={filterStr} setFilterStr={setFilterStr} />
        </Row>
        <Row>
          <RoList
            items={things}
            filterItems={it => filterItem(it, filterStr, selectedThingType)}
            selectedId={selectedId}
            onClickItem={setSelectedIdAndItem}
          />
        </Row>
      </Col>
      <Col>
        <ThingEditor2
          db={db}
          sampleThing={newItem}
          setItem={setNewItem}
          setUserWantsToLoadAll={setUserWantsToLoadAll}
        />
      </Col>
    </Row>
  );
};

// https://twitter.com/JoshWComeau/status/1221608059035963392
function usePersistedState(name, defaultValue) {
  const [value, setValue] = React.useState(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const persistedValue = window.localStorage.getItem(name);

    return persistedValue !== null ? JSON.parse(persistedValue) : defaultValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(name, JSON.stringify(value));
  }, [name, value]);

  return [value, setValue];
}
