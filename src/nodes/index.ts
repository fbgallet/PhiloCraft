import type { Node, NodeTypes } from "reactflow";
// import { PositionLoggerNode } from "./PositionLoggerNode";
import { NodeWithToolBar } from "./NodeWithToolbar";

export const initialNodes = [
  {
    id: "a",
    type: "node-toolbar",
    position: { x: 0, y: 0 },
    data: { label: "être" },
    className: "",
  },
  {
    id: "b",
    type: "node-toolbar",
    position: { x: 0, y: 100 },
    data: { label: "néant" },
    className: "",
  },
] satisfies Node[];

export const nodeTypes = {
  // "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
  "node-toolbar": NodeWithToolBar,
} satisfies NodeTypes;
