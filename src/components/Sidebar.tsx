import SideConcept from "./SideConcept";
import { Concept } from "../data/concept.ts";
import { useState } from "react";
import { FIELDS_LIST, Field, FieldSelect } from "./FieldSelect.tsx";
import { Divider } from "@blueprintjs/core";
import SideControls from "./SideControls.tsx";
import { Language } from "../App.tsx";

interface SideBarProps {
  basicConcepts: Concept[];
  userConcepts: Concept[];
  setUserConcepts: Function;
  setIsSortChange: Function;
  insertNewNode: Function;
  language: Language;
}

export default function SideBar({
  basicConcepts,
  userConcepts,
  setUserConcepts,
  setIsSortChange,
  insertNewNode,
  language,
}: SideBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedField, setSelectedField] = useState<Field>(FIELDS_LIST[0]);
  const [filter, setFilter] = useState<string>("");
  const [visibleUserConcepts, setVisibleUserConcepts] =
    useState<Concept[]>(userConcepts);

  return (
    <aside>
      <div>
        <span>
          {language === "EN" ? "Basic concepts of " : "Concepts élémentaires "}
        </span>
        <FieldSelect
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          language={language}
        />
      </div>
      <div className="nodes basic-concepts">
        {basicConcepts
          .filter(
            (concept: Concept) =>
              concept &&
              concept?.field?.length &&
              concept.field[0] === selectedField.title["EN"].toLowerCase()
          )
          .map((concept: Concept, index: number) => (
            <SideConcept
              {...concept}
              insertNewNode={insertNewNode}
              key={index}
            />
          ))}
      </div>
      <Divider />
      <SideControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userConcepts={userConcepts}
        setUserConcepts={setUserConcepts}
        filter={filter}
        setFilter={setFilter}
        setIsSortChange={setIsSortChange}
        setVisibleUserConcepts={setVisibleUserConcepts}
        language={language}
        field={selectedField.title.EN}
      />
      <div className="nodes user-concepts">
        {searchQuery || filter
          ? visibleUserConcepts.map((concept: Concept, index: number) => (
              <SideConcept
                {...concept}
                insertNewNode={insertNewNode}
                key={index}
              />
            ))
          : userConcepts.map((concept: Concept, index: number) => (
              <SideConcept
                {...concept}
                insertNewNode={insertNewNode}
                key={index}
              />
            ))}
      </div>
    </aside>
  );
}
