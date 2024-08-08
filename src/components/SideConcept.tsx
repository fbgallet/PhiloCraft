import { Concept } from "../data/concept";

const SideConcept = ({ _id, title, icon }: Concept) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    conceptId: string
  ) => {
    event.dataTransfer.setData("application/reactflow", conceptId);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="sideconcept"
      onDragStart={(event) => onDragStart(event, _id)}
      draggable
    >
      {icon} {title}
    </div>
  );
};

export default SideConcept;
