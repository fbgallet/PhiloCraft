import { NodeToolbar } from "@xyflow/react";
import axios from "axios";
import { useState } from "react";
import DetailsDialog from "../components/DetailsDialog";
import JustifyDialog from "../components/JustifyDialog";

export function NodeWithToolBar({ data }: NodeProps<PositionLoggerNodeData>) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] =
    useState<boolean>(false);
  const [isJustifyDialogOpen, setIsJustifyDialogOpen] =
    useState<boolean>(false);

  const handleJustify = async () => {
    setIsJustifyDialogOpen(true);
  };

  const handleExplain = async () => {
    setIsDetailsDialogOpen(true);
  };

  const handleRemove = async () => {
    console.log("data :>> ", data);
  };

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <button onClick={handleJustify}>🔀</button>
        <button onClick={handleExplain}>ℹ️</button>
        <button onClick={handleRemove}>❌</button>
      </NodeToolbar>
      <div className="react-flow__node-default">{data?.label}</div>
      <DetailsDialog
        isOpen={isDetailsDialogOpen}
        setIsOpen={setIsDetailsDialogOpen}
        nodeData={data}
      />
      <JustifyDialog
        isOpen={isJustifyDialogOpen}
        setIsOpen={setIsJustifyDialogOpen}
        nodeData={data}
      />
    </>
  );
}
