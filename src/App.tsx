import type { Edge, Node, OnConnect, Rect, XYPosition } from "@xyflow/react";

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
} from "@xyflow/react";

import Sidebar from "./components/Sidebar.tsx";
import { randomConceptEnPrompt } from "./ai/prompts.ts";

import "@xyflow/react/dist/style.css";

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

let id: number = 1;
const getId = (): string => `${(id++).toString()}`;

function InfiniteConcepts() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [userConcepts, setUserConcepts] = useState<Concept[]>(
    getStoredUserconcepts() || []
  );
  const [combinations, setCombinations] = useState<Combination[]>([]);
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
    setTimeout(() => {
      setThrowConfetti(false);
    }, 5000);
  }, [throwConfetti]);

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
        x: event.clientX - 150,
        y: event.clientY - 40,
      });
      const newNode: Node = {
        id: getId(),
        type: "node-toolbar",
        position,
        positionAbsolute: position,
        data: {
          label: `${droppedConcept.icon} ${droppedConcept.title}`,
          conceptId,
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
    node: Node,
    intersections: Node[]
  ): Promise<void> => {
    let resultingConcept: Concept;

    const conceptA: Concept | undefined = userConcepts.find(
      (concept) => concept._id === node.data.conceptId
    );
    const conceptB: Concept | undefined = userConcepts.find(
      (concept) => concept._id === intersections[0].data.conceptId
    );
    if (!conceptA || !conceptB) return;

    axios.put(`http://localhost:3001/concept/use/${conceptA._id}`);
    axios.put(`http://localhost:3001/concept/use/${conceptB._id}`);
    conceptA.counter++;
    conceptB.counter++;

    let combination: Combination | undefined = combinations.find(
      (combi) =>
        combi.combined[0]._id === conceptA._id &&
        combi.combined[1]._id === conceptB._id
    );

    combination && console.log("existing combination :>> ", combination);

    if (!combination) {
      const { data } = await axios.post(
        "http://localhost:3001/combination/create",
        {
          toCombine: [conceptA._id, conceptB._id],
        }
      );
      console.log("data :>> ", data);
      if (data) {
        combination = data.combination;
        combination && (resultingConcept = combination.result);
        resultingConcept.isNew = data.isNewResultingConcept;
        if (resultingConcept.isNew) {
          console.log("NEW CONCEPT DISCOVERED !!!");
          setThrowConfetti(true);
        }

        combination && combinations.push(combination);
      }
    } else {
      axios.put(`http://localhost:3001/combination/use/${combination._id}`);
      combination.counter++;
      resultingConcept = combination.result;
    }

    if (!userConcepts.find((concept) => concept._id === resultingConcept._id)) {
      setUserConcepts((prev) =>
        combination ? [...prev, resultingConcept] : prev
      );
      resultingConcept &&
        (localStorage.userConcepts = JSON.stringify(
          userConcepts.concat(resultingConcept)
        ));
    }

    const newNode: Node = {
      id: getId(),
      type: "node-toolbar",
      position: {
        x: intersections[0].position.x,
        y: intersections[0].position.y,
      },
      data: {
        label: resultingConcept.icon + " " + resultingConcept.title,
        conceptId: resultingConcept._id,
        isNew: resultingConcept.isNew,
      },
    };

    setNodes((nds) =>
      nds
        .filter((ns) => !(ns.id === node.id || ns.id === intersections[0].id))
        .concat(newNode)
    );
  };

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          className="intersection-flow"
          colorMode={"dark"}
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          fitView
          selectNodesOnDrag={false}
          // onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background />
          <MiniMap />
          <Controls />
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
