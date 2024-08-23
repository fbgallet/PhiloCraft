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

interface Explanation {
  meaning: string;
  example: string;
  interest: string;
  views: {
    support: {
      philosopher: string;
      thesis: string;
      justification: string;
      question: string;
    };
    critic: {
      philosopher: string;
      thesis: string;
      justification: string;
      question: string;
    };
  };
}

export default function DetailsDialog({ isOpen, setIsOpen, nodeData }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDetials, setIsLoadingDetails] = useState<boolean>(true);
  const [explanation, setExplanation] = useState<Explanation>(
    nodeData.explanation
  );
  const [interestIsOpen, setInterestIsOpen] = useState<boolean>(false);
  const [refIsOpen, setRefIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const loadExplanation = async () => {
      if (!explanation) {
        const { data } = await axios.post(
          "http://localhost:3001/concept/explain",
          {
            id: nodeData.conceptId,
            title: nodeData.conceptTitle,
            category: nodeData.category,
            model: nodeData.model,
            step: "basics",
          }
        );
        console.log("explanation basics :>> ", data);
        setExplanation(data);
      }
      setIsLoading(false);
    };

    loadExplanation();
  }, [isOpen]);

  useEffect(() => {
    const loadDetailsExplanation = async () => {
      if (explanation && !explanation.interest) {
        const { data } = await axios.post(
          "http://localhost:3001/concept/explain",
          {
            id: nodeData.conceptId,
            title: nodeData.conceptTitle,
            category: nodeData.category,
            model: nodeData.model,
            step: "details",
          }
        );
        console.log("explanation details :>> ", data);
        setExplanation((prev) => ({ ...prev, ...data }));
      }
      setIsLoadingDetails(false);
    };
    isOpen && !isLoading && loadDetailsExplanation();
  }, [isLoading]);

  const toggleOverlay = useCallback(() => {
    setIsLoading(true);
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
            <h4>Meaning</h4>
            <p>{explanation.meaning}</p>
            <h4>Example</h4>
            <p>{explanation.example}</p>

            <h4
              style={{ cursor: "pointer" }}
              onClick={() => setInterestIsOpen((prev) => !prev)}
            >
              {interestIsOpen ? "−" : "+"} Why is it worth thinking about ?
            </h4>
            <Collapse isOpen={interestIsOpen}>
              {isLoadingDetials ? (
                <InfinitySpinner />
              ) : (
                <p>{explanation?.interest}</p>
              )}
            </Collapse>

            <h4
              style={{ cursor: "pointer" }}
              onClick={() => setRefIsOpen((prev) => !prev)}
            >
              {refIsOpen ? "−" : "+"} Wondering what{" "}
              {explanation?.views?.support.philosopher} and{" "}
              {explanation?.views?.critic.philosopher} think about{" "}
              {nodeData.title} ?
            </h4>
            <Collapse isOpen={refIsOpen}>
              {isLoadingDetials ? (
                <InfinitySpinner />
              ) : (
                <ul>
                  <li>
                    <p>
                      <strong>{explanation.views.support.philosopher}</strong>:{" "}
                      <em>{explanation.views.support.thesis}</em>
                    </p>
                    <p>
                      {explanation.views.support.justification}
                      <br />
                      {explanation.views.support.question}
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>{explanation.views.critic.philosopher}</strong>:{" "}
                      <em>{explanation.views.critic.thesis}</em>
                    </p>
                    <p>
                      {explanation.views.critic.justification}
                      <br />
                      {explanation.views.critic.question}
                    </p>
                  </li>
                </ul>
              )}
            </Collapse>
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
}
