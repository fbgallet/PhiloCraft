import { useCallback } from "react";
import { useLongPress } from "use-long-press";

interface SideConcept {
  _id: string;
  title: string;
  icon: string;
  isBasic: boolean;
  isNew: boolean;
  category: string;
  insertNewNode: Function;
}
enum LongPressEventType {
  Mouse = "mouse",
  Touch = "touch",
  Pointer = "pointer",
}

const SideConcept = ({
  _id,
  title,
  icon,
  isBasic,
  isNew,
  category,
  insertNewNode,
}: SideConcept) => {
  const onLongPress = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent | any) => {
      event.preventDefault();
      console.log("Long pressed!", event);

      insertNewNode(_id, isBasic);
    },
    []
  );
  const bind = useLongPress(onLongPress, {
    detect: LongPressEventType.Touch,
  });

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
      className={`sideconcept${isNew ? " sideconcept-new" : ""}${
        isBasic ? " isBasic" : ""
      } ${category}`}
      onDragStart={(event) => onDragStart(event, _id)}
      draggable
      {...bind()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span>{icon}</span>
      <span>{title}</span>
      {isNew ? <div className="icon-new">🎉</div> : null}
    </div>
  );
};

export default SideConcept;
