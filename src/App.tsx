import type { OnConnect } from "reactflow";

import { useState, useCallback, MouseEvent } from "react";
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

import "reactflow/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { claudeAPImessage } from "./ai/api-requets";

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { getIntersectingNodes } = useReactFlow();

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

  return (
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
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
