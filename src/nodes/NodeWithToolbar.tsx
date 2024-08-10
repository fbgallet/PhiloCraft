import { NodeToolbar } from "@xyflow/react";
import axios from "axios";
import { useState } from "react";
import DetailsDialog from "../components/DetailsDialog";

export function NodeWithToolBar({ data }: NodeProps<PositionLoggerNodeData>) {
  const [isExplanationOverlayOpen, setIsExplinationOverlayOpen] =
    useState<boolean>(false);
  const handleExplain = async () => {
    console.log("data :>> ", data);
    setIsExplinationOverlayOpen(true);
  };

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <button onClick={handleExplain}>?</button>
        <button>copy</button>
        <button>paste</button>
      </NodeToolbar>
      <div className="react-flow__node-default">{data?.label}</div>
      <DetailsDialog
        isOpen={isExplanationOverlayOpen}
        setIsOpen={setIsExplinationOverlayOpen}
        nodeData={data}
      />
    </>
  );
}
