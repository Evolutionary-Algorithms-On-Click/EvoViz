import { Cpu, Zap, Globe, GitBranch, Activity, LucideIcon } from 'lucide-react';

export type VisualizationType = 'knapsack' | 'real-valued' | 'gp-linear' | 'gp-sine';
export type ProblemType = 'knapsack' | 'sphere' | 'ackley' | 'gp-linear' | 'gp-sine';
export type FitnessDirection = 'maximize' | 'minimize';

export interface AlgorithmConfig {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'emerald' | 'purple' | 'fuchsia';
  visualizationType: VisualizationType;
  problemType: ProblemType;
  fitnessDirection: FitnessDirection;
  supports3D: boolean;
  defaultGenesCount: number;
  hasProblemSelector?: boolean; // For DE, PSO, ES (Sphere vs Ackley)
  hasGPProblemSelector?: boolean; // For GP (Linear vs Sine)
  configSections: {
    evolutionParams?: boolean; // mutationRate, crossoverRate
    deParams?: boolean; // F (differential weight)
    psoParams?: boolean; // w, c1, c2
    esParams?: boolean; // offspringSize, sigma
    gaParams?: boolean; // tournamentSize
    gpParams?: boolean; // gpProblem, gpOperations
    knapsackParams?: boolean; // knapsackItems, knapsackCapacity
  };
}

export const ALGORITHMS: readonly AlgorithmConfig[] = [
  {
    id: 'GA',
    name: 'GA',
    fullName: 'Genetic Algorithm',
    description: 'The OG of evolution. Uses binary genes, crossover (mating), and mutation to pack the perfect backpack. It\'s Darwinism, but for math problems.',
    icon: Cpu,
    color: 'blue',
    visualizationType: 'knapsack',
    problemType: 'knapsack',
    fitnessDirection: 'maximize',
    supports3D: false,
    defaultGenesCount: 0, // Determined by knapsack items count
    configSections: {
      evolutionParams: true,
      gaParams: true,
      knapsackParams: true,
    },
  },
  {
    id: 'DE',
    name: 'DE',
    fullName: 'Differential Evolution',
    description: 'Vector calculus meets survival. It uses differences between agents to drive mutation. Excellent for continuous functions and impressing your math professor.',
    icon: Zap,
    color: 'amber',
    visualizationType: 'real-valued',
    problemType: 'sphere',
    fitnessDirection: 'minimize',
    supports3D: true,
    defaultGenesCount: 2,
    hasProblemSelector: true,
    configSections: {
      evolutionParams: true,
      deParams: true,
    },
  },
  {
    id: 'PSO',
    name: 'PSO',
    fullName: 'Particle Swarm Optimization',
    description: 'Bird flocking simulator. Particles fly through search space, remembering their best spots and gossiping with neighbors about theirs. No actual birds harmed.',
    icon: Globe,
    color: 'emerald',
    visualizationType: 'real-valued',
    problemType: 'sphere',
    fitnessDirection: 'minimize',
    supports3D: true,
    defaultGenesCount: 2,
    hasProblemSelector: true,
    configSections: {
      psoParams: true,
    },
  },
  {
    id: 'GP',
    name: 'GP',
    fullName: 'Genetic Programming',
    description: 'Evolution writing code. We breed syntax trees that eventually (hopefully) solve the equation. It\'s like infinite monkeys with typewriters, but optimized.',
    icon: GitBranch,
    color: 'purple',
    visualizationType: 'gp-linear', // Will change based on gpProblem
    problemType: 'gp-linear',
    fitnessDirection: 'minimize',
    supports3D: false,
    defaultGenesCount: 5, // For Sine, 2 for Linear
    hasGPProblemSelector: true,
    configSections: {
      evolutionParams: true,
      gpParams: true,
    },
  },
  {
    id: 'ES',
    name: 'ES',
    fullName: 'Evolution Strategies',
    description: 'The self-optimizing optimizer. It adapts its own mutation rates (Sigma) on the fly. It learns how to learn. Meta, right?',
    icon: Activity,
    color: 'fuchsia',
    visualizationType: 'real-valued',
    problemType: 'sphere',
    fitnessDirection: 'minimize',
    supports3D: true,
    defaultGenesCount: 2,
    hasProblemSelector: true,
    configSections: {
      esParams: true,
    },
  },
] as const;

// Type helper to get algorithm IDs
export type AlgorithmId = typeof ALGORITHMS[number]['id'];

// Helper function to get algorithm config by ID
export const getAlgorithmConfig = (id: string): AlgorithmConfig | undefined => {
  return ALGORITHMS.find(algo => algo.id === id);
};

// Helper function to check if algorithm supports 3D visualization
export const supports3DVisualization = (algoId: string, gpProblem?: 'Linear' | 'Sine'): boolean => {
  const config = getAlgorithmConfig(algoId);
  if (!config) return false;
  
  if (config.id === 'GP') {
    return gpProblem === 'Linear';
  }
  
  return config.supports3D;
};

// Helper function to get visualization type
export const getVisualizationType = (algoId: string, gpProblem?: 'Linear' | 'Sine'): VisualizationType => {
  const config = getAlgorithmConfig(algoId);
  if (!config) return 'real-valued';
  
  if (config.id === 'GP') {
    return gpProblem === 'Sine' ? 'gp-sine' : 'gp-linear';
  }
  
  return config.visualizationType;
};

