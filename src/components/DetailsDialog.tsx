import { Collapse, Dialog, DialogBody } from "@blueprintjs/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import InfinitySpinner from "./InfinitySpinner";
import { headers } from "../App";

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

interface DetailsDialogProps {
  isOpen: boolean;
  setIsOpen: Function;
  nodeData: any;
}

const dialogTitles = {
  meaning: {
    EN: "Meaning",
    FR: "Signification",
  },
  example: {
    EN: "Example",
    FR: "Exemple",
  },
  interest: {
    EN: "Why is it worth thinking about ?",
    FR: "Pourquoi ça vaut la peine d'y réfléchir ?",
  },
  views: {
    EN: ["Wondering what ", " and ", " think about this concept ?"],
    FR: [
      "Curieux d'apprendre ce que ",
      " et ",
      " pensent au sujet de ce concept ?",
    ],
  },
};

type Language = "EN" | "FR";

export default function DetailsDialog({
  isOpen,
  setIsOpen,
  nodeData,
}: DetailsDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDetials, setIsLoadingDetails] = useState<boolean>(true);
  const [explanation, setExplanation] = useState<Explanation>(
    nodeData.explanation
  );
  const [interestIsOpen, setInterestIsOpen] = useState<boolean>(false);
  const [refIsOpen, setRefIsOpen] = useState<boolean>(false);
  const language: Language = headers.headers.language;

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
            philosopher: nodeData.philosopher,
            model: nodeData.model,
            step: "basics",
          },
          headers
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
            philosopher: nodeData.philosopher,
            model: nodeData.model,
            step: "details",
          },
          headers
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
    setIsOpen((open: boolean) => !open);
  }, [setIsOpen, setIsLoading]);

  return (
    <Dialog
      title={`${nodeData.label} (${
        nodeData.category?.toLowerCase() === "proprietary"
          ? nodeData.philosopher
          : nodeData.category + " concept"
      })`}
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
            <h4>{dialogTitles.meaning[language]}</h4>
            <p>{explanation.meaning}</p>
            <h4>{dialogTitles.example[language]}</h4>
            <p>{explanation.example}</p>

            <h4
              style={{ cursor: "pointer" }}
              onClick={() => setInterestIsOpen((prev) => !prev)}
            >
              {interestIsOpen ? "−" : "+"} {dialogTitles.interest[language]}
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
              {refIsOpen ? "− " : "+ "}
              {dialogTitles.views[language][0]}
              {explanation?.views?.support.philosopher}
              {dialogTitles.views[language][1]}
              {explanation?.views?.critic.philosopher}
              {dialogTitles.views[language][2]}
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
