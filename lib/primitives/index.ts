import { Parameter, PrimitiveType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Define primitive template interface
export interface PrimitiveTemplate {
  type: PrimitiveType;
  name: string;
  description: string;
  parameters: Parameter[];
  inputs: {
    resourceType: string;
    label: string;
  }[];
  outputs: {
    resourceType: string;
    label: string;
  }[];
  tags: string[];
  category: string;
}

// Create primitive templates
export const primitiveTemplates: Record<PrimitiveType, PrimitiveTemplate> = {
  lendingPool: {
    type: 'lendingPool',
    name: 'Lending Pool',
    description: 'A lending pool that allows users to deposit assets and borrow against collateral',
    category: 'Lending',
    tags: ['lending', 'borrowing', 'collateral'],
    parameters: [
      {
        id: 'interestRate',
        name: 'Interest Rate',
        type: 'number',
        description: 'Annual interest rate for borrowing (in percentage)',
        defaultValue: 5,
        constraints: {
          minimum: 0,
          maximum: 100,
          required: true,
        },
      },
      {
        id: 'collateralRatio',
        name: 'Collateral Ratio',
        type: 'number',
        description: 'Required collateral to loan ratio (in percentage)',
        defaultValue: 150,
        constraints: {
          minimum: 100,
          maximum: 500,
          required: true,
        },
      },
      {
        id: 'liquidationThreshold',
        name: 'Liquidation Threshold',
        type: 'number',
        description: 'Threshold at which loans become eligible for liquidation (in percentage)',
        defaultValue: 120,
        constraints: {
          minimum: 100,
          maximum: 200,
          required: true,
        },
      },
      {
        id: 'assetType',
        name: 'Asset Type',
        type: 'asset',
        description: 'Type of asset for this lending pool',
        defaultValue: 'USDC',
        constraints: {
          required: true,
        },
      },
    ],
    inputs: [
      {
        resourceType: 'asset',
        label: 'Deposit',
      },
      {
        resourceType: 'collateral',
        label: 'Collateral',
      },
    ],
    outputs: [
      {
        resourceType: 'asset',
        label: 'Loan',
      },
      {
        resourceType: 'receipt',
        label: 'Deposit Receipt',
      },
    ],
  },
  ammPool: {
    type: 'ammPool',
    name: 'AMM Pool',
    description: 'An automated market maker pool for swapping between two assets',
    category: 'Exchange',
    tags: ['swap', 'liquidity', 'amm'],
    parameters: [
      {
        id: 'feePercent',
        name: 'Fee Percentage',
        type: 'number',
        description: 'Fee percentage charged on swaps',
        defaultValue: 0.3,
        constraints: {
          minimum: 0,
          maximum: 10,
          required: true,
        },
      },
      {
        id: 'assetTypeA',
        name: 'Asset Type A',
        type: 'asset',
        description: 'First asset in the pair',
        defaultValue: 'USDC',
        constraints: {
          required: true,
        },
      },
      {
        id: 'assetTypeB',
        name: 'Asset Type B',
        type: 'asset',
        description: 'Second asset in the pair',
        defaultValue: 'ETH',
        constraints: {
          required: true,
        },
      },
    ],
    inputs: [
      {
        resourceType: 'assetA',
        label: 'Token A',
      },
      {
        resourceType: 'assetB',
        label: 'Token B',
      },
    ],
    outputs: [
      {
        resourceType: 'assetA',
        label: 'Token A Out',
      },
      {
        resourceType: 'assetB',
        label: 'Token B Out',
      },
      {
        resourceType: 'lpToken',
        label: 'LP Token',
      },
    ],
  },
  staking: {
    type: 'staking',
    name: 'Staking Pool',
    description: 'A staking pool that rewards users for locking up assets',
    category: 'Yield',
    tags: ['staking', 'rewards', 'yield'],
    parameters: [
      {
        id: 'rewardRate',
        name: 'Reward Rate',
        type: 'number',
        description: 'Annual reward rate (in percentage)',
        defaultValue: 10,
        constraints: {
          minimum: 0,
          maximum: 1000,
          required: true,
        },
      },
      {
        id: 'lockPeriod',
        name: 'Lock Period',
        type: 'number',
        description: 'Required lock period in days',
        defaultValue: 30,
        constraints: {
          minimum: 0,
          maximum: 365 * 5, // 5 years max
          required: true,
        },
      },
      {
        id: 'assetType',
        name: 'Stake Asset',
        type: 'asset',
        description: 'Asset to stake',
        defaultValue: 'APT',
        constraints: {
          required: true,
        },
      },
      {
        id: 'rewardAssetType',
        name: 'Reward Asset',
        type: 'asset',
        description: 'Asset for rewards',
        defaultValue: 'APT',
        constraints: {
          required: true,
        },
      },
    ],
    inputs: [
      {
        resourceType: 'stakeAsset',
        label: 'Stake',
      },
    ],
    outputs: [
      {
        resourceType: 'rewardAsset',
        label: 'Rewards',
      },
      {
        resourceType: 'stakeReceipt',
        label: 'Stake Receipt',
      },
    ],
  },
  vault: {
    type: 'vault',
    name: 'Yield Vault',
    description: 'A yield-generating vault that automatically reinvests returns',
    category: 'Yield',
    tags: ['vault', 'yield', 'auto-compound'],
    parameters: [
      {
        id: 'strategy',
        name: 'Yield Strategy',
        type: 'enum',
        description: 'Strategy for generating yield',
        defaultValue: 'conservative',
        constraints: {
          enum: ['conservative', 'moderate', 'aggressive'],
          required: true,
        },
      },
      {
        id: 'performanceFee',
        name: 'Performance Fee',
        type: 'number',
        description: 'Fee charged on profits (in percentage)',
        defaultValue: 10,
        constraints: {
          minimum: 0,
          maximum: 50,
          required: true,
        },
      },
      {
        id: 'withdrawalFee',
        name: 'Withdrawal Fee',
        type: 'number',
        description: 'Fee charged on withdrawals (in percentage)',
        defaultValue: 0.1,
        constraints: {
          minimum: 0,
          maximum: 10,
          required: true,
        },
      },
      {
        id: 'assetType',
        name: 'Asset Type',
        type: 'asset',
        description: 'Asset managed by this vault',
        defaultValue: 'USDC',
        constraints: {
          required: true,
        },
      },
    ],
    inputs: [
      {
        resourceType: 'asset',
        label: 'Deposit',
      },
    ],
    outputs: [
      {
        resourceType: 'vaultShare',
        label: 'Vault Shares',
      },
      {
        resourceType: 'asset',
        label: 'Yield',
      },
    ],
  },
};

// Helper function to create a primitive instance from a template
export function createPrimitive(type: PrimitiveType, position: { x: number, y: number }) {
  const template = primitiveTemplates[type];
  if (!template) {
    throw new Error(`Unknown primitive type: ${type}`);
  }

  const primitiveId = uuidv4();

  // Create parameter values
  const parameters: Record<string, any> = {};
  template.parameters.forEach(param => {
    parameters[param.id] = {
      parameterId: param.id,
      value: param.defaultValue,
    };
  });

  // Create ports
  const inputs = template.inputs.map((input, index) => ({
    id: uuidv4(),
    primitiveId,
    type: 'input' as const,
    resourceType: input.resourceType,
    label: input.label,
  }));

  const outputs = template.outputs.map((output, index) => ({
    id: uuidv4(),
    primitiveId,
    type: 'output' as const,
    resourceType: output.resourceType,
    label: output.label,
  }));

  return {
    id: primitiveId,
    type,
    position,
    parameters,
    inputs,
    outputs,
    label: template.name,
    description: template.description,
  };
} 