import { NodeToolbar } from "@xyflow/react";

export function NodeWithToolBar({ data }: NodeProps<PositionLoggerNodeData>) {
  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <button>cut</button>
        <button>copy</button>
        <button>paste</button>
      </NodeToolbar>
      <div className="react-flow__node-default">{data?.label}</div>
    </>
  );
}
