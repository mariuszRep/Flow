import React from 'react';
import { NodeType, NODE_TYPES } from './WorkflowNode';
// Icons are imported from NODE_TYPES

interface WorkflowMenuProps {
  onAddNode: (type: NodeType) => void;
}

// No color helper needed since we removed the dots

const WorkflowMenu: React.FC<WorkflowMenuProps> = ({ onAddNode }) => {

  return (
    <div className="h-full bg-gray-800 text-white w-64 p-4 overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Add Nodes</h3>
      
      <div className="space-y-2">
        {NODE_TYPES.map((node) => (
          <div 
            key={node.value}
            className="p-3 bg-gray-700 rounded-md border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors h-24"
            onClick={() => onAddNode(node.value)}
          >
            <div className="flex items-center gap-3 h-full">
              <div className="flex-1 flex flex-col justify-center">
                <div className="font-medium">{node.label} Node</div>
                <div className="text-xs text-gray-400 line-clamp-2 h-10">{node.description}</div>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-gray-500 flex items-center justify-center w-10 h-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNode(node.value);
                }}
              >
                {node.icon}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowMenu;
