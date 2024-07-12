const SideConcept = ({ title, icon }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
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
