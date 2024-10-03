import type { Edge, Node, OnConnect, Rect, XYPosition } from "@xyflow/react";
import { Icon, Menu, MenuItem, Popover } from "@blueprintjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import {
  useState,
  useCallback,
  MouseEvent,
  useRef,
  useEffect,
  StrictMode,
} from "react";
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

import Sidebar from "./components/Sidebar.tsx";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";

import { getStoredBasicConcepts, getStoredUserConcepts } from "./utils/data.ts";
import axios from "axios";
import { Concept } from "./data/concept.ts";
import { Combination } from "./data/combination.ts";
import Confetti from "./components/Confetti.tsx";
import InfinitySpinner from "./components/InfinitySpinner.tsx";
// import FieldSelect from "./components/FieldSelect.tsx";

export const backendURL =
  "https://site--philocraft-back--2bhrm4wg9nqn.code.run";
//const backendURL = "http://localhost:3001/";

export type Language = "EN" | "FR";

const getApiKeyOnServer = async () => {
  const response = await fetch("/api.php");
  const data = await response.json();
  return data.apiKey;
};
const apiKey = import.meta.env.VITE_API_KEY || (await getApiKeyOnServer());
console.log("has apiKey :>> ", apiKey.length);
export const headers = {
  headers: {
    "x-api-key": apiKey,
    language: localStorage.language || "EN",
  },
};

let id: number = 1;
const getId = (): string => `${(id++).toString()}`;

interface PendingCombination {
  idsToCombine: [string, string];
  targetNodeId: string;
}

function InfiniteConcepts() {
  const reactFlowWrapper = useRef(null);
  const [colorMode, setColorMode] = useState<ColorMode>(
    localStorage.colorMode || "light"
  );
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [language, setLanguage] = useState<Language>(
    localStorage.language || "EN"
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
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const [throwConfetti, setThrowConfetti] = useState<boolean>(false);
  const [isSortChange, setIsSortChange] = useState<boolean>(false);
  const [nbOfCombinations, setNbOfCombinations] = useState<number>(0);
  const [nbOfReleasedCombinations, setNbOfReleasedCombinations] =
    useState<number>(0);
  const [nbOfConcepts, setNbOfConcepts] = useState<number>(0);
  const { getIntersectingNodes } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();
  const loadingBasics = useRef(false);

  const fetchCombinations = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${backendURL}/combinations`, headers);
      console.log("combinations from DB:>> ", data);
      if (data) {
        console.log("data.length :>> ", data.length);
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
    try {
      if (!basicConcepts.length && !loadingBasics.current) {
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
    localStorage.language = language;
    headers.headers.language = language;
    const storedBasicConcepts = getStoredBasicConcepts(language);
    if (storedBasicConcepts) setBasicConcepts(storedBasicConcepts);
    else fetchConcepts();
    setUserConcepts(getStoredUserConcepts(language) || []);
    setNodes(initialNodes);
  }, [language]);

  useEffect(() => {
    const createCombination = async () => {
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
        let combination = data.combination;
        let resultingConcept = combination.result;
        combination.result = resultingConcept._id;
        if (!resultingConcept) return;
        resultingConcept.isNew = data.isNewResultingConcept;
        if (resultingConcept.isNew) {
          setThrowConfetti(true);
        }
        setNbOfCombinations((prev) => ++prev);
        combination && combinations.push(combination);
        setNodes((ns) =>
          ns.map((n) =>
            n.id === combinationToCreate?.targetNodeId
              ? {
                  ...n,
                  data: {
                    label: resultingConcept.icon + " " + resultingConcept.title,
                    conceptId: resultingConcept._id,
                    conceptTitle: resultingConcept.title,
                    alternativeConcepts: combination.otherResults,
                    logic: [combination.logic],
                    category: resultingConcept.category,
                    philosopher: resultingConcept.philosopher,
                    isNew: resultingConcept.isNew,
                    model,
                  },
                }
              : n
          )
        );
        // console.log("nodeToUpdate :>> ", nodeToUpdate);

        const existingUserConcept = userConcepts.find(
          (concept) => concept._id === resultingConcept._id
        );

        if (existingUserConcept) {
          existingUserConcept.logic.push(combination.logic);
          setUserConcepts((prev) => [...prev]);
        } else {
          resultingConcept.logic = [combination.logic];
          resultingConcept.timestamp = Date.now();
          setUserConcepts((prev) =>
            combination ? [...prev, resultingConcept] : prev
          );
          // resultingConcept &&
          //   (localStorage.userConcepts = JSON.stringify(
          //     userConcepts.concat(resultingConcept)
          //   ));
        }
      }
      // setNodes((ns) => [...ns]);
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

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeRightClick = (e: MouseEvent, node: Node) => {
    e.preventDefault();
    console.log("e :>> ", e);
    console.log("node :>> ", node);
    setNodes((ns) => ns.filter((n) => n.id !== node.id));
  };

  const onNodeDrag = useCallback((_: MouseEvent, node: Node) => {
    const intersections: string[] = getIntersectingNodes(node)
      .slice(0, 1) // only one-to-on intersection
      .map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? "highlight" : "",
      }))
    );
  }, []);

  const onNodeDragStop = useCallback(
    async (_: MouseEvent, node: Node) => {
      const intersections: Node[] = getIntersectingNodes(node);

      console.log("node :>> ", node);
      console.log("intersections :>> ", intersections);

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
          className: intersections.includes(n.id) ? "highlight" : "",
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

      const droppedConcept: Concept | undefined = isBasic
        ? basicConcepts.find((concept) => concept._id === conceptId)
        : userConcepts.find((concept) => concept._id === conceptId);
      if (!droppedConcept) return;

      console.log("droppedConcept :>> ", droppedConcept);

      const position: XYPosition = screenToFlowPosition({
        x: event.clientX - 80,
        y: event.clientY - 25,
      });
      const newNode: Node = {
        id: getId(),
        type: "node-toolbar",
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
        width: 173,
      };

      setNodes((nds) => nds.concat(newNode));

      setTimeout(() => {
        const intersections: Node[] = getIntersectingNodes(newNode);
        if (intersections.length) combineTwoNodesInOne(newNode, intersections);
      }, 20);
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
    let resultingConcept: Concept | undefined;
    const targetNode = intersections[0];

    const droppedConcept: Concept | undefined = basicConcepts
      .concat(userConcepts)
      .find((concept) => concept._id === droppedNode.data.conceptId);
    const targetConcept: Concept | undefined = basicConcepts
      .concat(userConcepts)
      .find((concept) => concept._id === targetNode.data.conceptId);
    if (!droppedConcept || !targetConcept) return;

    setNbOfReleasedCombinations((prev) => ++prev);
    droppedConcept.usedCounter++;
    targetConcept.usedCounter++;

    let combination: Combination | undefined = combinations.find(
      (combi) =>
        combi.combined[0] === droppedConcept._id &&
        combi.combined[1] === targetConcept._id
    );
    console.log("existing combination :>> ", combination);

    droppedNode.className = "hidden-node";
    targetNode.className = "hidden-node";
    const newNodeId = getId();

    if (!combination) {
      setCombinationToCreate({
        idsToCombine: [droppedConcept._id, targetConcept._id],
        targetNodeId: newNodeId,
      });
    } else {
      axios.put(
        `${backendURL}/combination/use/${combination._id}`,
        {},
        headers
      );
      combination.counter++;
      // combination.result?.craftedCounter++;
      resultingConcept = userConcepts.find(
        (concept) => concept._id === combination?.result
      );
      if (!resultingConcept) {
        const { data } = await axios.put(
          `${backendURL}/concept/${combination.result}`,
          {},
          headers
        );
        resultingConcept = data;
        setUserConcepts((prev) =>
          resultingConcept ? [...prev, resultingConcept] : prev
        );
      }
    }

    const newNode: Node = {
      id: newNodeId,
      type: "node-toolbar",
      position: {
        x: (droppedNode.position.x + targetNode.position.x) / 2,
        y: (droppedNode.position.y + targetNode.position.y) / 2,
      },
      data: {
        label: resultingConcept ? (
          resultingConcept.icon + " " + resultingConcept.title
        ) : (
          <InfinitySpinner />
        ),
        conceptId: resultingConcept && resultingConcept._id,
        conceptTitle: resultingConcept && resultingConcept.title,
        category: resultingConcept && resultingConcept.category,
        logic: combination ? combination.logic : [],
        isNew: resultingConcept && resultingConcept.isNew,
        model,
      },
    };
    console.log("newNode :>> ", newNode);

    setNodes((nds) =>
      nds
        .filter((ns) => !(ns.id === droppedNode.id || ns.id === targetNode.id))
        .concat(newNode)
    );
  };

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
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
          selectNodesOnDrag={false}
          // onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <MiniMap pannable position="bottom-right" />
          <Controls showInteractive={false}>
            <ControlButton onClick={onColorModeChange}>
              {colorMode === "light" ? (
                <FontAwesomeIcon icon={faMoon} />
              ) : (
                <FontAwesomeIcon icon={faSun} />
              )}
            </ControlButton>

            <Popover
              canEscapeKeyClose
              minimal
              interactionKind="click"
              content={
                <Menu small className="main-menu">
                  <MenuItem text="Language">
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
                  </MenuItem>
                </Menu>
              }
            >
              <ControlButton>
                <FontAwesomeIcon icon={faBars} />
              </ControlButton>
            </Popover>
          </Controls>
          <Panel position="top-left">
            <p>PHILO🧩CRAFT</p>
            <div>{nbOfReleasedCombinations} released combinations</div>
            <div>{nbOfCombinations} combinations in DB</div>
            <div>{nbOfConcepts} concepts in DB</div>
          </Panel>
        </ReactFlow>
      </div>
      {userConcepts ? (
        <Sidebar
          basicConcepts={basicConcepts}
          userConcepts={userConcepts}
          setUserConcepts={setUserConcepts}
          setIsSortChange={setIsSortChange}
          language={language}
        />
      ) : null}
      {throwConfetti ? <Confetti /> : null}
    </div>
  );
}

export default function App() {
  return (
    <StrictMode>
      <ReactFlowProvider>
        <InfiniteConcepts />
      </ReactFlowProvider>
    </StrictMode>
  );
}
