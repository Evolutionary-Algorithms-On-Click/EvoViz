import { AlgorithmId } from '../config/algorithms';

export type LogType = AlgorithmId;

export interface BaseLogEntry {
  id: number;
}

export interface GALogEntry extends BaseLogEntry {
  parents: [number, number];
  crossoverPoint: number;
  preMutation: number[];
  mutationIndex: number | null;
  final: number[];
  isValid: boolean; 
  weight: number;   
}

export interface DELogEntry extends BaseLogEntry {
  targetId: number;
  targetFitness: number;
  r1: number;
  r2: number;
  r3: number;
  diffVector: number[]; 
  weightedDiff: number[];
  mutantVector: number[];
  mutantFitness: number;
  trialVector: number[];
  trialFitness: number;
  replacesTarget: boolean;
}

export interface PSOLogEntry extends BaseLogEntry {
  oldVelocity: number[];
  inertiaTerm: number[];
  cognitiveTerm: number[];
  socialTerm: number[];
  newVelocity: number[];
  newPosition: number[];
}

export interface GPLogEntry extends BaseLogEntry {
  parents: [number, number];
  crossoverPoint: number;
  mutationIndex: number | null;
  expressionBefore: string;
  expressionAfter: string;
}

export interface ESLogEntry extends BaseLogEntry {
  parentId: number;
  parentGenes: number[];
  parentFitness: number;
  noiseVector: number[];
  childGenes: number[];
  childFitness: number;
  isChildSurvivor: boolean;
  isParentSurvivor: boolean;
}

export type StepLog = GALogEntry[] | DELogEntry[] | PSOLogEntry[] | GPLogEntry[] | ESLogEntry[];
