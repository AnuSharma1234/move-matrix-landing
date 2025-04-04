import { Composition, Connection, Primitive, ValidationIssue, ValidationResult } from './types';

// Validate a composition
export function validateComposition(composition: Composition): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Check primitives
  Object.values(composition.primitives).forEach(primitive => {
    issues.push(...validatePrimitive(primitive));
  });

  // Check connections
  Object.values(composition.connections).forEach(connection => {
    issues.push(...validateConnection(connection, composition));
  });

  // Check for orphaned primitives (no connections)
  Object.values(composition.primitives).forEach(primitive => {
    const hasConnections = Object.values(composition.connections).some(
      conn => 
        conn.sourcePortId.startsWith(primitive.id) || 
        conn.targetPortId.startsWith(primitive.id)
    );
    
    if (!hasConnections) {
      issues.push({
        severity: 'warning',
        message: `Primitive "${primitive.label}" is not connected to any other primitive`,
        location: {
          primitiveId: primitive.id,
        },
      });
    }
  });

  return {
    valid: !issues.some(issue => issue.severity === 'error'),
    issues,
  };
}

// Validate a primitive
function validatePrimitive(primitive: Primitive): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check required parameters
  Object.entries(primitive.parameters).forEach(([paramId, paramValue]) => {
    if (paramValue.value === undefined || paramValue.value === null || paramValue.value === '') {
      issues.push({
        severity: 'error',
        message: `Parameter "${paramId}" is required but not set`,
        location: {
          primitiveId: primitive.id,
          parameterId: paramId,
        },
      });
    }
  });

  return issues;
}

// Validate a connection
function validateConnection(connection: Connection, composition: Composition): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Find the source and target ports
  let sourcePort = null;
  let targetPort = null;
  let sourcePrimitive = null;
  let targetPrimitive = null;

  for (const primitive of Object.values(composition.primitives)) {
    for (const output of primitive.outputs) {
      if (output.id === connection.sourcePortId) {
        sourcePort = output;
        sourcePrimitive = primitive;
        break;
      }
    }
    
    for (const input of primitive.inputs) {
      if (input.id === connection.targetPortId) {
        targetPort = input;
        targetPrimitive = primitive;
        break;
      }
    }
    
    if (sourcePort && targetPort) break;
  }

  // Check if source and target are found
  if (!sourcePort) {
    issues.push({
      severity: 'error',
      message: `Connection source port not found`,
      location: {
        connectionId: connection.id,
      },
    });
  }

  if (!targetPort) {
    issues.push({
      severity: 'error',
      message: `Connection target port not found`,
      location: {
        connectionId: connection.id,
      },
    });
  }

  // If both ports are found, check resource type compatibility
  if (sourcePort && targetPort) {
    if (sourcePort.resourceType !== targetPort.resourceType) {
      issues.push({
        severity: 'error',
        message: `Resource type mismatch: "${sourcePort.resourceType}" cannot connect to "${targetPort.resourceType}"`,
        location: {
          connectionId: connection.id,
        },
      });
    }
  }

  // Check if primitives are the same (self-connection)
  if (sourcePrimitive && targetPrimitive && sourcePrimitive.id === targetPrimitive.id) {
    issues.push({
      severity: 'warning',
      message: `Self-connection detected on primitive "${sourcePrimitive.label}"`,
      location: {
        connectionId: connection.id,
      },
    });
  }

  return issues;
} 