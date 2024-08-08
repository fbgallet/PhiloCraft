import { Concept } from "../data/concept";

const SideConcept = ({ _id, title, icon, isNew }: Concept) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    conceptId: string
  ) => {
    event.dataTransfer.setData("application/reactflow", conceptId);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={"sideconcept" + (isNew ? " sideconcept-new" : "")}
      onDragStart={(event) => onDragStart(event, _id)}
      draggable
    >
      {icon} {title}
      {isNew ? <div className="icon-new">🎉</div> : null}
    </div>
  );
};

export default SideConcept;
