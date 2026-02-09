import { EAConfig, Population } from "../utils/common";
import { calcSphereFitness, randomInt } from "../utils/functions";
import { DELogEntry, StepLog } from "../utils/internal-algo-logs";


// override init for Sphere: Range -5 to 5 for simplicity
export const initDE = (config: EAConfig): Population => {
    return Array.from({ length: config.populationSize }, (_, i) => {
        const genes = Array.from({ length: config.genesCount }, () => randomInt(-5, 5));
        return {
            id: i,
            genes,
            fitness: calcSphereFitness(genes)
        };
    });
};

export const stepDE = (pop: Population, config: EAConfig): { nextPop: Population; logs: StepLog } => {
    const logs: DELogEntry[] = [];

    const nextPop = pop.map((ind, i) => {
        let idxs = new Set<number>();
        idxs.add(i);
        while (idxs.size < 4) {
            idxs.add(randomInt(0, config.populationSize - 1));
        }
        const arr = Array.from(idxs);
        const r1Id = arr[1];
        const r2Id = arr[2];
        const r3Id = arr[3];

        const a = pop[r1Id];
        const b = pop[r2Id];
        const c = pop[r3Id];

        const F = config.F;
        const R = randomInt(0, config.genesCount - 1);

        const diffVec: number[] = [];
        const weightedVec: number[] = [];
        const mutantVec: number[] = [];
        const trialGenes: number[] = [];

        ind.genes.forEach((x, j) => {
            const diff = b.genes[j] - c.genes[j];
            const weighted = F * diff;
            let mut = a.genes[j] + weighted;

            // Clamp -5 to 5 to keep it bounded but allow movement
            if (mut < -5) mut = -5;
            if (mut > 5) mut = 5;

            diffVec.push(diff);
            weightedVec.push(weighted);
            mutantVec.push(mut);

            if (Math.random() < config.crossoverRate || j === R) {
                trialGenes.push(mut);
            } else {
                trialGenes.push(x);
            }
        });

        const trialFitness = calcSphereFitness(trialGenes);
        const mutantFitness = calcSphereFitness(mutantVec);
        const replaces = trialFitness <= ind.fitness;

        logs.push({
            id: i,
            targetId: i,
            targetFitness: ind.fitness,
            r1: r1Id,
            r2: r2Id,
            r3: r3Id,
            diffVector: diffVec,
            weightedDiff: weightedVec,
            mutantVector: mutantVec,
            mutantFitness,
            trialVector: trialGenes,
            trialFitness,
            replacesTarget: replaces
        });

        if (replaces) {
            return { ...ind, genes: trialGenes, fitness: trialFitness };
        } else {
            return ind;
        }
    });

    return { nextPop, logs };
};
