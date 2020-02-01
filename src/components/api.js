//-----------------------
// FIREBASE API METHODS
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

export const apiUpdateItem = (db, item, collectionName = "things") => {
  console.dir(db);
  console.log(`db:${db.keys}, collectionName:${collectionName}, id:${item.id}`);
  const { id, deletedOn, ...restOfItem } = item;
  // TODO the line above will remove deletedOn attribute from doc...
  db.collection(collectionName)
    .doc(id)
    .set(restOfItem);
};

export const apiDeleteItem = (db, item, collectionName = "things") => {
  const { id, ...restOfItem } = item;
  db.collection(collectionName)
    .doc(id)
    .delete();
};

export const apiDeleteItemGalaxyBrain = (
  db,
  item,
  collectionName = "things"
) => {
  const { id, ...restOfItem } = item;
  db.collection(collectionName)
    .doc(id)
    .set({
      deletedOn: new Date(),
      ...restOfItem
    });
};
