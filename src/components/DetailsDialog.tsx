import {
  Button,
  Collapse,
  Dialog,
  DialogBody,
  setRef,
} from "@blueprintjs/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import InfinitySpinner from "./InfinitySpinner";

export default function DetailsDialog({ isOpen, setIsOpen, nodeData }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [explanation, setExplanation] = useState<[{}]>(nodeData.explanation);
  const [interestIsOpen, setInterestIsOpen] = useState<boolean>(false);
  const [refIsOpen, setRefIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
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
        // console.log("response :>> ", response.data);
        setExplanation([response.data]);
      }
      setIsLoading(false);
    };
    console.log("explanation :>> ", explanation);
    loadExplanation();
  }, [isOpen]);

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
        {isLoading ? (
          <InfinitySpinner />
        ) : (
          <div>
            <p>{explanation[0].meaning}</p>
            <p>{explanation[0].example}</p>
            <br />
            <h4
              style={{ cursor: "pointer" }}
              onClick={() => setInterestIsOpen((prev) => !prev)}
            >
              {interestIsOpen ? "−" : "+"} Why is it worth thinking about ?
            </h4>
            <Collapse isOpen={interestIsOpen}>
              <p>{explanation[0].interest}</p>
            </Collapse>
            <h4
              style={{ cursor: "pointer" }}
              onClick={() => setRefIsOpen((prev) => !prev)}
            >
              {refIsOpen ? "−" : "+"} Wondering what{" "}
              {explanation[0].views?.supportingPhilosopher} and{" "}
              {explanation[0].views?.criticalPhilosopher} think about this{" "}
              {explanation[0].category} ?
            </h4>
            <Collapse isOpen={refIsOpen}>
              <ul>
                <li>
                  <p>{explanation[0].views?.supportingView}</p>
                </li>
                <li>
                  <p>{explanation[0].views?.criticalView}</p>
                </li>
              </ul>
            </Collapse>
          </div>
        )}
        {/* - 1. What does it mean?  
- 2. For example.  
- 3. Why is it worth examining, thinking about, reflecting on?  
- 4. How to put it into practice?  
- 5. What do philosophers say about it? A philosopher who has emphasized it. A critical philosopher.   */}
      </DialogBody>
    </Dialog>
  );
}
