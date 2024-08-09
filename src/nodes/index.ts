import type { Node, NodeTypes } from "@xyflow/react";
// import { PositionLoggerNode } from "./PositionLoggerNode";
import { NodeWithToolBar } from "./NodeWithToolbar";

export const initialNodes = [
  // {
  //   id: "0",
  //   type: "node-toolbar",
  //   position: { x: 0, y: 0 },
  //   data: { label: "🌟 Being" },
  //   className: "",
  // },
  // {
  //   id: "b",
  //   type: "node-toolbar",
  //   position: { x: 0, y: 100 },
  //   data: { label: "⚫ Nothingness" },
  //   className: "",
  // },
] satisfies Node[];

export const nodeTypes = {
  // "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
  "node-toolbar": NodeWithToolBar,
} satisfies NodeTypes;
