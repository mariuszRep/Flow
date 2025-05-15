import { Edge, Connection, addEdge } from '@xyflow/react';

export const initialEdges: Edge[] = [];

// Default edge options with blue styling
export const defaultEdgeOptions = {
  style: {
    stroke: '#3b82f6', // Blue color (using Tailwind's blue-500)
    strokeWidth: 1,
  },
  animated: false,
};

export interface EdgeContextType {
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
}

export const handleConnect = (connection: Connection, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>) => {
  setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
};

// Function to remove edges connected to deleted nodes
export const removeEdgesForNodes = (edges: Edge[], nodesToRemove: string[]): Edge[] => {
  return edges.filter((edge) => !nodesToRemove.includes(edge.source) && !nodesToRemove.includes(edge.target));
}; 