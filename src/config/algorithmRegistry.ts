import { Population, EAConfig } from '../utils/common';
import { StepLog } from '../utils/internal-algo-logs';
import { initGA, stepGA } from '../algorithms/ga';
import { initDE, stepDE } from '../algorithms/de';
import { initPSO, stepPSO } from '../algorithms/pso';
import { initGP, stepGP } from '../algorithms/gp';
import { initES, stepES } from '../algorithms/es';
import { AlgorithmId } from './algorithms';

export type AlgorithmInit = (config: EAConfig) => Population;
export type AlgorithmStep = (pop: Population, config: EAConfig) => { nextPop: Population; logs: StepLog };

export interface AlgorithmFunctions {
  init: AlgorithmInit;
  step: AlgorithmStep;
}

export const ALGORITHM_REGISTRY: Record<AlgorithmId, AlgorithmFunctions> = {
  GA: {
    init: initGA,
    step: stepGA,
  },
  DE: {
    init: initDE,
    step: stepDE,
  },
  PSO: {
    init: initPSO,
    step: stepPSO,
  },
  GP: {
    init: initGP,
    step: stepGP,
  },
  ES: {
    init: initES,
    step: stepES,
  },
};

// Helper function to get algorithm functions
export const getAlgorithmFunctions = (id: AlgorithmId): AlgorithmFunctions => {
  return ALGORITHM_REGISTRY[id];
};

