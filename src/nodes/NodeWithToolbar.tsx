import { NodeToolbar, useReactFlow } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faQuestion,
  faCircleQuestion,
  faRightToBracket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useCallback, useState } from "react";
import DetailsDialog from "../components/DetailsDialog";
import JustifyDialog from "../components/JustifyDialog";
import { Icon } from "@blueprintjs/core";

interface NodeWithToolBarProps {
  id: string;
  data: any;
}

export function NodeWithToolBar({ id, data }: NodeWithToolBarProps) {
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
        align="start"
      >
        <Icon icon="intersection" size={18} onClick={handleJustify} />
        {/* <FontAwesomeIcon
          icon={faRightToBracket}
          size="lg"
          onClick={handleJustify}
        /> */}

        <FontAwesomeIcon
          icon={faCircleQuestion}
          size="lg"
          onClick={handleExplain}
        />

        <FontAwesomeIcon icon={faTrash} onClick={handleRemove} />
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
