import React from "react";
import { concepts, Concept } from "../utils/data";
import SideConcept from "./SideConcept";

export default () => {
  return (
    <aside>
      <div className="description">INFINITE CONCEPTS</div>
      <div className="nodes">
        {concepts.map((concept: Concept, index: number) => (
          <SideConcept title={concept.title} icon={concept.icon} key={index} />
        ))}
      </div>
    </aside>
  );
};
