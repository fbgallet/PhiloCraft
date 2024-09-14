import SideConcept from "./SideConcept";
import { Concept } from "../data/concept.ts";
import { useState } from "react";
import { FIELDS_LIST, Field, FieldSelect } from "./FieldSelect.tsx";
import { Divider } from "@blueprintjs/core";
import SideControls from "./SideControls.tsx";

export default function SideBar({
  basicConcepts,
  userConcepts,
  setUserConcepts,
  setIsSortChange,
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedField, setSelectedField] = useState<Field>(FIELDS_LIST[0]);
  const [filter, setFilter] = useState<string>("");
  const [visibleUserConcepts, setVisibleUserConcepts] =
    useState<Concept[]>(userConcepts);

  return (
    <aside>
      <div>
        <span>Basic concepts of </span>
        <FieldSelect
          selectedField={selectedField}
          setSelectedField={setSelectedField}
        />
      </div>
      <div className="nodes basic-concepts">
        {basicConcepts
          .filter(
            (concept: Concept) =>
              concept.field[0] === selectedField.title.toLowerCase()
          )
          .map((concept: Concept, index: number) => (
            <SideConcept {...concept} key={index} />
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
      />
      <div className="nodes user-concepts">
        {searchQuery || filter
          ? visibleUserConcepts.map((concept: Concept, index: number) => (
              <SideConcept {...concept} key={index} />
            ))
          : userConcepts.map((concept: Concept, index: number) => (
              <SideConcept {...concept} key={index} />
            ))}
      </div>
    </aside>
  );
}
