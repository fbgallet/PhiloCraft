import type { Edge, Node, OnConnect, Rect, XYPosition } from "reactflow";

import { useState, useCallback, MouseEvent, useRef } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
} from "reactflow";

import Sidebar from "./components/Sidebar.js";
import { randomConceptEnPrompt } from "./ai/prompts.ts";

import "reactflow/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { claudeAPImessage } from "./ai/api-requets";
import {
  addToExistingConcepts,
  combinationsDB,
  Concept,
  concepts,
  ConceptsCombination,
  getConceptIcon,
  getConceptTitle,
  getStoredCombination,
} from "./utils/data.ts";

let id: number = 1;
const getId = (): string => `${(id++).toString()}`;

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { getIntersectingNodes } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();

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
    const intersections: string[] = getIntersectingNodes(node).map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? "highlight" : "",
      }))
    );
  }, []);

  const onNodeDragStop = useCallback(async (_: MouseEvent, node: Node) => {
    const intersections: Node[] = getIntersectingNodes(node);

    if (intersections.length) {
      combineTwoNodesInOne(node, intersections);
    }
  }, []);

  const combineTwoNodesInOne = async (
    node: Node,
    intersections: Node[]
  ): Promise<void> => {
    const conceptA: string = getConceptTitle(node.data.label);
    const conceptB: string = getConceptTitle(intersections[0].data.label);

    const existingCombination: ConceptsCombination | null =
      getStoredCombination([conceptA, conceptB]);
    let nodeLabel: string | undefined;
    if (existingCombination) {
      const matchingConcept: Concept | undefined = concepts.find(
        (concept) => concept.title === existingCombination.result
      );
      const matchingIcon: string | undefined = matchingConcept?.icon;
      nodeLabel = matchingIcon + " " + existingCombination.result;
    } else {
      nodeLabel = await claudeAPImessage(
        `${conceptA} + ${conceptB} = [resulting term to be provided as your response]`
      );
    }

    if (!nodeLabel) return;

    const newNode: Node = {
      id: getId(),
      type: "node-toolbar",
      position: {
        x: intersections[0].position.x,
        y: intersections[0].position.y,
      },
      data: {
        label: nodeLabel,
      },
    };

    const icon: string = getConceptIcon(newNode.data.label);
    const title: string = getConceptTitle(newNode.data.label);
    const existingConcept: Concept | null = addToExistingConcepts({
      title,
      icon,
    });

    if (existingConcept)
      newNode.data.label = `${existingConcept.icon} ${existingConcept.title}`;

    if (!existingCombination) {
      combinationsDB.push({
        combined: [conceptA, conceptB],
        result: title,
        count: 1,
      });
      localStorage.InfiniteCombinations = JSON.stringify(combinationsDB);
    }

    setNodes((nds) =>
      nds
        .filter((ns) => !(ns.id === node.id || ns.id === intersections[0].id))
        .concat(newNode)
    );
  };

  const onPaneClick = async (event: React.MouseEvent): Promise<void> => {
    const newWord: string | undefined = await claudeAPImessage(
      randomConceptEnPrompt,
      false
    );
    if (!newWord) return;
    const position: XYPosition = screenToFlowPosition({
      x: event.clientX - 150,
      y: event.clientY - 40,
    });
    const newNode: Node = {
      id: getId(),
      type: "node-toolbar",
      position,
      data: {
        label: newWord,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

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

      const intersections: string[] = getIntersectingNodes(rect).map(
        (n) => n.id
      );

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

      const content: string | undefined = event.dataTransfer.getData(
        "application/reactflow"
      );

      // check if the dropped element is valid
      if (typeof content === "undefined" || !content) {
        return;
      }

      const position: XYPosition = screenToFlowPosition({
        x: event.clientX - 150,
        y: event.clientY - 40,
      });
      const newNode: Node = {
        id: getId(),
        type: "node-toolbar",
        position,
        positionAbsolute: position,
        data: { label: `${content}` },
        height: 40,
        width: 173,
      };

      console.log("newNode :>> ", newNode);
      console.log("nodes :>> ", nodes);

      setNodes((nds) => nds.concat(newNode));

      setTimeout(() => {
        const intersections: Node[] = getIntersectingNodes(newNode);
        if (intersections.length) combineTwoNodesInOne(newNode, intersections);
      }, 20);
    },
    [screenToFlowPosition]
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          className="intersection-flow"
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
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
