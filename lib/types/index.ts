// Type definitions for DeFi primitives and compositions

// Primitive types
export type PrimitiveType = 'lendingPool' | 'ammPool' | 'staking' | 'vault';

// Parameter types
export type ParameterType = 'number' | 'string' | 'boolean' | 'enum' | 'address' | 'asset';

// Position on the canvas
export interface Position {
  x: number;
  y: number;
}

// Parameter definition
export interface Parameter {
  id: string;
  name: string;
  type: ParameterType;
  description: string;
  defaultValue: any;
  constraints?: {
    minimum?: number;
    maximum?: number;
    pattern?: string;
    enum?: any[];
    required?: boolean;
  };
}

// Parameter value
export interface ParameterValue {
  parameterId: string;
  value: any;
}

// Port (input/output connection point)
export interface Port {
  id: string;
  primitiveId: string;
  type: 'input' | 'output';
  resourceType: string;
  label: string;
  position?: Position;
}

// Connection between primitives
export interface Connection {
  id: string;
  sourcePortId: string;
  targetPortId: string;
  resourceType: string;
}

// Primitive
export interface Primitive {
  id: string;
  type: PrimitiveType;
  position: Position;
  parameters: Record<string, ParameterValue>;
  inputs: Port[];
  outputs: Port[];
  label: string;
  description: string;
}

// Composition
export interface Composition {
  id: string;
  name: string;
  description: string;
  primitives: Record<string, Primitive>;
  connections: Record<string, Connection>;
  createdAt: Date;
  updatedAt: Date;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// Validation issue
export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: {
    primitiveId?: string;
    connectionId?: string;
    parameterId?: string;
  };
} 