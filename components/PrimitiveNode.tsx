'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Primitive } from '../lib/types';

interface PrimitiveNodeData {
  primitive: Primitive;
  onSelect: () => void;
  debug?: boolean;
}

const PrimitiveNode = memo(({ data, selected }: NodeProps<PrimitiveNodeData>) => {
  const { primitive, onSelect, debug = false } = data;
  
  // Define color based on primitive type
  const typeColorMap: Record<string, string> = {
    lendingPool: 'bg-blue-100 border-blue-300 text-blue-800',
    ammPool: 'bg-green-100 border-green-300 text-green-800',
    staking: 'bg-purple-100 border-purple-300 text-purple-800',
    vault: 'bg-amber-100 border-amber-300 text-amber-800',
  };
  
  const typeColor = typeColorMap[primitive.type] || 'bg-gray-100 border-gray-300 text-gray-700';
  
  return (
    <div 
      className={`p-3 rounded-lg border-2 ${selected ? 'ring-2 ring-blue-500' : ''} ${typeColor} min-w-[200px] shadow-md`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="text-center font-bold mb-2">{primitive.label || primitive.type}</div>
      
      {/* Input Handles */}
      <div className="mb-4">
        {primitive.inputs && primitive.inputs.map((input, index) => (
          <div key={input.id} className="relative mb-3 last:mb-0 group">
            <Handle
              id={input.id}
              type="target"
              position={Position.Left}
              className="w-4 h-4 !bg-blue-500 hover:!w-5 hover:!h-5 hover:!bg-blue-600 transition-all !border-2 !border-white shadow-lg hover:shadow-xl !left-[-6px]"
              style={{ top: `${index * 28 + 12}px` }}
              isConnectable={true}
              data-tooltip-id={`handle-tooltip-${input.id}`}
              data-tooltip-content={`Input: ${input.resourceType}`}
            />
            <div className="pl-4 text-sm flex items-center">
              <span className="text-xs font-medium text-blue-600 px-1 bg-blue-100 rounded mr-2">{input.resourceType}</span>
              <span className="group-hover:font-medium transition-all">{input.label}</span>
              {debug && (
                <span className="ml-1 text-xs text-gray-500">[ID: {input.id}]</span>
              )}
            </div>
          </div>
        ))}
        {(!primitive.inputs || primitive.inputs.length === 0) && (
          <div className="text-xs text-gray-500 italic">No inputs</div>
        )}
      </div>
      
      {/* Output Handles */}
      <div>
        {primitive.outputs && primitive.outputs.map((output, index) => (
          <div key={output.id} className="relative mb-3 last:mb-0 text-right group">
            <div className="pr-4 text-sm flex items-center justify-end">
              {debug && (
                <span className="mr-1 text-xs text-gray-500">[ID: {output.id}]</span>
              )}
              <span className="group-hover:font-medium transition-all">{output.label}</span>
              <span className="text-xs font-medium text-green-600 px-1 bg-green-100 rounded ml-2">{output.resourceType}</span>
            </div>
            <Handle
              id={output.id}
              type="source"
              position={Position.Right}
              className="w-4 h-4 !bg-green-500 hover:!w-5 hover:!h-5 hover:!bg-green-600 transition-all !border-2 !border-white shadow-lg hover:shadow-xl !right-[-6px]"
              style={{ top: `${index * 28 + 12}px` }}
              isConnectable={true}
              data-tooltip-id={`handle-tooltip-${output.id}`}
              data-tooltip-content={`Output: ${output.resourceType}`}
            />
          </div>
        ))}
        {(!primitive.outputs || primitive.outputs.length === 0) && (
          <div className="text-xs text-gray-500 italic">No outputs</div>
        )}
      </div>
      
      {/* Debug information */}
      {debug && (
        <div className="mt-3 pt-2 border-t border-gray-200 text-xs bg-amber-50 p-1 rounded">
          <div className="text-amber-800 font-medium">Debug Info:</div>
          <div className="text-gray-600">ID: {primitive.id}</div>
          <div className="text-gray-600">Type: {primitive.type}</div>
          <div className="text-gray-600">Position: ({primitive.position.x}, {primitive.position.y})</div>
        </div>
      )}
      
      {/* Parameters preview */}
      {Object.keys(primitive.parameters || {}).length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
          <div className="text-gray-500 mb-1">Parameters:</div>
          {Object.entries(primitive.parameters).slice(0, 2).map(([key, param]) => (
            <div key={key} className="flex justify-between">
              <span>{key}:</span>
              <span className="font-medium">{String(param.value).substring(0, 15)}</span>
            </div>
          ))}
          {Object.keys(primitive.parameters).length > 2 && (
            <div className="text-gray-500 text-right">+{Object.keys(primitive.parameters).length - 2} more</div>
          )}
        </div>
      )}
    </div>
  );
});

PrimitiveNode.displayName = 'PrimitiveNode';

export default PrimitiveNode; 