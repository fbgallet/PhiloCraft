import {
  Button,
  ControlGroup,
  InputGroup,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";
import { Concept } from "../data/concept";
import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Language } from "../App";

interface SideControlsProps {
  searchQuery: string;
  setSearchQuery: Function;
  userConcepts: Concept[];
  setUserConcepts: Function;
  filter: string;
  setFilter: Function;
  setIsSortChange: Function;
  setVisibleUserConcepts: Function;
  language: Language;
  field: string;
}

const itemsTitle: any = {
  all: {
    EN: "All",
    FR: "Tout",
  },
  com: {
    EN: "Common concepts",
    FR: "Concepts communs",
  },
  pro: {
    EN: "Proprietary concepts",
    FR: "Concepts propriétaires",
  },
  cla: {
    EN: "Classificatory concepts",
    FR: "Concepts classificatoires",
  },
  dis: {
    EN: "Discovered 🎉",
    FR: "Découverts 🎉",
  },
  fie: {
    EN: "Limited to current field 📌",
    FR: "Limité au domaine sélectionné 📌",
  },
};

export default function SideControls({
  searchQuery,
  setSearchQuery,
  userConcepts,
  setUserConcepts,
  filter,
  setFilter,
  setIsSortChange,
  setVisibleUserConcepts,
  language,
  field,
}: SideControlsProps) {
  const [sortOrder, setSortOrder] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const lcField =
    field === "Other fields" ? "general philosophy" : field.toLowerCase();

  useEffect(() => {
    filter.includes("Limit") &&
      setVisibleUserConcepts([
        ...userConcepts.filter((concept: Concept) =>
          concept.field?.includes(lcField)
        ),
      ]);
  }, [field]);

  // TODO
  useEffect(() => {
    if (userConcepts.length) {
      let isToAddToVisibleConcepts = filterTest(
        filter,
        userConcepts[userConcepts.length - 1]
      );
      if (isToAddToVisibleConcepts) {
        if (sortOrder) handleSort(sortOrder);
        else
          setVisibleUserConcepts((prev: Concept[]) => [
            ...prev,
            userConcepts[userConcepts.length - 1],
          ]);
      }
    }
  }, [userConcepts]);

  const getEnglishTitle = (title: string): string => {
    let titleEN = "";

    for (const key in itemsTitle) {
      if (itemsTitle.hasOwnProperty(key)) {
        if (itemsTitle[key][language] === title) {
          titleEN = itemsTitle[key]["EN"];
          break;
        }
      }
    }
    return titleEN;
  };

  const filterTest = (filterTitle: string, concept: Concept) => {
    return filterTitle === "Discovered 🎉"
      ? concept.isNew
      : filterTitle.includes("Limit")
      ? concept.field?.includes(lcField)
      : filterTitle.toLowerCase().includes(concept.category.toLowerCase()) ||
        (filterTitle === "Common concepts" && !concept.category);
  };

  // React.MouseEvent<HTMLElement, MouseEvent>
  const handleFilter = (evt: any) => {
    let title = evt.target.textContent;
    let filterTitle: string =
      language === "EN" ? title : getEnglishTitle(title);
    if (filterTitle === "All") {
      filterTitle = title = "";
    }
    setFilter(title);
    filterTitle &&
      setVisibleUserConcepts([
        ...userConcepts.filter((concept: Concept) =>
          filterTest(filterTitle, concept)
        ),
      ]);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    const sortCallback = (prev: Concept[]) => {
      return [
        ...prev.sort((a: Concept, b: Concept) => {
          switch (order) {
            case "AlphaAsc":
              return a.title.localeCompare(b.title);
            case "AlphaDes":
              return b.title.localeCompare(a.title);
            case "ChronoDes":
              return a.timestamp && b.timestamp ? b.timestamp - a.timestamp : 0;
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
        placeholder={`${language === "EN" ? "Search..." : "Chercher..."} (${
          userConcepts.length
        } concepts)`}
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
              text={itemsTitle.all[language]}
              icon={!filter ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              text={itemsTitle.com[language]}
              icon={filter === itemsTitle.com[language] ? "small-tick" : null}
              //   icon={selectedField.title === field.title ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              text={itemsTitle.pro[language]}
              icon={filter === itemsTitle.pro[language] ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              text={itemsTitle.cla[language]}
              icon={filter === itemsTitle.cla[language] ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              text={itemsTitle.fie[language]}
              icon={filter === itemsTitle.fie[language] ? "small-tick" : null}
              onClick={handleFilter}
            />
            <MenuItem
              text={itemsTitle.dis[language]}
              icon={filter === itemsTitle.dis[language] ? "small-tick" : null}
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
              text="Chronologicaly"
              onClick={() => handleSort("ChronoAsc")}
            />
            <MenuItem
              icon="sort-numerical-desc"
              text="Chronologicaly descending"
              onClick={() => handleSort("ChronoDes")}
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
        language={language}
      />
    </ControlGroup>
  );
}
