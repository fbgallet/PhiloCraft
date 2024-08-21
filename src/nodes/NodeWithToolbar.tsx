import { NodeToolbar, useReactFlow } from "@xyflow/react";
import axios from "axios";
import { useState } from "react";
import DetailsDialog from "../components/DetailsDialog";
import JustifyDialog from "../components/JustifyDialog";

export function NodeWithToolBar({ id, data }: NodeProps) {
  const reactFlow = useReactFlow();
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
    console.log("id :>> ", id);
    reactFlow.setNodes((ns) => ns.filter((n) => n.id !== id));
  };

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
        align={"start"}
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
