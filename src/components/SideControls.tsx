import {
  Button,
  ControlGroup,
  InputGroup,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";
import { Concept } from "../data/concept";
import { ReactPropTypes, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function SideControls({
  searchQuery,
  setSearchQuery,
  userConcepts,
  setUserConcepts,
  filter,
  setFilter,
  setIsSortChange,
  setVisibleUserConcepts,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const handleFilter = (evt) => {
    const value =
      evt.target.textContent === "All" ? "" : evt.target.textContent;
    setFilter(value);
    value &&
      setVisibleUserConcepts([
        ...userConcepts.filter((concept: Concept) =>
          value.includes(
            concept.category ||
              (value === "Ordinary concepts" && !concept.category)
          )
        ),
      ]);
  };

  const handleSort = (order: String) => {
    const sortCallback = (prev: Concept[]) => {
      return [
        ...prev.sort((a: Concept, b: Concept) => {
          switch (order) {
            case "AlphaAsc":
              return a.title.localeCompare(b.title);
            case "AlphaDes":
              return b.title.localeCompare(a.title);
            case "Time":
            default:
              return a.timestamp && b.timestamp ? a.timestamp - b.timestamp : 0;
          }
        }),
      ];
    };
    setIsSortChange(true);
    filter
      ? setVisibleUserConcepts(sortCallback)
      : setUserConcepts(sortCallback);
  };

  const handleClearConcepts = () => {
    setIsConfirmOpen(true);
  };

  const clearUserConcepts = () => {
    setUserConcepts([]);
    setVisibleUserConcepts([]);
  };

  return (
    <ControlGroup fill={true} vertical={false}>
      <InputGroup
        value={searchQuery}
        fill={true}
        type="search"
        placeholder="Search..."
        onChange={(evt) => {
          setSearchQuery(evt.target.value);
          setVisibleUserConcepts([
            ...userConcepts.filter((concept: Concept) =>
              concept.title.toLowerCase().includes(evt.target.value)
            ),
          ]);
        }}
        onBlur={() => {
          setTimeout(() => {
            setSearchQuery("");
            setVisibleUserConcepts([...userConcepts]);
          }, 500);
        }}
      />
      <Popover
        placement="bottom-end"
        minimal={true}
        captureDismiss={true}
        content={
          <Menu>
            <MenuItem
              text="All"
              icon={!filter ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              text="Ordinary concepts"
              icon={filter === "Ordinary concepts" ? "small-tick" : null}
              //   icon={selectedField.title === field.title ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              text="Technical concepts"
              icon={filter === "Technical concepts" ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              icon={filter === "Analytical concepts" ? "small-tick" : null}
              text="Analytical concepts"
              onClick={handleFilter}
            />
            <MenuItem
              text="Classificatory concepts"
              icon={filter === "Classificatory concepts" ? "small-tick" : null}
              onClick={handleFilter}
            />
          </Menu>
        }
      >
        <Button alignText="left" icon="filter" />
      </Popover>
      <Popover
        placement="bottom-end"
        minimal={true}
        content={
          <Menu>
            <MenuItem
              icon="sort-alphabetical"
              text="Alphabeticaly"
              onClick={() => handleSort("AlphaAsc")}
            />
            <MenuItem
              icon="sort-alphabetical-desc"
              text="Alphabeticaly descending"
              onClick={() => handleSort("AlphaDes")}
            />
            <MenuItem
              icon="sort-numerical"
              text="By creation order"
              onClick={() => handleSort("Time")}
            />
          </Menu>
        }
      >
        <Button alignText="left" icon="sort" />
      </Popover>
      <Button small={true} icon="trash" onClick={handleClearConcepts} />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        clearUserConcepts={clearUserConcepts}
      />
    </ControlGroup>
  );
}
