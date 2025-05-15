import { useState, useCallback } from 'react';
import { Node as FlowNode, Handle, Position, useReactFlow } from '@xyflow/react';
import { FileEdit } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import MultiSelectDropdown, { Option } from './MultiSelectDropdown';

export type NodeType = 'entry' | 'linear' | 'conditional' | 'exit';

export interface NodeData {
  label: string;
  type: NodeType;
  sourceEdges?: Option[];
  targetEdges?: Option[];
}

const handleStyle = {
  width: 0,
  height: 0,
  background: 'transparent',
  borderStyle: 'solid',
  borderWidth: '5px',
  borderColor: ' #3b82f6',
  borderRadius: '100%',
  padding: 0,
  margin: 0,
  zIndex: 10
} as const;

export const createNode = (position: { x: number; y: number }): FlowNode => {
  return {
    id: `node_${Date.now()}`,
    type: 'custom',
    position,
    data: { 
      label: 'New Node', 
      type: 'linear' as NodeType,
      sourceEdges: [],
      targetEdges: []
    },
  };
};

interface NodeProps {
  data: NodeData;
  id: string;
}

const NODE_TYPES: { value: NodeType; label: string; description: string }[] = [
  { value: 'entry', label: 'Entry', description: 'Starting point of the flow' },
  { value: 'linear', label: 'Linear', description: 'Basic processing step' },
  { value: 'conditional', label: 'Conditional', description: 'Decision point with multiple paths' },
  { value: 'exit', label: 'Exit', description: 'End point of the flow' },
];

// Function to convert nodes to options
const nodeToOption = (node: FlowNode): Option => ({
  id: node.id,
  label: node.data.label as string || `Node ${node.id}`
});

export function Node({ data, id }: NodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nodeLabel, setNodeLabel] = useState(data.label);
  const [nodeType, setNodeType] = useState<NodeType>(data.type || 'linear');
  
  // Get React Flow instance to manipulate edges
  const { getNodes, getEdges, setEdges } = useReactFlow();
  
  // Get connected nodes
  const edges = getEdges();
  const nodes = getNodes();
  
  const connectedSourceNodes = edges
    .filter(edge => edge.target === id)
    .map(edge => nodes.find(node => node.id === edge.source))
    .filter((node): node is FlowNode => node !== undefined)
    .map(nodeToOption);

  const connectedTargetNodes = edges
    .filter(edge => edge.source === id)
    .map(edge => nodes.find(node => node.id === edge.target))
    .filter((node): node is FlowNode => node !== undefined)
    .map(nodeToOption);

  // Get available nodes (excluding self)
  const availableNodes = nodes
    .filter(node => node.id !== id)
    .map(nodeToOption);

  // Handle source nodes change
  const handleSourceNodesChange = (selected: Option[]) => {
    const currentSourceIds = new Set(connectedSourceNodes.map(node => node.id));
    const newSourceIds = new Set(selected.map(node => node.id));
    
    // Remove edges that are no longer selected
    const edgesWithoutRemoved = edges.filter(edge => {
      if (edge.target === id) {
        return newSourceIds.has(edge.source);
      }
      return true;
    });

    // Add new edges for newly selected nodes
    const newEdges = selected
      .filter(node => !currentSourceIds.has(node.id))
      .map(node => ({
        id: `${node.id}-${id}`,
        source: node.id.toString(),
        target: id,
      }));

    setEdges([...edgesWithoutRemoved, ...newEdges]);
  };

  // Handle target nodes change
  const handleTargetNodesChange = (selected: Option[]) => {
    const currentTargetIds = new Set(connectedTargetNodes.map(node => node.id));
    const newTargetIds = new Set(selected.map(node => node.id));
    
    // Remove edges that are no longer selected
    const edgesWithoutRemoved = edges.filter(edge => {
      if (edge.source === id) {
        return newTargetIds.has(edge.target);
      }
      return true;
    });

    // Add new edges for newly selected nodes
    const newEdges = selected
      .filter(node => !currentTargetIds.has(node.id))
      .map(node => ({
        id: `${id}-${node.id}`,
        source: id,
        target: node.id.toString(),
      }));

    setEdges([...edgesWithoutRemoved, ...newEdges]);
  };

  const onSave = useCallback(() => {
    data.label = nodeLabel;
    data.type = nodeType;
    setIsOpen(false);
  }, [data, nodeLabel, nodeType]);

  return (
    <>
      <div 
        className="relative px-4 py-2 shadow-md rounded-xl bg-white border border-blue-400"
        onDoubleClick={() => setIsOpen(true)}
      >
        <Handle 
          type="target" 
          position={Position.Left} 
          style={handleStyle}
        />
        <div className="flex flex-col items-center">
          <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-200">
            <FileEdit size={16} />
          </div>
          <div className="mt-1">
            <div className="text-[10px] text-center">{data.label}</div>
          </div>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          style={handleStyle}
        />
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        
        <div className="relative bg-white rounded-xl p-6 w-full max-w-sm">
          <Dialog.Title className="text-xl font-bold mb-4">
            Edit Node
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Type
              </label>
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value as NodeType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {NODE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {NODE_TYPES.find(t => t.value === nodeType)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Nodes
              </label>
              <MultiSelectDropdown
                options={availableNodes}
                selectedOptions={connectedSourceNodes}
                onChange={handleSourceNodesChange}
                placeholder="Select source nodes"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nodes that connect to this node
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Nodes
              </label>
              <MultiSelectDropdown
                options={availableNodes}
                selectedOptions={connectedTargetNodes}
                onChange={handleTargetNodesChange}
                placeholder="Select target nodes"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nodes this node connects to
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Node; 