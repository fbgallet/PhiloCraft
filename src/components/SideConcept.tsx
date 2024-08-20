import { Concept } from "../data/concept";

const SideConcept = ({
  _id,
  title,
  icon,
  isBasic,
  logic,
  category,
  field,
  isNew,
}: Concept) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    conceptId: string
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ conceptId, isBasic })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={"sideconcept" + (isNew ? " sideconcept-new" : "")}
      onDragStart={(event) => onDragStart(event, _id)}
      draggable
    >
      <span>{icon}</span>
      <span>{title}</span>
      {isNew ? <div className="icon-new">🎉</div> : null}
    </div>
  );
};

export default SideConcept;
