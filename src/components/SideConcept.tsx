import { Concept } from "../utils/data";

const SideConcept = ({ title, icon }: Concept) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeContent: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeContent);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="sideconcept"
      onDragStart={(event) => onDragStart(event, icon + " " + title)}
      draggable
    >
      {icon} {title}
    </div>
  );
};

export default SideConcept;
