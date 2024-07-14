import React from "react";
import { concepts } from "../utils/data";
import SideConcept from "./SideConcept";

export default () => {
  return (
    <aside>
      <div className="description">INFINITE CONCEPTS</div>
      <div className="nodes">
        {concepts.map((concept, index) => (
          <SideConcept title={concept.title} icon={concept.icon} key={index} />
        ))}
      </div>
    </aside>
  );
};
