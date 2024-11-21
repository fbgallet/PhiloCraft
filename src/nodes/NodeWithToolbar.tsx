import { NodeToolbar, useReactFlow } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faQuestion,
  faCircleQuestion,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useCallback, useState } from "react";
import DetailsDialog from "../components/DetailsDialog";
import JustifyDialog from "../components/JustifyDialog";
import { Icon, Tooltip } from "@blueprintjs/core";
import { InfinitySpin } from "react-loader-spinner";
import { currentLgg } from "../App";

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
            <Tooltip
              content={
                currentLgg === "EN"
                  ? "Combination logic"
                  : "Logique de la combinaison"
              }
              hoverOpenDelay={400}
              position="top"
              compact={true}
              openOnTargetFocus={false}
            >
              <Icon icon="intersection" size={18} onClick={handleJustify} />
            </Tooltip>
          ) : null}
          {/* <FontAwesomeIcon
          icon={faRightToBracket}
          size="lg"
          onClick={handleJustify}
        /> */}
          <Tooltip
            content={
              currentLgg === "EN"
                ? "Meaning & further exploration"
                : "Signification et réflexion"
            }
            hoverOpenDelay={400}
            position="top"
            compact={true}
            openOnTargetFocus={false}
          >
            <FontAwesomeIcon
              icon={faCircleQuestion}
              size="lg"
              onClick={handleExplain}
            />
          </Tooltip>
          {data.sourceCombination ? (
            <Tooltip
              content={
                currentLgg === "EN"
                  ? "Alternative result"
                  : "Résultat alternatif"
              }
              hoverOpenDelay={400}
              position="top"
              compact={true}
              openOnTargetFocus={false}
            >
              <Icon icon="git-branch" size={18} onClick={handleOther} />
            </Tooltip>
          ) : null}
          <Tooltip
            content={currentLgg === "EN" ? "Delete from canvas" : "Effacer"}
            hoverOpenDelay={400}
            position="top"
            compact={true}
            openOnTargetFocus={false}
          >
            <FontAwesomeIcon icon={faTrash} onClick={handleRemove} />
          </Tooltip>
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
