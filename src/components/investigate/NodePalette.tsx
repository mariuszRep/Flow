
import React from 'react';
import { Button } from '@/components/ui/button';
import { NodeType } from '@/types/workflow';
import { PlusCircle } from 'lucide-react';

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const nodeTypes: { type: NodeType; label: string; description: string; color: string }[] = [
    {
      type: 'LLM',
      label: 'LLM Node',
      description: 'Language model for text generation',
      color: 'bg-workflow-llm',
    },
    {
      type: 'Tool',
      label: 'Tool Node',
      description: 'External API or function call',
      color: 'bg-workflow-tool',
    },
    {
      type: 'Function',
      label: 'Function Node',
      description: 'Custom Python function',
      color: 'bg-workflow-function',
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-medium text-white">Add Nodes</h3>
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div 
            key={nodeType.type}
            className="p-3 bg-gray-800 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => onAddNode(nodeType.type)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${nodeType.color}`} />
              <div>
                <div className="font-medium text-white">{nodeType.label}</div>
                <div className="text-xs text-gray-400">{nodeType.description}</div>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="ml-auto h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNode(nodeType.type);
                }}
              >
                <PlusCircle size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodePalette;
