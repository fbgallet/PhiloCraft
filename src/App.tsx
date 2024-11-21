import type { Edge, Node, OnConnect, Rect, XYPosition } from "@xyflow/react";
import { Menu, MenuItem, Popover, Tooltip } from "@blueprintjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faMoon,
  faSun,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

import { useState, useCallback, MouseEvent, useRef, useEffect } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ColorMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
  Panel,
  ControlButton,
} from "@xyflow/react";
import { isMobile } from "react-device-detect";

import Sidebar from "./components/Sidebar.tsx";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";

import {
  getRandomElement,
  getSplittedConceptAndLogic,
  getStoredBasicConcepts,
  getStoredUserConcepts,
} from "./utils/data.ts";
import axios from "axios";
import { Concept } from "./data/concept.ts";
import { Combination } from "./data/combination.ts";
import Confetti from "./components/Confetti.tsx";
import InfinitySpinner from "./components/InfinitySpinner.tsx";
import HelpDialog from "./components/HelpDialog.tsx";
// import FieldSelect from "./components/FieldSelect.tsx";

interface PendingCombination {
  idsToCombine: [string, string];
  combination: Combination | undefined;
  targetNodeId: string;
  currentLabel: string | undefined;
}

interface AppProps {
  routeLang: string | undefined;
}

export const backendURL =
  import.meta.env.VITE_API_URL ||
  "https://site--philocraft-back--2bhrm4wg9nqn.code.run";
const apiKey = import.meta.env.VITE_API_KEY;

export type Language = "EN" | "FR";
export let currentLgg: string | undefined;

export const headers = {
  headers: {
    "x-api-key": apiKey,
    language: localStorage.language || "EN",
  },
};

let id: number = 1;
export const getId = (): string => `${(id++).toString()}`;

function InfiniteConcepts({ routeLang }: AppProps) {
  const reactFlowWrapper = useRef(null);
  const [colorMode, setColorMode] = useState<ColorMode>(
    localStorage.colorMode || "light"
  );
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [language, setLanguage] = useState<Language>(
    (routeLang
      ? routeLang.toLowerCase() === "fr"
        ? "FR"
        : "EN"
      : localStorage.language) || "EN"
  );
  const [basicConcepts, setBasicConcepts] = useState<Concept[]>(
    getStoredBasicConcepts(language) || []
  );
  const [userConcepts, setUserConcepts] = useState<Concept[]>(
    getStoredUserConcepts(language) || []
  );
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [combinationToCreate, setCombinationToCreate] =
    useState<PendingCombination | null>(null);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState<boolean>(false);
  const [model, setModel] = useState<string>("gpt-4o");
  const [throwConfetti, setThrowConfetti] = useState<boolean>(false);
  const [isSortChange, setIsSortChange] = useState<boolean>(false);
  const [nbOfCombinations, setNbOfCombinations] = useState<number>(0);
  const [nbOfReleasedCombinations, setNbOfReleasedCombinations] =
    useState<number>(0);
  const [nbOfConcepts, setNbOfConcepts] = useState<number>(0);
  const { getIntersectingNodes } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();
  const loadingBasics = useRef(false);
  const flowRef = useRef<HTMLDivElement>(null);

  const fetchCombinations = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${backendURL}/combinations`, headers);
      console.log("combinations from DB:>> ", data);
      if (data) {
        setNbOfCombinations(data.length);
        setNbOfReleasedCombinations(
          data.reduce((sum: number, combination: Combination) => {
            return sum + combination.counter;
          }, 0)
        );
        setCombinations(data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const fetchConcepts = async (): Promise<void> => {
    const getApiKeyOnServer = async () => {
      const response = await fetch("/api.php");
      const data = await response.json();
      return data["VITE_API_KEY"];
    };

    try {
      if (!headers.headers["x-api-key"]) {
        headers.headers["x-api-key"] = await getApiKeyOnServer();
      }
      const basicStored = getStoredBasicConcepts(language);
      if (
        (!basicConcepts.length && !loadingBasics.current) ||
        !basicStored ||
        !basicStored.length
      ) {
        loadingBasics.current = true;
        const { data } = await axios.post(
          `${backendURL}/concepts`,
          {
            onlyBasics: true,
          },
          headers
        );
        console.log("concepts loaded from DB:>> ", data);
        if (data && data.concepts.length) {
          localStorage[`basicConcepts_${language}`] = JSON.stringify(
            data.concepts
          );
          setBasicConcepts(data.concepts);
          setNbOfConcepts(data.conceptsNb);

          //if (!userConcepts.length) setUserConcepts([...data.slice(0, 4)]);
          // console.log("data.slice(0, 4) :>> ", data.slice(0, 4));
        }
      } else {
        const { data } = await axios.post(
          `${backendURL}/concepts`,
          {
            getOnlyNb: true,
          },
          headers
        );
        data && setNbOfConcepts(data.conceptsNb);
      }
      await fetchCombinations();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchConcepts();
    handleBPColorMode();
  }, []);

  useEffect(() => {
    if (!routeLang) localStorage.language = language;
    currentLgg = language;
    headers.headers.language = language;
    const storedBasicConcepts = getStoredBasicConcepts(language);
    console.log("storedBasicConcepts :>> ", storedBasicConcepts);
    setBasicConcepts(storedBasicConcepts || []);
    fetchConcepts();
    setUserConcepts(getStoredUserConcepts(language) || []);
    setNodes(initialNodes);
  }, [language]);

  useEffect(() => {
    const createCombination = async () => {
      let combination: Combination | undefined =
        combinationToCreate?.combination;
      let resultingConcept: string | Concept | undefined;
      let delay = 0;

      if (!combination) {
        const { data } = await axios.post(
          `${backendURL}/combination/create`,
          {
            toCombine: combinationToCreate && [
              combinationToCreate.idsToCombine[0],
              combinationToCreate.idsToCombine[1],
            ],
            model,
          },
          headers
        );
        console.log("data from /combination/create :>> ", data);
        if (data) {
          combination = data.combination;
          if (!combination) return;
          resultingConcept = combination.result;
          // combination.result = resultingConcept._id;
          // }
          if (!resultingConcept || typeof resultingConcept === "string") return;
          resultingConcept.isNew = data.isNewResultingConcept;
          if (resultingConcept.isNew) {
            setThrowConfetti(true);
          }
          if (resultingConcept.isNew) setNbOfConcepts((prev) => ++prev);
          setNbOfCombinations((prev) => ++prev);
          combination && combinations.push(combination);
        }
      } else {
        axios.put(
          `${backendURL}/combination/use/${combination._id}`,
          {},
          headers
        );
        combination.counter++;
        // combination.result?.craftedCounter++;
        const newConceptId =
          typeof combination.result === "string"
            ? combination.result
            : combination.result._id;
        resultingConcept = userConcepts.find(
          (concept) => concept._id === newConceptId
        );
        delay = 500;
        if (!resultingConcept) {
          const { data } = await axios.put(
            `${backendURL}/concept/${newConceptId}`,
            {},
            headers
          );
          const newConcept: Concept = data;
          resultingConcept = newConcept;
          // setUserConcepts((prev) =>
          //   newConcept ? [...prev, newConcept] : prev
          // );
        } else {
          let resultsList = combination.otherResults.concat(
            `${combination.logic} >> ${resultingConcept.title}`
          );
          resultsList = !combinationToCreate?.currentLabel
            ? resultsList
            : resultsList.filter(
                (reslt) =>
                  combinationToCreate?.currentLabel &&
                  !reslt
                    .split(">>")[1]
                    .toLowerCase()
                    .includes(combinationToCreate?.currentLabel.toLowerCase())
              );
          const anotherResult = getRandomElement(resultsList);
          if (anotherResult) {
            const { concept, logic } =
              getSplittedConceptAndLogic(anotherResult);
            if (concept && logic) {
              resultingConcept = userConcepts.find(
                (userCpt) =>
                  userCpt.title.toLowerCase() === concept.toLowerCase()
              );
              if (!resultingConcept) {
                delay = 500;
                const { data } = await axios.post(
                  `${backendURL}/concept/create`,
                  { title: concept, logic },
                  headers
                );
                const newConcept: Concept = data;
                resultingConcept = newConcept;
                if (resultingConcept.craftedCounter === 1) {
                  delay = 0;
                  resultingConcept.isNew = true;
                  setThrowConfetti(true);
                }
                //console.log("resultingConcept :>> ", resultingConcept);
              }
              combination.logic = logic;
            }
          }
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      setNbOfReleasedCombinations((prev) => ++prev);

      setNodes((ns) =>
        ns.map((n) =>
          n.id === combinationToCreate?.targetNodeId &&
          resultingConcept &&
          typeof resultingConcept !== "string"
            ? {
                ...n,
                className: `${resultingConcept.category} ${
                  resultingConcept.isBasic ? "isBasic" : ""
                }`,
                selected: true,
                data: {
                  label: resultingConcept?.icon + " " + resultingConcept?.title,
                  conceptId: resultingConcept?._id,
                  conceptTitle: resultingConcept?.title,
                  alternativeConcepts: combination?.otherResults,
                  logic: [combination?.logic],
                  category: resultingConcept?.category,
                  philosopher: resultingConcept?.philosopher,
                  isNew: resultingConcept?.isNew,
                  sourceCombination: combination,
                  setCombinationToCreate,
                  model,
                },
              }
            : {
                ...n,
                selected: false,
              }
        )
      );

      if (resultingConcept && typeof resultingConcept !== "string") {
        const newConcept: Concept = resultingConcept;
        const existingUserConcept = userConcepts
          .concat(basicConcepts)
          .find((concept) => concept._id === newConcept._id);

        if (existingUserConcept) {
          if (
            existingUserConcept.logic?.length &&
            combination?.logic &&
            !existingUserConcept.logic.includes(combination?.logic)
          )
            existingUserConcept.logic.push(combination.logic);
          setUserConcepts((prev) => [...prev]);
        } else {
          newConcept.logic = [combination?.logic || ""];
          newConcept.timestamp = Date.now();
          setUserConcepts((prev: Concept[]) =>
            newConcept ? [...prev, newConcept] : prev
          );
        }
      }

      setCombinationToCreate(null);
    };
    if (combinationToCreate !== null) {
      createCombination();
    }
  }, [combinationToCreate]);

  useEffect(() => {
    console.log("userConcepts :>> ", userConcepts);
    if (isSortChange) {
      setIsSortChange(false);
      return;
    }
    localStorage[`userConcepts_${language}`] = JSON.stringify(userConcepts);
  }, [userConcepts]);

  useEffect(() => {
    setTimeout(() => {
      setThrowConfetti(false);
    }, 2000);
  }, [throwConfetti]);

  const onColorModeChange = () => {
    let newColorMode: ColorMode = colorMode === "light" ? "dark" : "light";
    localStorage.colorMode = newColorMode;
    handleBPColorMode(newColorMode);
    setColorMode(newColorMode);
  };

  const handleMenu = (evt: MouseEvent) => {
    console.log("evt :>> ", evt);
  };

  const handleBPColorMode = (mode = colorMode) => {
    const body = document.querySelector("body");
    mode === "light"
      ? body?.classList.remove("bp5-dark")
      : body?.classList.add("bp5-dark");
  };

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    []
  );

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeRightClick = (e: MouseEvent, node: Node) => {
    e.preventDefault();
    setNodes((ns) => ns.filter((n) => n.id !== node.id));
  };

  const onNodeDrag = useCallback((_: MouseEvent, node: Node) => {
    const intersections: string[] = getIntersectingNodes(node)
      .slice(0, 1) // only one-to-on intersection
      .map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id)
          ? n.className +
            (n.className?.includes("highlight") ? "" : " highlight")
          : n.className?.replace(" highlight", ""),
      }))
    );
  }, []);

  const onNodeDragStop = useCallback(
    async (_: MouseEvent, node: Node) => {
      const intersections: Node[] = getIntersectingNodes(node);

      // console.log("intersections :>> ", intersections);

      if (intersections.length) {
        combineTwoNodesInOne(node, intersections);
      }
    },
    [userConcepts, combinations]
  );

  // const onPaneClick = async (event: React.MouseEvent): Promise<void> => {
  //   const newWord: string | undefined = await claudeAPImessage(
  //     randomConceptEnPrompt,
  //     false
  //   );
  //   if (!newWord) return;
  //   const position: XYPosition = screenToFlowPosition({
  //     x: event.clientX - 150,
  //     y: event.clientY - 40,
  //   });
  //   const newNode: Node = {
  //     id: getId(),
  //     type: "node-toolbar",
  //     position,
  //     data: {
  //       label: newWord,
  //     },
  //   };

  //   setNodes((nds) => nds.concat(newNode));
  // };

  // external drops
  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      let position: XYPosition = screenToFlowPosition({
        x: event.clientX - 150,
        y: event.clientY - 40,
      });
      const rect: Rect = {
        x: position.x,
        y: position.y,
        width: 150,
        height: 40,
      };

      const intersections: string[] = getIntersectingNodes(rect)
        .slice(0, 1)
        .map((n) => n.id);

      setNodes((ns) =>
        ns.map((n) => ({
          ...n,
          className: intersections.includes(n.id)
            ? n.className +
              (n.className?.includes("highlight") ? "" : " highlight")
            : n.className?.replace(" highlight", ""),
        }))
      );
    },
    [screenToFlowPosition]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      // (event) => {
      event.preventDefault();

      const { conceptId, isBasic } = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );
      // check if the dropped element is valid
      if (typeof conceptId === "undefined" || !conceptId) {
        return;
      }
      const position: XYPosition = screenToFlowPosition({
        x: event.clientX - 80,
        y: event.clientY - 25,
      });
      insertNewNode(conceptId, isBasic, position);
    },
    [screenToFlowPosition, nodes, userConcepts]
  );

  const getExplanationByModel = (
    explanationsArray: [{ model: string; content: {} }],
    model: string
  ) => {
    if (!explanationsArray.length) return undefined;
    const explanationForModel = explanationsArray.find(
      (expl) => expl.model === model
    );
    if (explanationForModel) return explanationForModel.content;
    else return undefined;
  };

  const combineTwoNodesInOne = async (
    droppedNode: Node,
    intersections: Node[]
  ): Promise<void> => {
    const targetNode = intersections[0];

    const droppedConcept: Concept | undefined = basicConcepts
      .concat(userConcepts)
      .find((concept) => concept._id === droppedNode.data.conceptId);
    const targetConcept: Concept | undefined = basicConcepts
      .concat(userConcepts)
      .find((concept) => concept._id === targetNode.data.conceptId);
    if (!droppedConcept || !targetConcept) return;

    droppedConcept.usedCounter++;
    targetConcept.usedCounter++;

    let combination: Combination | undefined = combinations.find(
      (combi) =>
        (combi.combined[0] === droppedConcept._id &&
          combi.combined[1] === targetConcept._id) ||
        (combi.combined[1] === droppedConcept._id &&
          combi.combined[0] === targetConcept._id)
    );

    droppedNode.className = "hidden-node";
    targetNode.className = "hidden-node";
    const newNodeId = getId();

    setCombinationToCreate({
      idsToCombine: [droppedConcept._id, targetConcept._id],
      combination,
      targetNodeId: newNodeId,
      currentLabel: undefined,
    });

    const newNode: Node = {
      id: newNodeId,
      type: "node-toolbar",
      position: {
        x: (droppedNode.position.x + targetNode.position.x) / 2,
        y: (droppedNode.position.y + targetNode.position.y) / 2,
      },
      selected: true,
      data: {
        label: <InfinitySpinner />,
      },
    };

    setNodes((nds) =>
      nds
        .filter((ns) => !(ns.id === droppedNode.id || ns.id === targetNode.id))
        .concat(newNode)
    );
  };

  const insertNewNode = (
    conceptId: string,
    isBasic: boolean,
    position: { x: number; y: number } | undefined
  ) => {
    if (!position) {
      position = getFlowCenterPosition() || { x: 100, y: 100 };
    }
    const droppedConcept: Concept | undefined = isBasic
      ? basicConcepts.find((concept) => concept._id === conceptId)
      : userConcepts.find((concept) => concept._id === conceptId);
    if (!droppedConcept) return;

    const newNode: Node = {
      id: getId(),
      type: "node-toolbar",
      className:
        droppedConcept.category + (droppedConcept.isBasic ? " isBasic" : ""),
      position,
      data: {
        label: `${droppedConcept.icon} ${droppedConcept.title}`,
        conceptId,
        conceptTitle: droppedConcept.title,
        explanation: getExplanationByModel(droppedConcept.explanation, model),
        logic: droppedConcept.logic,
        category: droppedConcept.category,
        philosopher: droppedConcept.philosopher || "",
        model,
      },
      height: 40,
      width: 170,
    };

    console.log("newNode :>> ", newNode);

    setNodes((nds: Node[]) => nds.concat(newNode));

    setTimeout(() => {
      const intersections: Node[] = getIntersectingNodes(newNode);
      if (intersections.length) combineTwoNodesInOne(newNode, intersections);
    }, 20);
  };

  const getFlowCenterPosition = () => {
    if (flowRef.current) {
      const rect = flowRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const position = screenToFlowPosition({
        x: centerX - 70,
        y: centerY - 25,
      });
      return position;
    }
  };

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          ref={flowRef}
          className="intersection-flow"
          colorMode={colorMode}
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeContextMenu={onNodeRightClick}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          // fitView
          selectNodesOnDrag={true}
          // onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <MiniMap pannable position="bottom-right" />
          <Controls showInteractive={false} showZoom={isMobile ? false : true}>
            <Tooltip
              content={
                colorMode === "light"
                  ? language === "EN"
                    ? "Switch to dark mode"
                    : "Mode sombre"
                  : language === "EN"
                  ? "Swith to light mode"
                  : "Mode clair"
              }
              hoverOpenDelay={400}
              position="top"
              compact={true}
              openOnTargetFocus={false}
              disabled={isMobile}
            >
              <ControlButton onClick={onColorModeChange}>
                {colorMode === "light" ? (
                  <FontAwesomeIcon icon={faMoon} />
                ) : (
                  <FontAwesomeIcon icon={faSun} />
                )}
              </ControlButton>
            </Tooltip>
            <Popover
              canEscapeKeyClose
              minimal
              interactionKind="click"
              content={
                <Menu small className="main-menu">
                  <MenuItem
                    text="English"
                    icon={language === "EN" ? "tick" : null}
                    onClick={() => setLanguage("EN")}
                  />
                  <MenuItem
                    text="Français"
                    icon={language === "FR" ? "tick" : null}
                    onClick={() => setLanguage("FR")}
                  />
                </Menu>
              }
            >
              <Tooltip
                content={
                  language === "EN" ? "Language: EN / FR" : "Language: FR / EN"
                }
                hoverOpenDelay={400}
                position="top"
                compact={true}
                openOnTargetFocus={false}
                disabled={isMobile}
              >
                <ControlButton>
                  <FontAwesomeIcon icon={faLanguage} />
                </ControlButton>
              </Tooltip>
            </Popover>
            <Tooltip
              content={
                language === "EN"
                  ? "Info, commands & credits"
                  : "Infos et commandes"
              }
              hoverOpenDelay={400}
              position="top"
              compact={true}
              openOnTargetFocus={false}
              disabled={isMobile}
            >
              <ControlButton>
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  onClick={() => setIsHelpDialogOpen((prev) => !prev)}
                />
              </ControlButton>
            </Tooltip>
          </Controls>
          <Panel position="top-left">
            <a onClick={() => setIsHelpDialogOpen((prev) => !prev)}>
              PHILO🧩CRAFT
            </a>
            <div>
              {nbOfReleasedCombinations}{" "}
              {language === "EN"
                ? "released combinations"
                : "combinaisons effectuées"}
            </div>
            <div>
              {nbOfCombinations}{" "}
              {language === "EN"
                ? "combinations in DB"
                : "combinaisons dans la BD"}
            </div>
            <div>
              {nbOfConcepts}{" "}
              {language === "EN" ? "concepts in DB" : "concepts dans la BD"}
            </div>
          </Panel>
        </ReactFlow>
        <HelpDialog
          isOpen={isHelpDialogOpen}
          setIsOpen={setIsHelpDialogOpen}
          language={language}
        />
      </div>
      {userConcepts ? (
        <Sidebar
          basicConcepts={basicConcepts}
          userConcepts={userConcepts}
          setUserConcepts={setUserConcepts}
          setIsSortChange={setIsSortChange}
          insertNewNode={insertNewNode}
          language={language}
        />
      ) : null}
      {throwConfetti ? <Confetti /> : null}
    </div>
  );
}

export default function App() {
  const { lang } = useParams();
  return (
    <ReactFlowProvider>
      <InfiniteConcepts routeLang={lang} />
    </ReactFlowProvider>
  );
}
