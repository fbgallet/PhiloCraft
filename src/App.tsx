import type { Edge, Node, OnConnect, Rect, XYPosition } from "@xyflow/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

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

import Sidebar from "./components/Sidebar.tsx";
import { randomConceptEnPrompt } from "./ai/prompts.ts";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { claudeAPImessage } from "./ai/api-requets";
import {
  addToExistingConcepts,
  combinationsDB,
  ConceptsCombination,
  getStoredUserconcepts,
} from "./utils/data.ts";
import axios from "axios";
import { Concept, initialConcepts } from "./data/concept.ts";
import { Combination } from "./data/combination.ts";
import Confetti from "./components/Confetti.tsx";
import DetailsOverlay from "./components/DetailsDialog.tsx";
import InfinitySpinner from "./components/InfinitySpinner.tsx";

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
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [userConcepts, setUserConcepts] = useState<Concept[]>(
    getStoredUserconcepts() || []
  );
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [combinationToCreate, setCombinationToCreate] =
    useState<PendingCombination | null>(null);
  const [throwConfetti, setThrowConfetti] = useState<boolean>(false);
  const { getIntersectingNodes } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    const fetchConcepts = async (): Promise<void> => {
      try {
        const { data } = await axios.get("http://localhost:3001/concepts");
        console.log("concepts loaded from DB:>> ", data);
        if (data) {
          setConcepts(data);
          if (!userConcepts.length) setUserConcepts([...data.slice(0, 4)]);
          // console.log("data.slice(0, 4) :>> ", data.slice(0, 4));
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    const fetchCombinations = async (): Promise<void> => {
      try {
        const { data } = await axios.get("http://localhost:3001/combinations");
        console.log("combinations from DB:>> ", data);
        if (data) setCombinations(data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchConcepts();
    fetchCombinations();
  }, []);

  useEffect(() => {
    const createCombination = async () => {
      const { data } = await axios.post(
        "http://localhost:3001/combination/create",
        {
          toCombine: combinationToCreate && [
            combinationToCreate.idsToCombine[0],
            combinationToCreate.idsToCombine[1],
          ],
        }
      );
      console.log("data :>> ", data);
      if (data) {
        let combination = data.combination;
        let resultingConcept = combination.result;
        resultingConcept.isNew = data.isNewResultingConcept;
        if (resultingConcept.isNew) {
          setThrowConfetti(true);
        }
        combination && combinations.push(combination);
        setNodes((ns) =>
          ns.map((n) =>
            n.id === combinationToCreate?.targetNodeId
              ? {
                  ...n,
                  data: {
                    label: resultingConcept.icon + " " + resultingConcept.title,
                    conceptId: resultingConcept._id,
                    isNew: resultingConcept.isNew,
                  },
                }
              : n
          )
        );
        // console.log("nodeToUpdate :>> ", nodeToUpdate);

        if (
          !userConcepts.find((concept) => concept._id === resultingConcept._id)
        ) {
          setUserConcepts((prev) =>
            combination ? [...prev, resultingConcept] : prev
          );
          resultingConcept &&
            (localStorage.userConcepts = JSON.stringify(
              userConcepts.concat(resultingConcept)
            ));
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
    setTimeout(() => {
      setThrowConfetti(false);
    }, 2000);
  }, [throwConfetti]);

  const onColorModeChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
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

      const conceptId: string | undefined = event.dataTransfer.getData(
        "application/reactflow"
      );
      // check if the dropped element is valid
      if (typeof conceptId === "undefined" || !conceptId) {
        return;
      }

      const droppedConcept: Concept | undefined = userConcepts.find(
        (concept) => concept._id === conceptId
      );
      if (!droppedConcept) return;

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
          explanation: droppedConcept.explanation,
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

  const combineTwoNodesInOne = async (
    droppedNode: Node,
    intersections: Node[]
  ): Promise<void> => {
    let resultingConcept: Concept | undefined;
    const targetNode = intersections[0];

    const droppedConcept: Concept | undefined = userConcepts.find(
      (concept) => concept._id === droppedNode.data.conceptId
    );
    const targetConcept: Concept | undefined = userConcepts.find(
      (concept) => concept._id === targetNode.data.conceptId
    );
    if (!droppedConcept || !targetConcept) return;

    axios.put(`http://localhost:3001/concept/use/${droppedConcept._id}`);
    axios.put(`http://localhost:3001/concept/use/${targetConcept._id}`);
    droppedConcept.counter++;
    targetConcept.counter++;

    let combination: Combination | undefined = combinations.find(
      (combi) =>
        combi.combined[0]._id === droppedConcept._id &&
        combi.combined[1]._id === targetConcept._id
    );

    combination && console.log("existing combination :>> ", combination);

    droppedNode.className = "hidden-node";
    targetNode.className = "hidden-node";
    const newNodeId = getId();

    if (!combination) {
      setCombinationToCreate({
        idsToCombine: [droppedConcept._id, targetConcept._id],
        targetNodeId: newNodeId,
      });
    } else {
      axios.put(`http://localhost:3001/combination/use/${combination._id}`);
      combination.counter++;
    }
    resultingConcept = combination && combination.result;
    console.log("resultingConcept :>> ", resultingConcept);

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
        isNew: resultingConcept && resultingConcept.isNew,
      },
    };

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
        >
          <Background />
          <MiniMap />
          <Controls showInteractive={false}>
            <ControlButton
              onClick={() => {
                let newColorMode = colorMode === "light" ? "dark" : "light";
                localStorage.colorMode = newColorMode;
                setColorMode(newColorMode);
              }}
            >
              {colorMode === "light" ? (
                <FontAwesomeIcon icon={faMoon} />
              ) : (
                <FontAwesomeIcon icon={faSun} />
              )}
            </ControlButton>
          </Controls>
          {/* <Panel position="top-right">
            
          </Panel> */}
        </ReactFlow>
      </div>
      {userConcepts ? <Sidebar concepts={userConcepts} /> : null}
      {throwConfetti ? <Confetti /> : null}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <InfiniteConcepts />
    </ReactFlowProvider>
  );
}
