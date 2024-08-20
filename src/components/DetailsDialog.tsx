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
  const [explanation, setExplanation] = useState<{}>(nodeData.explanation);
  const [interestIsOpen, setInterestIsOpen] = useState<boolean>(false);
  const [refIsOpen, setRefIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    console.log("nodeData :>> ", nodeData);
    const loadExplanation = async () => {
      if (!explanation) {
        console.log("No explication");
        const response = await axios.post(
          "http://localhost:3001/concept/explain",
          {
            id: nodeData.conceptId,
            title: nodeData.conceptTitle,
            category: nodeData.category,
            model: nodeData.model,
          }
        );
        //console.log("response :>> ", response.data);
        setExplanation(response.data);
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
      title={`${nodeData.label} (${nodeData.category} concept)`}
      // icon={nodeData.icon}
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
            <p>{explanation.meaning}</p>
            <p>{explanation.example}</p>
            <br />
            {explanation.interest ? (
              <>
                <h4
                  style={{ cursor: "pointer" }}
                  onClick={() => setInterestIsOpen((prev) => !prev)}
                >
                  {interestIsOpen ? "−" : "+"} Why is it worth thinking about ?
                </h4>
                <Collapse isOpen={interestIsOpen}>
                  <p>{explanation.interest}</p>
                </Collapse>
              </>
            ) : null}
            {explanation.views?.supportingPhilosopher ? (
              <>
                <h4
                  style={{ cursor: "pointer" }}
                  onClick={() => setRefIsOpen((prev) => !prev)}
                >
                  {refIsOpen ? "−" : "+"} Wondering what{" "}
                  {explanation.views?.supportingPhilosopher} and{" "}
                  {explanation.views?.criticalPhilosopher} think about{" "}
                  {nodeData.title} ?
                </h4>
                <Collapse isOpen={refIsOpen}>
                  <ul>
                    <li>
                      <p>{explanation.views?.supportingView}</p>
                    </li>
                    <li>
                      <p>{explanation.views?.criticalView}</p>
                    </li>
                  </ul>
                </Collapse>
              </>
            ) : null}
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
