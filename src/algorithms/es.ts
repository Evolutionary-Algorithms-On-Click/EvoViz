import { EAConfig, Population, Individual } from '../utils/common';
import { calcSphereFitness, randomInt, randomGaussian } from '../utils/functions';
import { ESLogEntry, StepLog } from '../utils/internal-algo-logs';

export const initES = (config: EAConfig): Population => {
  return Array.from({ length: config.populationSize }, (_, i) => {
    const genes = Array.from({ length: config.genesCount }, () => randomInt(-5, 5));
    return {
      id: i,
      genes,
      fitness: calcSphereFitness(genes)
    };
  });
};

export const stepES = (pop: Population, config: EAConfig): { nextPop: Population; logs: StepLog } => {
  // (mu + mu) Strategy:
  // generate mu children from current mu parents (1-to-1)
  // Pool = 2*mu
  // Select best mu
  
  const children: Individual[] = [];
  const logs: ESLogEntry[] = [];
  
  //  mutate only for canonical simple ES
  pop.forEach((parent, i) => {
      const noiseVec: number[] = [];
      const childGenes = parent.genes.map(g => {
          const sigma = config.sigma ?? 1.0;
          const noise = randomGaussian(0, sigma);
          noiseVec.push(parseFloat(noise.toFixed(2)));
          
          let val = g + noise;
          // Clamp for only viz
          if (val < -5) val = -5;
          if (val > 5) val = 5;
          return val;
      });

      const childFitness = calcSphereFitness(childGenes);
      
      children.push({
          id: config.populationSize + i, // Temporary ID
          genes: childGenes,
          fitness: childFitness
      });

      // Prepare partial log - survival status known after sorting
      logs.push({
          id: config.populationSize + i,
          parentId: parent.id,
          parentGenes: [...parent.genes],
          parentFitness: parent.fitness,
          noiseVector: noiseVec,
          childGenes: childGenes,
          childFitness: childFitness,
          isChildSurvivor: false, // Updated later
          isParentSurvivor: false // Updated later
      });
  });

  const pool = [...pop, ...children];
  pool.sort((a, b) => a.fitness - b.fitness);
  
  const survivors = pool.slice(0, config.populationSize);
  
  // Update IDs for next gen
  const nextPop = survivors.map((ind, i) => ({
      ...ind,
      id: i
  }));

  // update logs with survival status
  const survivorOriginalIds = new Set(survivors.map(s => s.id)); 
  
  logs.forEach(log => {
      
      // Check if Child Survived
      if (survivorOriginalIds.has(log.id)) {
          log.isChildSurvivor = true;
      }
      
      // Check if Parent Survived
      if (survivorOriginalIds.has(log.parentId)) {
          log.isParentSurvivor = true;
      }
  });

  return { nextPop, logs };
};
