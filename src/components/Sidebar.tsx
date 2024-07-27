import React from "react";
import SideConcept from "./SideConcept";
import { Concept } from "../data/concept.ts";

export default function SideBar({ concepts }) {
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
}
