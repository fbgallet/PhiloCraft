import SideConcept from "./SideConcept";
import { Concept } from "../data/concept.ts";
import { useState } from "react";
import { FIELDS_LIST, Field, FieldSelect } from "./FieldSelect.tsx";
import { Divider } from "@blueprintjs/core";

export default function SideBar({ basicConcepts, userConcepts }) {
  const [selectedField, setSelectedField] = useState<Field>(FIELDS_LIST[0]);

  return (
    <aside>
      <div className="description">INFINITE CONCEPTS</div>
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
            <SideConcept
              // title={concept.title}
              // icon={concept.icon}
              // _id={concept._id}
              // isNew={concept.isNew}
              {...concept}
              key={index}
            />
          ))}
      </div>
      <Divider />
      <div className="nodes">
        {userConcepts.map((concept: Concept, index: number) => (
          <SideConcept
            // title={concept.title}
            // icon={concept.icon}
            // _id={concept._id}
            // isNew={concept.isNew}
            {...concept}
            key={index}
          />
        ))}
      </div>
    </aside>
  );
}
