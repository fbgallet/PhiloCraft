import SideConcept from "./SideConcept";
import { Concept } from "../data/concept.ts";

export default function SideBar({ concepts }) {
  return (
    <aside>
      <div className="description">INFINITE CONCEPTS</div>
      <div className="nodes">
        {concepts.map((concept: Concept, index: number) => (
          <SideConcept
            title={concept.title}
            icon={concept.icon}
            _id={concept._id}
            key={index}
          />
        ))}
      </div>
    </aside>
  );
}
