//-----------------------
// FIREBASE: CREATE
//-----------------------

export const apiCreateItem = (db, item, collectionName = "things") => {
  console.log(
    `db:${db}, collectionName:${collectionName}, item:${JSON.stringify(item)}`
  );
  const { id, deletedOn, ...restOfItem } = item;
  db.collection(collectionName)
    .add(restOfItem)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
};

//-----------------------
// FIREBASE: READ
//-----------------------

const docToItem = doc => ({ id: doc.id, ...doc.data() });
const docToName = doc => doc.data().name;

export const apiReadItems = async db => {
  console.log("Loading things from database!");
  db.collection("things")
    .get()
    .then(querySnapshot => {
      return querySnapshot.docs.map(docToItem);
    });
};

export const apiReadCategories = async db => {
  db.collection("things")
    .where("type", "==", "thing-type")
    .get()
    .then(querySnapshot => {
      return querySnapshot.docs.map(docToName).sort();
    });
};

//-----------------------
// FIREBASE: UPDATE
//-----------------------

export const apiUpdateItem = (db, item, collectionName = "things") => {
  console.dir(db);
  console.log(`db:${db.keys}, collectionName:${collectionName}, id:${item.id}`);
  const { id, meta, ...restOfItem } = item;
  let newMeta = { lastUpdatedOn: Date(), ...meta };
  // TODO the line above will remove deletedOn attribute from doc...
  db.collection(collectionName)
    .doc(id)
    .set({ meta: newMeta, ...restOfItem });
};

//-----------------------
// FIREBASE: DELETE
//-----------------------

export const apiDeleteItem = (db, item, collectionName = "things") => {
  const { id, ...restOfItem } = item;
  db.collection(collectionName)
    .doc(id)
    .delete();
};

export const apiLogicalDeleteItem = (db, item, collectionName = "things") => {
  const { id, meta, ...restOfItem } = item;
  db.collection(collectionName)
    .doc(id)
    .set({
      deletedOn: new Date(),
      ...restOfItem
    });
};
