import type { OnConnect } from "reactflow";

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

import Sidebar from "./components/Sidebar.jsx";

import "reactflow/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { claudeAPImessage } from "./ai/api-requets";

let id = 2;
const getId = () => `${id++}`;

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { getIntersectingNodes } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    []
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeDrag = useCallback((_: MouseEvent, node: Node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);

    // console.log("intersections :>> ", intersections);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? "highlight" : "",
      }))
    );
  }, []);

  const onNodeDragStop = useCallback(async (_: MouseEvent, node: Node) => {
    console.log("node :>> ", node);
    const intersections = getIntersectingNodes(node);

    console.log("intersections :>> ", intersections);

    if (intersections.length) {
      const newNode = {
        id: "new Id",
        // type,
        position: {
          x: intersections[0].position.x,
          y: intersections[0].position.y,
        },
        data: {
          label: await claudeAPImessage(
            intersections[0].data.label + ", " + node.data.label
          ),
        },
      };

      setNodes((nds) =>
        nds
          .filter((ns) => ns.id !== node.id && ns.id !== intersections[0].id)
          .concat(newNode)
      );
    }
  }, []);

  const onPaneClick = async (event: React.MouseEvent) => {
    console.log("event :>> ", event);
    const newWord = await claudeAPImessage(
      "Propose un terme quelconque issu du corpus des oeuvres de philosophie, rien le terme ou concept, sans phrase ni explication. " +
        "Ce peut être un terme très commun comme liberté, mal, science, ou un concept plus technique comme falsification, hétéronimie."
    );
    const position = screenToFlowPosition({
      x: event.clientX - 150,
      y: event.clientY - 40,
    });
    const newNode = {
      id: getId(),
      // type,
      position,
      data: {
        label: newWord,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // external drops
  const onDragOver = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [screenToFlowPosition]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const content = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof content === "undefined" || !content) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        // type,
        position,
        data: { label: `${content}` },
      };

      setNodes((nds) => nds.concat(newNode));
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
