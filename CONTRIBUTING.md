# Contributing to EvoViz

Thank you for your interest in contributing to EvoViz! This guide will help you add new evolutionary algorithms to the platform.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Adding a New Algorithm](#adding-a-new-algorithm)
  - [Step 1: Create Algorithm Implementation](#step-1-create-algorithm-implementation)
  - [Step 2: Register Algorithm Configuration](#step-2-register-algorithm-configuration)
  - [Step 3: Register Algorithm Functions](#step-3-register-algorithm-functions)
  - [Step 4: Add Log Types (Optional)](#step-4-add-log-types-optional)
- [Configuration Options](#configuration-options)
- [Testing Your Algorithm](#testing-your-algorithm)
- [Example: Adding a Simple Algorithm](#example-adding-a-simple-algorithm)

## Architecture Overview

EvoViz uses a centralized configuration system that makes adding new algorithms straightforward. The architecture consists of:

1. **Algorithm Configuration** (`src/config/algorithms.ts`): Defines metadata, UI properties, and visualization settings
2. **Algorithm Registry** (`src/config/algorithmRegistry.ts`): Maps algorithm IDs to their implementation functions
3. **Algorithm Implementation** (`src/algorithms/`): Contains the actual algorithm logic (init and step functions)
4. **Log Types** (`src/utils/internal-algo-logs.ts`): Defines logging structures for step-by-step visualization

The UI components automatically discover and render algorithms based on the configuration, so you don't need to modify any component files.

## Adding a New Algorithm

### Step 1: Create Algorithm Implementation

Create a new file in `src/algorithms/` (e.g., `src/algorithms/youralgo.ts`).

Your algorithm file must export two functions:

```typescript
import { Population, EAConfig } from '../utils/common';
import { StepLog } from '../utils/internal-algo-logs';

// Initialize the population
export const initYourAlgo = (config: EAConfig): Population => {
  // Create initial population
  // Each individual must have: { id, genes, fitness }
  return Array.from({ length: config.populationSize }, (_, i) => {
    const genes = /* generate initial genes */;
    const fitness = /* calculate fitness */;
    return { id: i, genes, fitness };
  });
};

// Execute one generation/step
export const stepYourAlgo = (
  pop: Population, 
  config: EAConfig
): { nextPop: Population; logs: StepLog } => {
  // Implement one generation of your algorithm
  const nextPop: Population = /* new population */;
  const logs: StepLog = /* log entries for visualization */;
  
  return { nextPop, logs };
};
```

**Key Requirements:**
- `Population` is an array of `Individual` objects
- Each `Individual` must have: `id: number`, `genes: number[]`, `fitness: number`
- You can add optional fields like `bestPosition`, `velocity`, etc. (see `src/utils/common.ts`)
- `logs` should be an array of log entries matching your algorithm's log type

### Step 2: Register Algorithm Configuration

Add your algorithm to the `ALGORITHMS` array in `src/config/algorithms.ts`:

```typescript
import { YourIcon } from 'lucide-react'; // Choose an icon from lucide-react

export const ALGORITHMS: readonly AlgorithmConfig[] = [
  // ... existing algorithms
  {
    id: 'YOURALGO',                    // Unique ID (uppercase, short)
    name: 'YOURALGO',                   // Short name for UI
    fullName: 'Your Algorithm Name',    // Full display name
    description: 'Description of your algorithm...',
    icon: YourIcon,                      // Icon from lucide-react
    color: 'blue',                      // 'blue' | 'amber' | 'emerald' | 'purple' | 'fuchsia'
    visualizationType: 'real-valued',   // 'knapsack' | 'real-valued' | 'gp-linear' | 'gp-sine'
    problemType: 'sphere',              // 'knapsack' | 'sphere' | 'ackley' | 'gp-linear' | 'gp-sine'
    fitnessDirection: 'minimize',        // 'maximize' | 'minimize'
    supports3D: true,                   // Whether to show 3D visualization
    defaultGenesCount: 2,               // Default number of genes/dimensions
    hasProblemSelector: false,           // Show Sphere/Ackley selector (for real-valued)
    hasGPProblemSelector: false,         // Show Linear/Sine selector (for GP)
    configSections: {
      evolutionParams: false,           // Show mutation/crossover rate controls
      deParams: false,                   // Show DE-specific params (F)
      psoParams: false,                  // Show PSO-specific params (w, c1, c2)
      esParams: false,                   // Show ES-specific params (offspringSize, sigma)
      gaParams: false,                   // Show GA-specific params (tournamentSize)
      gpParams: false,                   // Show GP-specific params (gpProblem, gpOperations)
      knapsackParams: false,             // Show knapsack editor
    },
  },
];
```

**Configuration Options Explained:**

- **visualizationType**: Determines how the algorithm is visualized
  - `'knapsack'`: For binary/knapsack problems (like GA)
  - `'real-valued'`: For continuous optimization (like DE, PSO, ES)
  - `'gp-linear'` or `'gp-sine'`: For genetic programming problems

- **problemType**: The default problem your algorithm solves
  - For real-valued algorithms, set `hasProblemSelector: true` to allow users to choose between Sphere/Ackley

- **configSections**: Controls which parameter panels appear in the UI
  - Only enable sections relevant to your algorithm
  - If you need custom parameters, you may need to extend `EAConfig` in `src/utils/common.ts`

- **supports3D**: Set to `true` if your algorithm works with 2D continuous problems (genes.length === 2) and you want 3D visualization

### Step 3: Register Algorithm Functions

Add your algorithm's functions to the registry in `src/config/algorithmRegistry.ts`:

```typescript
import { initYourAlgo, stepYourAlgo } from '../algorithms/youralgo';

export const ALGORITHM_REGISTRY: Record<AlgorithmId, AlgorithmFunctions> = {
  // ... existing algorithms
  YOURALGO: {
    init: initYourAlgo,
    step: stepYourAlgo,
  },
};
```

### Step 4: Add Log Types (Optional)

If you want detailed step-by-step logs (like the existing algorithms), add log types to `src/utils/internal-algo-logs.ts`:

```typescript
export interface YourAlgoLogEntry extends BaseLogEntry {
  // Define fields that capture your algorithm's internal operations
  // Example:
  parentId: number;
  operation: string;
  result: number[];
}

// Update StepLog type to include your log type
export type StepLog = 
  | GALogEntry[] 
  | DELogEntry[] 
  | PSOLogEntry[] 
  | GPLogEntry[] 
  | ESLogEntry[]
  | YourAlgoLogEntry[];  // Add your type
```

Then create a log table component in `src/components/StepLogView.tsx`:

```typescript
const YourAlgoLogTable: React.FC<{logs: YourAlgoLogEntry[]}> = ({ logs }) => (
  <table className="w-full text-xs text-left text-slate-300 font-mono">
    {/* Your table structure */}
  </table>
);

// Add to StepLogView component:
{algo === 'YOURALGO' && logs[0] && 'yourField' in logs[0] && (
  <YourAlgoLogTable logs={logs as YourAlgoLogEntry[]} />
)}
```

## Configuration Options

### Extending EAConfig

If your algorithm needs custom configuration parameters, add them to `EAConfig` in `src/utils/common.ts`:

```typescript
export interface EAConfig {
  // ... existing fields
  yourAlgoParam: number;  // Add your custom parameter
}

export const DEFAULT_CONFIG: EAConfig = {
  // ... existing defaults
  yourAlgoParam: 0.5,  // Add default value
};
```

Then add UI controls in `src/components/ConfigPanel.tsx`:

```typescript
{algoConfig.configSections.yourAlgoParams && (
  <div className="space-y-2">
    <label>Your Parameter</label>
    <input 
      type="number"
      value={config.yourAlgoParam}
      onChange={(e) => handleChange('yourAlgoParam', parseFloat(e.target.value))}
    />
  </div>
)}
```

Don't forget to add `yourAlgoParams: true` to your algorithm's `configSections`!

## Testing Your Algorithm

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to your algorithm:**
   - Your algorithm should appear on the landing page
   - Click on it to open the visualizer

3. **Test basic functionality:**
   - Click "Start" and verify the algorithm runs
   - Check that fitness values update correctly
   - Verify visualizations render properly

4. **Test configuration:**
   - Adjust parameters and verify they affect the algorithm
   - Test reset functionality

5. **Test edge cases:**
   - Very small/large population sizes
   - Extreme parameter values
   - Maximum generations reached

## Example: Adding a Simple Algorithm

Here's a minimal example of adding a simple random search algorithm:

**1. Create `src/algorithms/randomsearch.ts`:**

```typescript
import { Population, EAConfig } from '../utils/common';
import { StepLog } from '../utils/internal-algo-logs';
import { calcSphereFitness } from '../utils/functions';

export const initRandomSearch = (config: EAConfig): Population => {
  return Array.from({ length: config.populationSize }, (_, i) => {
    const genes = Array.from({ length: config.genesCount }, () => 
      Math.random() * 10 - 5  // Random value in [-5, 5]
    );
    const fitness = calcSphereFitness(genes);
    return { id: i, genes, fitness };
  });
};

export const stepRandomSearch = (
  pop: Population,
  config: EAConfig
): { nextPop: Population; logs: StepLog } => {
  // Simple random search: generate new random solutions
  const nextPop = Array.from({ length: config.populationSize }, (_, i) => {
    const genes = Array.from({ length: config.genesCount }, () => 
      Math.random() * 10 - 5
    );
    const fitness = calcSphereFitness(genes);
    return { id: i, genes, fitness };
  });
  
  return { nextPop, logs: [] }; // No detailed logs for this simple example
};
```

**2. Add to `src/config/algorithms.ts`:**

```typescript
import { Shuffle } from 'lucide-react';

// In ALGORITHMS array:
{
  id: 'RS',
  name: 'RS',
  fullName: 'Random Search',
  description: 'A simple baseline algorithm that generates random solutions.',
  icon: Shuffle,
  color: 'blue',
  visualizationType: 'real-valued',
  problemType: 'sphere',
  fitnessDirection: 'minimize',
  supports3D: true,
  defaultGenesCount: 2,
  hasProblemSelector: true,
  configSections: {
    // No special parameters needed
  },
}
```

**3. Add to `src/config/algorithmRegistry.ts`:**

```typescript
import { initRandomSearch, stepRandomSearch } from '../algorithms/randomsearch';

// In ALGORITHM_REGISTRY:
RS: {
  init: initRandomSearch,
  step: stepRandomSearch,
},
```

That's it! Your algorithm will now appear in the UI automatically.

## Important Notes

### Algorithm ID Format
- Use **uppercase** letters (e.g., `'GA'`, `'DE'`, `'PSO'`)
- Keep it short (2-4 characters recommended)
- Make it unique and descriptive

### Icon Selection
- Icons are imported from `lucide-react`
- Choose an icon that represents your algorithm well
- Available icons: `Cpu`, `Zap`, `Globe`, `GitBranch`, `Activity`, `Shuffle`, `TrendingUp`, `Flame`, `Bug`, `List`, `Target`, and many more
- Browse all icons at: https://lucide.dev/icons/

### Color Options
Available colors: `'blue'`, `'amber'`, `'emerald'`, `'purple'`, `'fuchsia'`
- Each color has a matching theme for borders, shadows, and hover effects
- Choose a color that's not already heavily used for visual variety

### Layout Considerations
- The landing page automatically displays all algorithms in a responsive grid
- 3 columns on tablet/PC (900px+), 1 column on mobile
- Incomplete rows (1-2 items) are automatically centered
- All cards maintain consistent sizing

### Type Safety
- The `AlgorithmId` type is automatically generated from the `ALGORITHMS` array
- TypeScript will catch errors if you reference a non-existent algorithm ID
- Always use the `AlgorithmId` type when working with algorithm IDs

## Need Help?

- Check existing algorithm implementations in `src/algorithms/` for reference
- Review the configuration of similar algorithms in `src/config/algorithms.ts`
- Look at how visualizations are handled in `src/components/Visualizer.tsx`
- Examine `src/components/ConfigPanel.tsx` to see how config sections are rendered
- Check `src/components/LandingPage.tsx` to understand how algorithms are displayed

## Troubleshooting

### Algorithm doesn't appear on landing page
- Verify the algorithm is in the `ALGORITHMS` array in `src/config/algorithms.ts`
- Check that the array export is correct
- Ensure there are no TypeScript errors

### Algorithm functions not found
- Verify the algorithm is registered in `ALGORITHM_REGISTRY` in `src/config/algorithmRegistry.ts`
- Check that import paths are correct
- Ensure function names match between implementation and registry

### Configuration panel not showing
- Check that `configSections` flags are set correctly
- Verify the relevant section is implemented in `ConfigPanel.tsx` (if using custom params)
- For standard params (evolutionParams, etc.), they should work automatically

### Type errors
- Ensure `AlgorithmId` type includes your new algorithm (it's auto-generated from `ALGORITHMS`)
- Check that all required fields in `AlgorithmConfig` are provided
- Verify function signatures match `AlgorithmInit` and `AlgorithmStep` types

Happy coding!

