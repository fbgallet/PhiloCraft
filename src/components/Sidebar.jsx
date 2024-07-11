import React from "react";

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "être")}
        draggable
      >
        Etre
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "négation")}
        draggable
      >
        Négation
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "identité")}
        draggable
      >
        Identité
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "matière")}
        draggable
      >
        Matière
      </div>
    </aside>
  );
};
