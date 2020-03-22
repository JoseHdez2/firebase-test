import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { RoList, filterItem } from "./thing-list";
import { ThingEditor } from "./thing-editor";
import { MyToggleLinksAdvanced } from "./picker/my-toggle-links";

export const FilterBox = ({ filterStr, setFilterStr }) => (
  <span>
    <span>Filter: </span>
    <input value={filterStr} onChange={ev => setFilterStr(ev.target.value)} />
  </span>
);

// TODO use React context
const ThemeContext = React.createContext("light");

export const ThingApp = ({ db }) => {
  let [filterStr, setFilterStr] = useState("");
  let [selectedCategory, setSelectedCategory] = useState("thing");
  let [selectedId, setSelectedId] = useState(null);
  let [newItem, setNewItem] = useState({});
  let [userWantsToLoadAll, setUserWantsToLoadAll] = useState(true);
  let [things, setThings] = useState([]);
  let [categories, setCategories] = useState(["thing"]);

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
        setCategories(querySnapshot.docs.map(docToName).sort());
      });
  };
  return (
    <Row>
      <Col>
        <Row className="justify-content-sm-center">
          <MyToggleLinksAdvanced
            choices={categories.map(c => ({ name: c, value: c }))}
            choice={selectedCategory}
            setChoice={setSelectedCategory}
            printMethod={c =>
              `${c.name} (${
                things.filter(it => it.type === c.name).length
              })`
            }
          />
        </Row>
        <Row className="justify-content-sm-center">
          <FilterBox filterStr={filterStr} setFilterStr={setFilterStr} />
        </Row>
        <Row>
          <RoList
            items={things}
            filterItems={it => filterItem(it, filterStr, selectedCategory)}
            selectedId={selectedId}
            onClickItem={setSelectedIdAndItem}
          />
        </Row>
      </Col>
      <Col>
        <ThingEditor
          db={db}
          sampleThing={newItem}
          setItem={setNewItem}
          setUserWantsToLoadAll={setUserWantsToLoadAll}
        />
      </Col>
    </Row>
  );
};
