import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  BackgroundVariant,
  ReactFlowProvider,
  Panel,
  useKeyPress,
  useOnSelectionChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode, { createNode } from './Node';
import { initialEdges, handleConnect, removeEdgesForNodes, defaultEdgeOptions } from './Edge';

const initialNodes: Node[] = [];

const nodeTypes = {
  custom: CustomNode
};

function Flow({ showJson }: { showJson: boolean }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const deleteKeyPressed = useKeyPress('Delete');
  
  // Track selected nodes
  const [selectedNodes, setSelectedNodes] = React.useState<Node[]>([]);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes);
    },
  });

  // Handle delete key press
  useEffect(() => {
    if (deleteKeyPressed && selectedNodes.length > 0) {
      setNodes((nds) => nds.filter((node) => !selectedNodes.some(selectedNode => selectedNode.id === node.id)));
      // Remove connected edges using the imported function
      setEdges((eds) => removeEdgesForNodes(eds, selectedNodes.map(node => node.id)));
    }
  }, [deleteKeyPressed, selectedNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => handleConnect(connection, setEdges),
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    const newNode = createNode({ 
      x: Math.floor(15), 
      y: Math.floor(15) 
    });
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  if (showJson) {
    return <JsonView nodes={nodes} edges={edges} />;
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-gray-50"
        deleteKeyCode="Delete"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        
        <Panel position="top-left" className="bg-white p-2 rounded shadow">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onAddNode}
          >
            Add Node
          </button>
        </Panel>
        
        
      </ReactFlow>
    </div>
  );
}

function JsonView({ nodes, edges }: { nodes: Node[], edges: any[] }) {
  return (
    <div className="w-full h-full bg-gray-50 p-4 overflow-auto">
      <div className="bg-white p-4 rounded shadow max-w-4xl mx-auto">
        <h3 className="font-bold mb-2">Flow JSON</h3>
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {JSON.stringify({
            nodes: nodes.map(node => ({
              id: node.id,
              data: {
                type: node.data?.type,
                label: node.data?.label
              }
            })),
            edges: edges.map(edge => ({
              id: edge.id,
              source: edge.source,
              target: edge.target
            }))
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function Editor() {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowJson(!showJson)}
          className="px-3 py-1 bg-white text-gray-800 rounded shadow hover:bg-gray-50 border border-gray-200 transition-colors"
        >
          {showJson ? 'Show Flow' : 'Show JSON'}
        </button>
      </div>
      <ReactFlowProvider>
        <Flow showJson={showJson} />
      </ReactFlowProvider>
    </div>
  );
}