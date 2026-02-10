
import { EAConfig, Population } from "../utils/common";
import { calcSphereFitness, calcAckleyFitness, randomInt } from "../utils/functions";
import { PSOLogEntry, StepLog } from "../utils/internal-algo-logs";


export const initPSO = (config: EAConfig): Population => {
  const calcFitness = config.problemType === 'Ackley' ? calcAckleyFitness : calcSphereFitness;
  return Array.from({ length: config.populationSize }, (_, i) => {
    const genes = Array.from({ length: config.genesCount }, () => randomInt(-5, 5));
    const fitness = calcFitness(genes);
    return {
      id: i,
      genes,
      fitness,
      position: [...genes],
      velocity: Array.from({ length: config.genesCount }, () => randomInt(-2, 2)),
      bestPosition: [...genes],
      bestFitness: fitness
    };
  });
};

export const stepPSO = (pop: Population, config: EAConfig): { nextPop: Population; logs: StepLog } => {
  let gBest = pop[0];
  for(const p of pop) {
    if ((p.bestFitness ?? Infinity) < (gBest.bestFitness ?? Infinity)) {
      gBest = p;
    }
  }

  const logs: PSOLogEntry[] = [];
  const calcFitness = config.problemType === 'Ackley' ? calcAckleyFitness : calcSphereFitness;

  const nextPop = pop.map(p => {
    const oldVelocity = [...(p.velocity || [])];
    const inertiaTerm: number[] = [];
    const cognitiveTerm: number[] = [];
    const socialTerm: number[] = [];
    
    const newVelocity = p.velocity!.map((v, i) => {
       const r1 = Math.random();
       const r2 = Math.random();

       const inertia = config.w * v;
       const cog = config.c1 * r1 * ((p.bestPosition?.[i] ?? 0) - p.genes[i]);
       const soc = config.c2 * r2 * ((gBest.bestPosition?.[i] ?? 0) - p.genes[i]);
       
       inertiaTerm.push(parseFloat(inertia.toFixed(2)));
       cognitiveTerm.push(parseFloat(cog.toFixed(2)));
       socialTerm.push(parseFloat(soc.toFixed(2)));

       let nv = inertia + cog + soc;
       
       if (nv > 5) nv = 5;
       if (nv < -5) nv = -5;
       
       return Math.round(nv); 
    });

    const newGenes = p.position!.map((pos, j) => {
        let nx = pos + newVelocity[j];
        // Clamp to [-5, 5]
        if (nx < -5) nx = -5;
        if (nx > 5) nx = 5;
        return nx;
    });

    const newFitness = calcFitness(newGenes);
    
    let newBestPos = p.bestPosition!;
    let newBestFit = p.bestFitness!;
    
    if (newFitness < newBestFit) {
      newBestPos = [...newGenes];
      newBestFit = newFitness;
    }

    logs.push({
        id: p.id,
        oldVelocity,
        inertiaTerm,
        cognitiveTerm,
        socialTerm,
        newVelocity,
        newPosition: newGenes
    });

    return {
      ...p,
      genes: newGenes,
      fitness: newFitness,
      velocity: newVelocity,
      bestPosition: newBestPos,
      bestFitness: newBestFit
    };
  });

  return { nextPop, logs };
};
