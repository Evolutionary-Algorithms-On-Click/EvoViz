import React from 'react';
import { Individual, EAConfig } from '../utils/common';
import { KnapsackItem } from '../data/knapsack';
import { decodeGP } from '../algorithms/gp';

interface Props {
  population: Individual[];
  algo: string;
  knapsackItems: KnapsackItem[];
  knapsackCapacity: number;
  config?: EAConfig;
}

const PopulationTable: React.FC<Props> = ({ population, algo, knapsackItems, knapsackCapacity, config }) => {
  const isGP = algo === 'GP';
  const isGA = algo === 'GA'; // Knapsack

  const getKnapsackDetails = (genes: number[]) => {
      let w = 0;
      let v = 0;
      genes.forEach((g, i) => {
          if (g === 1 && knapsackItems[i]) {
              w += knapsackItems[i].weight;
              v += knapsackItems[i].value;
          }
      });
      return { w, v };
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/50 mt-6">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs uppercase bg-slate-900 text-slate-400">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">
                {isGA ? 'Selected Items (0/1)' : 'Genes / Structure'}
            </th>
            {isGP && <th className="px-4 py-3">Expression</th>}
            {isGA && <th className="px-4 py-3">Weight / Limit</th>}
            <th className="px-4 py-3">Fitness</th>
          </tr>
        </thead>
        <tbody>
          {population.map((ind) => {
             const kDetails = isGA ? getKnapsackDetails(ind.genes) : null;
             
             return (
                <tr key={ind.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-2 font-mono">{ind.id + 1}</td>
                <td className="px-4 py-2 font-mono">
                    {isGP ? (
                    <span className="text-blue-400">
                        [{ind.genes.map(g => {
                            if (config && config.gpOperations.length > 0) {
                                return config.gpOperations[g % config.gpOperations.length].label;
                            }
                            return g;
                        }).join(', ')}]
                    </span>
                    ) : (
                    <span className={isGA ? "text-amber-400" : "text-emerald-400"}>
                        [{ind.genes.map(g => isGA ? g : g.toFixed(1)).join(', ')}]
                    </span>
                    )}
                </td>
                {isGP && (
                    <td className="px-4 py-2 font-mono text-xs text-slate-400">
                        {config ? decodeGP(ind.genes, config) : ''}
                    </td>
                )}
                {isGA && kDetails && (
                    <td className="px-4 py-2 font-mono text-xs">
                        <span className={kDetails.w > knapsackCapacity ? "text-red-500 font-bold" : "text-slate-300"}>
                            {kDetails.w} / {knapsackCapacity}
                        </span>
                    </td>
                )}
                <td className="px-4 py-2 font-bold text-slate-100">
                    {isGA ? (
                        <span>${ind.fitness}</span>
                    ) : (
                        <span>{ind.fitness.toFixed(2)}</span>
                    )}
                </td>
                </tr>
             );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PopulationTable;
