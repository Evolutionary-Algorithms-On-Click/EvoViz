import { KnapsackItem } from '../data/knapsack';
import { EAConfig } from './common';

export const calcSphereFitness = (genes: number[]): number => {
  return genes.reduce((acc, val) => acc + (val * val), 0);
};

export const calcAckleyFitness = (genes: number[]): number => {
  const a = 20;
  const b = 0.2;
  const c = 2 * Math.PI;
  const d = genes.length;

  const sumSq = genes.reduce((acc, val) => acc + (val * val), 0);
  const sumCos = genes.reduce((acc, val) => acc + Math.cos(c * val), 0);

  const term1 = -a * Math.exp(-b * Math.sqrt(sumSq / d));
  const term2 = -Math.exp(sumCos / d);

  return term1 + term2 + a + Math.E;
};

export const calcKnapsackFitness = (genes: number[], items: KnapsackItem[], capacity: number): { fitness: number, weight: number, isValid: boolean } => {
  let totalValue = 0;
  let totalWeight = 0;
  
  genes.forEach((g, i) => {
    if (g === 1 && items[i]) {
      totalValue += items[i].value;
      totalWeight += items[i].weight;
    }
  });

  const isValid = totalWeight <= capacity;
  return { 
    fitness: isValid ? totalValue : 0, 
    weight: totalWeight, 
    isValid 
  };
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomGaussian = (mean: number = 0, stdDev: number = 1): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
};


// evals the GP tree for linear seq
export const evaluateGP = (genes: number[], x: number, config: EAConfig): number => {
    let val = config.gpProblem === 'Linear' ? 50 : x;
    const ops = config.gpOperations;
    if (ops.length === 0) return val;

    for (const g of genes) {
        // Gene is index into ops array. 
        // Modulo to be safe if ops changed size.
        const op = ops[g % ops.length]; 
        
        switch (op.type) {
            case 'ADD_1': val += 1; break;
            case 'SUB_1': val -= 1; break;
            case 'SUB_10': val -= 10; break;
            case 'DIV_2': val = Math.floor(val / 2); break;
            case 'MUL_2': val *= 2; break;
            case 'ADD_X': val += x; break;
            case 'SIN': val = Math.sin(val); break;
            case 'COS': val = Math.cos(val); break;
            case 'ADD_CONST': val += 5; break; // Example const
        }
    }
    return val;
};
