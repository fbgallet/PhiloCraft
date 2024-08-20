import { Collapse, Dialog, DialogBody } from "@blueprintjs/core";
// import axios from "axios";
import { useCallback, useEffect, useState } from "react";
// import InfinitySpinner from "./InfinitySpinner";

export default function JustifyDialog({ isOpen, setIsOpen, nodeData }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   if (!isOpen) return;
  //   console.log("nodeData :>> ", nodeData);
  //   const loadExplanation = async () => {
  //     if (!explanation) {
  //       console.log("No explication");
  //       const response = await axios.post(
  //         "http://localhost:3001/concept/explain",
  //         {
  //           id: nodeData.conceptId,
  //           title: nodeData.conceptTitle,
  //           category: nodeData.category,
  //           model: nodeData.model,
  //         }
  //       );
  //       //console.log("response :>> ", response.data);
  //       setExplanation(response.data);
  //     }
  //     setIsLoading(false);
  //   };
  //   console.log("explanation :>> ", explanation);
  //   loadExplanation();
  // }, [isOpen]);

  const toggleOverlay = useCallback(() => {
    setIsLoading(false);
    setIsOpen((open) => !open);
  }, [setIsOpen, setIsLoading]);

  return (
    <Dialog
      title={`${nodeData.label} (${nodeData.category} concept)`}
      // icon={nodeData.icon}
      isOpen={isOpen}
      onClose={toggleOverlay}
    >
      <DialogBody>{isOpen && nodeData.logic}</DialogBody>
    </Dialog>
  );
}
