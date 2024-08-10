import { Button, Dialog, DialogBody } from "@blueprintjs/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import InfinitySpinner from "./InfinitySpinner";

export default function DetailsDialog({ isOpen, setIsOpen, nodeData }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [explanation, setExplanation] = useState<string>(nodeData.explanation);

  useEffect(() => {
    const loadExplanation = async () => {
      if (!explanation.length) {
        console.log("No explication");
        const response = await axios.post(
          "http://localhost:3001/concept/explain",
          {
            id: nodeData.conceptId,
            model: "claude",
          }
        );
        console.log("response :>> ", response.data);
        setExplanation(response.data);
      }
      setIsLoading(false);
    };
    console.log("explanation :>> ", explanation);
    loadExplanation();
  }, []);

  const toggleOverlay = useCallback(() => {
    setIsLoading(false);
    setIsOpen((open) => !open);
  }, [setIsOpen, setIsLoading]);

  return (
    <Dialog
      title={nodeData.label}
      icon={nodeData.icon}
      isOpen={isOpen}
      onClose={toggleOverlay}
    >
      <DialogBody
      // useOverflowScrollContainer={
      //   footerStyle === "minimal" ? false : undefined
      // }
      >
        {isLoading ? <InfinitySpinner /> : <div>{explanation}</div>}
      </DialogBody>
    </Dialog>
  );
}
