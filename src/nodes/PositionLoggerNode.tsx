import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

export type PositionLoggerNodeData = {
  label?: string;
};

interface PositionLoggerNodeProps {
  xPos: number;
  yPos: number;
  data: any;
}

export function PositionLoggerNode({
  xPos,
  yPos,
  data,
}: PositionLoggerNodeProps) {
  //NodeProps<PositionLoggerNodeData>
  const x = `${Math.round(xPos)}px`;
  const y = `${Math.round(yPos)}px`;

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default">
      {data.label && <div>{data.label}</div>}

      <div>
        {x} {y}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
