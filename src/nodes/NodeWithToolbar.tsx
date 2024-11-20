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
import { InfinitySpin } from "react-loader-spinner";

interface NodeWithToolBarProps {
  id: string;
  dragging: boolean;
  data: any;
}

export function NodeWithToolBar({ id, dragging, data }: NodeWithToolBarProps) {
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

  const handleOther = async () => {
    data.setCombinationToCreate({
      idsToCombine: [
        data.sourceCombination.combined[0],
        data.sourceCombination.combined[1],
      ],
      combination: data.sourceCombination,
      targetNodeId: id,
      currentLabel: data.conceptTitle,
    });
    reactFlow.setNodes((ns) =>
      ns.map((n) =>
        n.id !== id ? n : { ...n, data: { icon: "", label: <InfinitySpin /> } }
      )
    );
  };

  const handleRemove = async () => {
    reactFlow.setNodes((ns) => ns.filter((n) => n.id !== id));
  };

  return (
    <>
      {!dragging ? (
        <NodeToolbar
          isVisible={data.forceToolbarVisible || undefined}
          position={data.toolbarPosition}
          align="start"
        >
          {data.logic ? (
            <Icon icon="intersection" size={18} onClick={handleJustify} />
          ) : null}
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

          {data.sourceCombination ? (
            <Icon icon="git-branch" size={18} onClick={handleOther} />
          ) : null}

          <FontAwesomeIcon icon={faTrash} onClick={handleRemove} />
        </NodeToolbar>
      ) : null}
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
