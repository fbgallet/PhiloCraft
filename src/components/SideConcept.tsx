import { useCallback, useEffect, useRef, useState } from "react";
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
interface Position {
  x: number;
  y: number;
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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  // const [dataTransfer, setDataTransfer] = useState<SideConcept | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const draggedElementRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setCurrentPosition({
        x: rect.left,
        y: rect.top,
      });
    }
  }, []);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const originalElement = elementRef.current;
    if (originalElement) {
      const rect = originalElement.getBoundingClientRect();
      setIsDragging(true);
      setCurrentPosition({
        x: rect.left,
        y: rect.top,
      });
      draggedElementRef.current = createDraggedElement(originalElement);
      offsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedElementRef.current) return;
    const touch = e.touches[0];
    const newPosition = {
      x: touch.clientX - offsetRef.current.x,
      y: touch.clientY - offsetRef.current.y,
    };
    setCurrentPosition(newPosition);
    Object.assign(draggedElementRef.current.style, {
      left: `${newPosition.x}px`,
      top: `${newPosition.y}px`,
    });
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedElementRef.current) {
      draggedElementRef.current.remove();
      draggedElementRef.current = null;
    }
    const dropZone = document.querySelector(".react-flow");
    // Vérifier chaque zone
    const rect = dropZone?.getBoundingClientRect();
    if (
      rect &&
      currentPosition &&
      currentPosition.x >= rect.left &&
      currentPosition.x <= rect.right &&
      currentPosition.y >= rect.top &&
      currentPosition.y <= rect.bottom
    ) {
      insertNewNode(_id, isBasic, currentPosition);
    }
    setIsDragging(false);
    setCurrentPosition(null);
  };

  // const onLongPress = useCallback(
  //   (event: MouseEvent | TouchEvent | PointerEvent | any) => {
  //     event.preventDefault();
  //     console.log("Long pressed!", event);

  //     insertNewNode(_id, isBasic);
  //   },
  //   []
  // );
  // const bind = useLongPress(onLongPress, {
  //   threshold: 200,
  //   detect: LongPressEventType.Touch,
  // });

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

  const onTouchMove = (
    event: React.TouchEvent<HTMLDivElement>,
    conceptId: string
  ) => {
    // event.dataTransfer.setData(
    //   "application/reactflow",
    //   JSON.stringify({ conceptId, isBasic })
    // );
    // event.dataTransfer.effectAllowed = "move";
  };

  const createDraggedElement = (originalElement: HTMLDivElement) => {
    const clone = originalElement.cloneNode(true) as HTMLDivElement;
    // Appliquer les styles nécessaires
    Object.assign(clone.style, {
      position: "fixed",
      left: `${originalElement.getBoundingClientRect().left}px`,
      top: `${originalElement.getBoundingClientRect().top}px`,
      width: `fit-content`, //`${originalElement.offsetWidth}px`,
      height: `fit-content`, //`${originalElement.offsetHeight}px`,
      pointerEvents: "none",
      // opacity: "0.8",
      zIndex: "1000",
    });
    const asideElt = document.querySelector("aside");
    asideElt && asideElt.appendChild(clone);
    return clone;
  };

  return (
    <div
      className={`sideconcept${isNew ? " sideconcept-new" : ""}${
        isBasic ? " isBasic" : ""
      } ${category}`}
      onDragStart={(event) => onDragStart(event, _id)}
      draggable
      // {...bind()}
      // onTouchMove={(event) => onTouchMove(event, _id)}
      onContextMenu={(event) => event.preventDefault()}
      ref={elementRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        cursor: "grab",
        userSelect: "none",
        touchAction: "none", // Important pour désactiver le scroll/zoom tactile
      }}
    >
      <span>{icon}</span>
      <span>{title}</span>
      {isNew ? <div className="icon-new">🎉</div> : null}
    </div>
  );
};

export default SideConcept;
