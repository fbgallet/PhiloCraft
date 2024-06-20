import type { Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from "./PositionLoggerNode";

export const initialNodes = [
  { id: "a", type: "input", position: { x: 0, y: 0 }, data: { label: "être" } },
  {
    id: "b",
    position: { x: -100, y: 100 },
    data: { label: "néant" },
  },
  { id: "c", position: { x: 100, y: 100 }, data: { label: "force" } },
] satisfies Node[];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
