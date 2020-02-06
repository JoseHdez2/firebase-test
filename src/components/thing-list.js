import React from "react";
import { Badge, Dropdown, DropdownButton, ListGroup } from "react-bootstrap";

export const filterItem = (item, filterStr) => {
  let filStr = filterStr.toLowerCase();
  return (
    (item.name || "").toLowerCase().includes(filStr) ||
    (item.tags || []).some(tag => tag.toLowerCase().includes(filStr))
  );
};

export const RoList = ({
  items,
  thingTypes,
  selectedThingType,
  setSelectedThingType,
  filterItems,
  selectedId,
  onClickItem
}) => (
  <div>
    <FilteredAndTotalItemCount items={items} filterItems={filterItems} />
    {items.length > 0 ? "" : <p>No items?</p>}
    <ListGroup>
      {items.filter(filterItems).map(it => (
        <RoItem
          key={it.id}
          item={it}
          isSelected={it.id === selectedId}
          onClickItem={onClickItem}
        />
      ))}
    </ListGroup>
  </div>
);

export const ThingTypeFilterDropdown = ({
  thingTypes,
  selectedThingType,
  setSelectedThingType
}) => (
  <DropdownButton title={selectedThingType}>
    {thingTypes.map(t => (
      <Dropdown.Item onClick={() => setSelectedThingType(t)}>{t}</Dropdown.Item>
    ))}
  </DropdownButton>
);

// TODO maybe filtering again isn't a good idea, should just pass the counts?
export const FilteredAndTotalItemCount = ({ items, filterItems }) => (
  <span>
    <Badge variant="warning">{items.filter(filterItems).length}</Badge>
    <small> out of</small>
    <Badge>{items.length}</Badge>
    <small>total</small>
  </span>
);

export const RoItem = ({
  item,
  onClickItem,
  isSelected = false,
  showTags = true,
  displayName = item.name || item.id || "Undefined"
}) => (
  <ListGroup.Item key={item.id} onClick={() => onClickItem(item)}>
    <RoItemTypeTag type={item.type} />
    {isSelected ? <b>{displayName}</b> : displayName}{" "}
    <RoItemTags tags={item.tags} />
  </ListGroup.Item>
);

const RoItemTypeTag = ({ type }) => (type ? <Badge>{type}</Badge> : "");

export const RoItemTags = ({ tags, showTags = true }) => (
  <span>
    {!showTags ? (
      <span />
    ) : (
      (tags || []).map(tag => (
        <Badge key={tag} variant="secondary" style={{ marginRight: "2px" }}>
          {tag}
        </Badge>
      ))
    )}
  </span>
);
