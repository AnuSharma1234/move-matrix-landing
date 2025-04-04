import { Composition, Connection, Position, Primitive, PrimitiveType, ValidationResult } from './types';
import { createPrimitive } from './primitives';
import { validateComposition } from './validation';
import { v4 as uuidv4 } from 'uuid';

// Composition engine interface
export interface CompositionEngine {
  getComposition: () => Composition;
  addPrimitive: (type: PrimitiveType, position: Position) => Primitive;
  updatePrimitive: (primitiveId: string, updates: Partial<Primitive>) => Primitive;
  removePrimitive: (primitiveId: string) => void;
  updatePrimitivePosition: (primitiveId: string, position: Position) => void;
  updatePrimitiveParameter: (primitiveId: string, parameterId: string, value: any) => void;
  addConnection: (sourcePortId: string, targetPortId: string) => Connection | null;
  removeConnection: (connectionId: string) => void;
  validateComposition: () => ValidationResult;
  exportCode: () => string;
}

// Create a new composition
export function createComposition(name: string, description: string): Composition {
  return {
    id: uuidv4(),
    name,
    description,
    primitives: {},
    connections: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Create a composition engine
export function createCompositionEngine(initialComposition?: Composition): CompositionEngine {
  let composition: Composition = initialComposition || createComposition('Untitled Composition', 'A DeFi composition');

  // Get the current composition
  const getComposition = (): Composition => {
    return { ...composition };
  };

  // Add a primitive to the composition
  const addPrimitive = (type: PrimitiveType, position: Position): Primitive => {
    const primitive = createPrimitive(type, position);
    composition = {
      ...composition,
      primitives: {
        ...composition.primitives,
        [primitive.id]: primitive,
      },
      updatedAt: new Date(),
    };
    return primitive;
  };

  // Update a primitive in the composition
  const updatePrimitive = (primitiveId: string, updates: Partial<Primitive>): Primitive => {
    const primitive = composition.primitives[primitiveId];
    if (!primitive) {
      throw new Error(`Primitive not found: ${primitiveId}`);
    }

    const updatedPrimitive = {
      ...primitive,
      ...updates,
    };

    composition = {
      ...composition,
      primitives: {
        ...composition.primitives,
        [primitiveId]: updatedPrimitive,
      },
      updatedAt: new Date(),
    };

    return updatedPrimitive;
  };

  // Remove a primitive from the composition
  const removePrimitive = (primitiveId: string): void => {
    const { [primitiveId]: removedPrimitive, ...remainingPrimitives } = composition.primitives;
    
    // Also remove any connections involving this primitive
    const remainingConnections: Record<string, Connection> = {};
    
    Object.entries(composition.connections).forEach(([id, connection]) => {
      // Keep only connections that don't involve the removed primitive
      const sourcePortPrimitive = connection.sourcePortId.split('-')[0];
      const targetPortPrimitive = connection.targetPortId.split('-')[0];
      
      if (sourcePortPrimitive !== primitiveId && targetPortPrimitive !== primitiveId) {
        remainingConnections[id] = connection;
      }
    });

    composition = {
      ...composition,
      primitives: remainingPrimitives,
      connections: remainingConnections,
      updatedAt: new Date(),
    };
  };

  // Update a primitive's position
  const updatePrimitivePosition = (primitiveId: string, position: Position): void => {
    const primitive = composition.primitives[primitiveId];
    if (!primitive) {
      throw new Error(`Primitive not found: ${primitiveId}`);
    }

    composition = {
      ...composition,
      primitives: {
        ...composition.primitives,
        [primitiveId]: {
          ...primitive,
          position,
        },
      },
      updatedAt: new Date(),
    };
  };

  // Update a primitive's parameter
  const updatePrimitiveParameter = (primitiveId: string, parameterId: string, value: any): void => {
    const primitive = composition.primitives[primitiveId];
    if (!primitive) {
      throw new Error(`Primitive not found: ${primitiveId}`);
    }

    composition = {
      ...composition,
      primitives: {
        ...composition.primitives,
        [primitiveId]: {
          ...primitive,
          parameters: {
            ...primitive.parameters,
            [parameterId]: {
              parameterId,
              value,
            },
          },
        },
      },
      updatedAt: new Date(),
    };
  };

  // Add a connection between primitives
  const addConnection = (sourcePortId: string, targetPortId: string): Connection | null => {
    // Find source and target ports to get their resource types
    let sourcePort = null;
    let targetPort = null;
    let sourcePrimitiveId = '';
    let targetPrimitiveId = '';

    // Find source port
    for (const primitive of Object.values(composition.primitives)) {
      for (const output of primitive.outputs) {
        if (output.id === sourcePortId) {
          sourcePort = output;
          sourcePrimitiveId = primitive.id;
          break;
        }
      }
      if (sourcePort) break;
    }

    // Find target port
    for (const primitive of Object.values(composition.primitives)) {
      for (const input of primitive.inputs) {
        if (input.id === targetPortId) {
          targetPort = input;
          targetPrimitiveId = primitive.id;
          break;
        }
      }
      if (targetPort) break;
    }

    // Check if ports are found
    if (!sourcePort || !targetPort) {
      console.error('Connection failed: Source or target port not found', {
        sourcePortId,
        targetPortId,
        sourcePortFound: !!sourcePort,
        targetPortFound: !!targetPort
      });
      return null;
    }

    // Check if trying to connect to self
    if (sourcePrimitiveId === targetPrimitiveId) {
      console.error('Connection failed: Cannot connect a primitive to itself');
      return null;
    }

    // Check if a connection already exists between these ports
    const existingConnection = Object.values(composition.connections).find(
      conn => conn.sourcePortId === sourcePortId && conn.targetPortId === targetPortId
    );
    if (existingConnection) {
      console.error('Connection failed: Connection already exists between these ports');
      return null;
    }

    // Check if resource types are compatible
    // Instead of strict equality, check for compatibility
    const areTypesCompatible = checkResourceTypeCompatibility(sourcePort.resourceType, targetPort.resourceType);
    if (!areTypesCompatible) {
      console.error('Connection failed: Incompatible resource types', {
        sourceType: sourcePort.resourceType,
        targetType: targetPort.resourceType
      });
      return null;
    }

    // Create the connection
    const connection: Connection = {
      id: uuidv4(),
      sourcePortId,
      targetPortId,
      resourceType: sourcePort.resourceType,
    };

    composition = {
      ...composition,
      connections: {
        ...composition.connections,
        [connection.id]: connection,
      },
      updatedAt: new Date(),
    };

    console.log('Connection created successfully', connection);
    return connection;
  };

  // Helper function to check if resource types are compatible
  const checkResourceTypeCompatibility = (sourceType: string, targetType: string): boolean => {
    // If exact match, they're compatible
    if (sourceType === targetType) return true;
    
    // Normalize the types (lowercase for case-insensitive comparison)
    const sourceTypeLower = sourceType.toLowerCase();
    const targetTypeLower = targetType.toLowerCase();
    
    // If normalized match, they're compatible
    if (sourceTypeLower === targetTypeLower) return true;

    // Define compatibility rules for different resource types
    const compatibilityRules: Record<string, string[]> = {
      // Asset category
      'asset': ['token', 'liquidity', 'coin', 'currency', 'collateral', 'stakeAsset', 'stakereceipt', 'receipt'],
      'token': ['asset', 'liquidity', 'coin', 'currency', 'collateral', 'stakeAsset', 'stakereceipt', 'receipt'],
      'coin': ['asset', 'token', 'liquidity', 'currency', 'collateral'],
      'currency': ['asset', 'token', 'liquidity', 'coin', 'collateral'],
      'liquidity': ['token', 'asset', 'coin', 'currency'],
      'collateral': ['asset', 'token', 'coin', 'currency'],
      
      // Staking related
      'stake': ['token', 'asset', 'stakeAsset'],
      'stakeAsset': ['token', 'asset', 'stake'],
      'stakeReceipt': ['receipt', 'token', 'asset'],
      'receipt': ['stakeReceipt', 'token', 'asset', 'depositReceipt', 'loanReceipt'],
      
      // Loan related
      'loan': ['asset', 'token', 'debt'],
      'debt': ['loan', 'asset', 'token'],
      'depositReceipt': ['receipt', 'token', 'asset'],
      'loanReceipt': ['receipt', 'debt', 'loan'],
      
      // Yield related
      'interest': ['yield', 'rewards', 'revenue'],
      'yield': ['interest', 'rewards', 'revenue'],
      'rewards': ['yield', 'interest', 'asset', 'token', 'revenue'],
      'revenue': ['yield', 'interest', 'rewards', 'asset', 'token'],
    };

    // Check if target type is in the compatible list for source type
    if (compatibilityRules[sourceTypeLower] && 
        compatibilityRules[sourceTypeLower].some(t => t.toLowerCase() === targetTypeLower)) {
      return true;
    }

    // Check if source type is in the compatible list for target type
    if (compatibilityRules[targetTypeLower] && 
        compatibilityRules[targetTypeLower].some(t => t.toLowerCase() === sourceTypeLower)) {
      return true;
    }
    
    // Handle partial matches (e.g. "stakeAsset" should match with "asset")
    const partialMatch = (type1: string, type2: string): boolean => {
      return type1.toLowerCase().includes(type2.toLowerCase()) || 
             type2.toLowerCase().includes(type1.toLowerCase());
    };
    
    // Check common types that should be compatible via partial matching
    const commonTypes = ['asset', 'token', 'receipt', 'stake'];
    for (const commonType of commonTypes) {
      if ((sourceTypeLower.includes(commonType) || sourceTypeLower === commonType) &&
          (targetTypeLower.includes(commonType) || targetTypeLower === commonType)) {
        return true;
      }
    }

    return false;
  };

  // Remove a connection
  const removeConnection = (connectionId: string): void => {
    const { [connectionId]: removedConnection, ...remainingConnections } = composition.connections;

    composition = {
      ...composition,
      connections: remainingConnections,
      updatedAt: new Date(),
    };
  };

  // Validate the composition
  const validateCompositionFn = (): ValidationResult => {
    return validateComposition(composition);
  };

  // Export code (mock implementation for MVP)
  const exportCode = (): string => {
    const primitives = Object.values(composition.primitives);
    const connections = Object.values(composition.connections);
    
    let code = `// Generated Move code for composition: ${composition.name}\n\n`;
    code += `module ${composition.name.toLowerCase().replace(/\s+/g, '_')} {\n`;
    
    // Import statements
    code += '    use std::signer;\n';
    code += '    use aptos_framework::coin;\n';
    code += '    use aptos_framework::account;\n\n';
    
    // Generate primitive definitions
    primitives.forEach(primitive => {
      code += `    // ${primitive.label} (${primitive.type})\n`;
      
      // Generate struct based on primitive type
      switch (primitive.type) {
        case 'lendingPool':
          code += `    struct LendingPool has key {\n`;
          code += `        reserve: coin::Coin<${primitive.parameters.assetType?.value}>,\n`;
          code += `        interest_rate: u64, // ${primitive.parameters.interestRate?.value}%\n`;
          code += `        collateral_ratio: u64, // ${primitive.parameters.collateralRatio?.value}%\n`;
          code += `        liquidation_threshold: u64, // ${primitive.parameters.liquidationThreshold?.value}%\n`;
          code += `    }\n\n`;
          break;
        case 'ammPool':
          code += `    struct AmmPool has key {\n`;
          code += `        reserve_a: coin::Coin<${primitive.parameters.assetTypeA?.value}>,\n`;
          code += `        reserve_b: coin::Coin<${primitive.parameters.assetTypeB?.value}>,\n`;
          code += `        fee_percent: u64, // ${primitive.parameters.feePercent?.value}%\n`;
          code += `        lp_supply: u64,\n`;
          code += `    }\n\n`;
          break;
        case 'staking':
          code += `    struct StakingPool has key {\n`;
          code += `        staked: coin::Coin<${primitive.parameters.assetType?.value}>,\n`;
          code += `        rewards: coin::Coin<${primitive.parameters.rewardAssetType?.value}>,\n`;
          code += `        reward_rate: u64, // ${primitive.parameters.rewardRate?.value}%\n`;
          code += `        lock_period: u64, // ${primitive.parameters.lockPeriod?.value} days\n`;
          code += `    }\n\n`;
          break;
        case 'vault':
          code += `    struct Vault has key {\n`;
          code += `        assets: coin::Coin<${primitive.parameters.assetType?.value}>,\n`;
          code += `        strategy: u8, // ${primitive.parameters.strategy?.value}\n`;
          code += `        performance_fee: u64, // ${primitive.parameters.performanceFee?.value}%\n`;
          code += `        withdrawal_fee: u64, // ${primitive.parameters.withdrawalFee?.value}%\n`;
          code += `    }\n\n`;
          break;
      }
    });
    
    // Generate functions for each primitive
    primitives.forEach(primitive => {
      switch (primitive.type) {
        case 'lendingPool':
          // Lending pool functions
          code += `    // Initialize lending pool\n`;
          code += `    public fun initialize_lending_pool(account: &signer, interest_rate: u64, collateral_ratio: u64, liquidation_threshold: u64) {\n`;
          code += `        move_to(account, LendingPool {\n`;
          code += `            reserve: coin::zero<${primitive.parameters.assetType?.value}>(),\n`;
          code += `            interest_rate,\n`;
          code += `            collateral_ratio,\n`;
          code += `            liquidation_threshold,\n`;
          code += `        });\n`;
          code += `    }\n\n`;
          
          code += `    // Deposit to lending pool\n`;
          code += `    public fun deposit(account: &signer, amount: u64) acquires LendingPool {\n`;
          code += `        let deposit_coins = coin::withdraw<${primitive.parameters.assetType?.value}>(account, amount);\n`;
          code += `        let lending_pool = borrow_global_mut<LendingPool>(signer::address_of(account));\n`;
          code += `        coin::merge(&mut lending_pool.reserve, deposit_coins);\n`;
          code += `    }\n\n`;
          
          code += `    // Borrow from lending pool\n`;
          code += `    public fun borrow(account: &signer, amount: u64) acquires LendingPool {\n`;
          code += `        let lending_pool = borrow_global_mut<LendingPool>(signer::address_of(account));\n`;
          code += `        let coins = coin::extract(&mut lending_pool.reserve, amount);\n`;
          code += `        coin::deposit(signer::address_of(account), coins);\n`;
          code += `    }\n\n`;
          break;
        
        case 'ammPool':
          // AMM pool functions
          code += `    // Initialize AMM pool\n`;
          code += `    public fun initialize_amm_pool(account: &signer, fee_percent: u64) {\n`;
          code += `        move_to(account, AmmPool {\n`;
          code += `            reserve_a: coin::zero<${primitive.parameters.assetTypeA?.value}>(),\n`;
          code += `            reserve_b: coin::zero<${primitive.parameters.assetTypeB?.value}>(),\n`;
          code += `            fee_percent,\n`;
          code += `            lp_supply: 0,\n`;
          code += `        });\n`;
          code += `    }\n\n`;
          
          code += `    // Add liquidity to AMM pool\n`;
          code += `    public fun add_liquidity(account: &signer, amount_a: u64, amount_b: u64) acquires AmmPool {\n`;
          code += `        let coins_a = coin::withdraw<${primitive.parameters.assetTypeA?.value}>(account, amount_a);\n`;
          code += `        let coins_b = coin::withdraw<${primitive.parameters.assetTypeB?.value}>(account, amount_b);\n`;
          code += `        let amm_pool = borrow_global_mut<AmmPool>(signer::address_of(account));\n`;
          code += `        coin::merge(&mut amm_pool.reserve_a, coins_a);\n`;
          code += `        coin::merge(&mut amm_pool.reserve_b, coins_b);\n`;
          code += `        amm_pool.lp_supply = amm_pool.lp_supply + ((amount_a * amount_b) as u64);\n`;
          code += `    }\n\n`;
          
          code += `    // Swap in AMM pool\n`;
          code += `    public fun swap_a_to_b(account: &signer, amount_in: u64) acquires AmmPool {\n`;
          code += `        let coins_in = coin::withdraw<${primitive.parameters.assetTypeA?.value}>(account, amount_in);\n`;
          code += `        let amm_pool = borrow_global_mut<AmmPool>(signer::address_of(account));\n`;
          code += `        coin::merge(&mut amm_pool.reserve_a, coins_in);\n`;
          
          code += `        let reserve_a = coin::value(&amm_pool.reserve_a);\n`;
          code += `        let reserve_b = coin::value(&amm_pool.reserve_b);\n`;
          code += `        let amount_out = (amount_in * reserve_b) / (reserve_a + amount_in);\n`;
          code += `        let fee = (amount_out * amm_pool.fee_percent) / 10000;\n`;
          code += `        amount_out = amount_out - fee;\n`;
          
          code += `        let coins_out = coin::extract(&mut amm_pool.reserve_b, amount_out);\n`;
          code += `        coin::deposit(signer::address_of(account), coins_out);\n`;
          code += `    }\n\n`;
          break;
        
        case 'staking':
          // Staking pool functions
          code += `    // Initialize staking pool\n`;
          code += `    public fun initialize_staking_pool(account: &signer, reward_rate: u64, lock_period: u64) {\n`;
          code += `        move_to(account, StakingPool {\n`;
          code += `            staked: coin::zero<${primitive.parameters.assetType?.value}>(),\n`;
          code += `            rewards: coin::zero<${primitive.parameters.rewardAssetType?.value}>(),\n`;
          code += `            reward_rate,\n`;
          code += `            lock_period,\n`;
          code += `        });\n`;
          code += `    }\n\n`;
          
          code += `    // Stake tokens\n`;
          code += `    public fun stake(account: &signer, amount: u64) acquires StakingPool {\n`;
          code += `        let stake_coins = coin::withdraw<${primitive.parameters.assetType?.value}>(account, amount);\n`;
          code += `        let staking_pool = borrow_global_mut<StakingPool>(signer::address_of(account));\n`;
          code += `        coin::merge(&mut staking_pool.staked, stake_coins);\n`;
          code += `    }\n\n`;
          
          code += `    // Claim rewards\n`;
          code += `    public fun claim_rewards(account: &signer) acquires StakingPool {\n`;
          code += `        let staking_pool = borrow_global_mut<StakingPool>(signer::address_of(account));\n`;
          code += `        let staked_amount = coin::value(&staking_pool.staked);\n`;
          code += `        let rewards_amount = (staked_amount * staking_pool.reward_rate) / 100 / 365;\n`;
          code += `        let reward_coins = coin::extract(&mut staking_pool.rewards, rewards_amount);\n`;
          code += `        coin::deposit(signer::address_of(account), reward_coins);\n`;
          code += `    }\n\n`;
          break;
        
        case 'vault':
          // Vault functions
          code += `    // Initialize vault\n`;
          code += `    public fun initialize_vault(account: &signer, strategy: u8, performance_fee: u64, withdrawal_fee: u64) {\n`;
          code += `        move_to(account, Vault {\n`;
          code += `            assets: coin::zero<${primitive.parameters.assetType?.value}>(),\n`;
          code += `            strategy,\n`;
          code += `            performance_fee,\n`;
          code += `            withdrawal_fee,\n`;
          code += `        });\n`;
          code += `    }\n\n`;
          
          code += `    // Deposit to vault\n`;
          code += `    public fun deposit_to_vault(account: &signer, amount: u64) acquires Vault {\n`;
          code += `        let deposit_coins = coin::withdraw<${primitive.parameters.assetType?.value}>(account, amount);\n`;
          code += `        let vault = borrow_global_mut<Vault>(signer::address_of(account));\n`;
          code += `        coin::merge(&mut vault.assets, deposit_coins);\n`;
          code += `    }\n\n`;
          
          code += `    // Withdraw from vault\n`;
          code += `    public fun withdraw_from_vault(account: &signer, amount: u64) acquires Vault {\n`;
          code += `        let vault = borrow_global_mut<Vault>(signer::address_of(account));\n`;
          code += `        let fee = (amount * vault.withdrawal_fee) / 10000;\n`;
          code += `        let withdraw_amount = amount - fee;\n`;
          code += `        let coins = coin::extract(&mut vault.assets, withdraw_amount);\n`;
          code += `        coin::deposit(signer::address_of(account), coins);\n`;
          code += `    }\n\n`;
          break;
      }
    });
    
    code += '}\n';
    
    return code;
  };

  return {
    getComposition,
    addPrimitive,
    updatePrimitive,
    removePrimitive,
    updatePrimitivePosition,
    updatePrimitiveParameter,
    addConnection,
    removeConnection,
    validateComposition: validateCompositionFn,
    exportCode,
  };
} 