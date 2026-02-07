import React, { useState, useEffect, useCallback } from 'react';
import { Population, EAConfig, DEFAULT_CONFIG } from './utils/common';
import { StepLog } from './utils/internal-algo-logs';
import { initGA, stepGA } from './algorithms/ga';
import { initDE, stepDE } from './algorithms/de';
import { initPSO, stepPSO } from './algorithms/pso';
import { initGP, stepGP } from './algorithms/gp';
import { initES, stepES } from './algorithms/es';
import PopulationTable from './components/PopulationTable';
import Visualizer from './components/Visualizer';
import ConfigPanel from './components/ConfigPanel';
import StepLogView from './components/StepLogView';

type Algorithm = 'GA' | 'DE' | 'PSO' | 'GP' | 'ES';

const App: React.FC = () => {
    const [algo, setAlgo] = useState<Algorithm>('GA');
    const [config, setConfig] = useState<EAConfig>(DEFAULT_CONFIG);

    const [pop, setPop] = useState<Population>([]);
    const [gen, setGen] = useState(0);
    const [history, setHistory] = useState<{ generation: number, bestFitness: number, avgFitness: number }[]>([]);
    const [running, setRunning] = useState(false);
    const [stepLogs, setStepLogs] = useState<StepLog>([]);

    // Initialize function
    const reset = useCallback(() => {
        let initialPop: Population = [];

        // Ensure config is respected for GA (Knapsack)
        if (algo === 'GA') initialPop = initGA(config);
        if (algo === 'DE') initialPop = initDE(config);
        if (algo === 'PSO') initialPop = initPSO(config);
        if (algo === 'GP') initialPop = initGP(config);
        if (algo === 'ES') initialPop = initES(config);

        setPop(initialPop);
        setGen(0);

        // Initial history
        const fits = initialPop.map(p => p.fitness);
        const best = algo === 'GA' ? Math.max(...fits) : Math.min(...fits);
        const avg = fits.reduce((a, b) => a + b, 0) / fits.length;

        setHistory([{
            generation: 0,
            bestFitness: best,
            avgFitness: avg
        }]);
        setStepLogs([]);
        setRunning(false);
    }, [algo, config]); // Re-init when ANY config changes (including items)

    // Initial load
    useEffect(() => {
        reset();
    }, [reset]);

    const step = useCallback(() => {
        if (gen >= config.maxGenerations) {
            setRunning(false);
            return;
        }

        setPop(prev => {
            let result: { nextPop: Population; logs: StepLog } = { nextPop: [], logs: [] };

            if (algo === 'GA') result = stepGA(prev, config);
            else if (algo === 'DE') result = stepDE(prev, config);
            else if (algo === 'PSO') result = stepPSO(prev, config);
            else if (algo === 'GP') result = stepGP(prev, config);
            else if (algo === 'ES') result = stepES(prev, config);

            const { nextPop, logs } = result;

            const fits = nextPop.map(p => p.fitness);
            const best = algo === 'GA' ? Math.max(...fits) : Math.min(...fits);
            const avg = fits.reduce((a, b) => a + b, 0) / fits.length;

            setHistory(h => {
                if (h.length > 0 && h[h.length - 1].generation === gen + 1) return h;
                return [...h, { generation: gen + 1, bestFitness: best, avgFitness: avg }];
            });

            setStepLogs(logs);
            return nextPop;
        });
        setGen(g => g + 1);
    }, [algo, gen, config]);

    useEffect(() => {
        let interval: any;
        if (running && gen < config.maxGenerations) {
            interval = setInterval(step, 800);
        } else if (gen >= config.maxGenerations) {
            setRunning(false);
        }
        return () => clearInterval(interval);
    }, [running, gen, step, config.maxGenerations]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans">
            <header className="mb-16 py-12 px-6 text-center relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50">
                {/* Layered Background Glows */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse"></div>

                <div className="relative z-10">

                    {/* Main Heading with Improved Gradient and Shadow */}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-400 to-emerald-400 drop-shadow-sm">
                        Evolutionary <br className="hidden md:block" /> Algorithms Visualizer
                    </h1>

                    {/* Subtext with balanced width */}
                    <p className="mt-6 mx-auto max-w-2xl text-slate-400 text-lg md:text-xl leading-relaxed font-light">
                        Witness the power of <span className="text-blue-400 font-medium italic">natural selection</span> through interactive simulations.
                        Bridge the gap between raw code and biological intelligence.
                    </p>

                    {/* Action Buttons / Status Pills */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-700"></div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                        </div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-700"></div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-slate-700 overflow-x-auto">
                {(['GA', 'DE', 'PSO', 'ES', 'GP'] as Algorithm[]).map(a => (
                    <button
                        key={a}
                        onClick={() => { setAlgo(a); setGen(0); setHistory([]); setStepLogs([]); setRunning(false); }}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${algo === a ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {a === 'GA' ? 'GA (Knapsack)' : a === 'DE' ? 'DE (Sphere)' : a === 'PSO' ? 'PSO (Sphere)' : a === 'ES' ? 'ES (Sphere)' : 'GP (Linear/Sine)'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Column: Controls & Configuration */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg sticky top-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm uppercase tracking-wider text-slate-400">Control Panel</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${gen >= config.maxGenerations ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>
                                Gen: {gen} / {config.maxGenerations}
                            </span>
                        </div>

                        <div className="flex space-x-2 mb-6">
                            <button
                                onClick={() => setRunning(!running)}
                                disabled={gen >= config.maxGenerations}
                                className={`flex-1 py-2 rounded-lg font-bold transition text-sm ${running ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {running ? 'Pause' : 'Start'}
                            </button>
                            <button
                                onClick={step}
                                disabled={running || gen >= config.maxGenerations}
                                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold disabled:opacity-50 text-sm"
                            >
                                Step
                            </button>
                            <button
                                onClick={reset}
                                className="px-3 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg font-semibold border border-red-800 text-sm"
                            >
                                Reset
                            </button>
                        </div>

                        <ConfigPanel config={config} setConfig={setConfig} disabled={running || gen > 0} algo={algo} />

                        {/* Problem Context Info */}
                        <div className="mt-6 pt-4 border-t border-slate-700">
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Problem Context</h4>
                            {algo === 'GA' && (
                                <div className="text-xs space-y-1">
                                    <p className="text-amber-400 font-semibold">Knapsack Problem</p>
                                    <p className="text-slate-400">Capacity: {config.knapsackCapacity}</p>
                                    <p className="text-slate-500 mt-2 italic">See item list in configuration above.</p>
                                </div>
                            )}
                            {(algo === 'DE' || algo === 'PSO' || algo === 'ES') && (
                                <div className="text-xs space-y-1">
                                    {algo === 'ES' && <p className="text-fuchsia-400 font-semibold">Evolution Strategy (ES)</p>}
                                    {algo !== 'ES' && <p className="text-blue-400 font-semibold">Sphere Function</p>}
                                    <p className="text-slate-400">Minimize f(x) = &sum; x&sup2;</p>
                                    <p className="text-slate-400">Range: [-5, 5]</p>
                                    <p className="text-slate-400">Target: 0</p>
                                </div>
                            )}
                            {algo === 'GP' && (
                                <div className="text-xs space-y-1">
                                    <p className="text-purple-400 font-semibold">Linear GP</p>
                                    {config.gpProblem === 'Linear' ? (
                                        <>
                                            <p className="text-slate-400">Find ops to reach 0 from 50.</p>
                                            <p className="text-slate-400">Ops: +1, -1, -10, /2</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-slate-400">Find f(x) to match sin(x).</p>
                                            <p className="text-slate-400">Ops: +x, +1, sin, *2</p>
                                            <p className="text-slate-400">Register Start: 0</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Visualization & Data */}
                <div className="xl:col-span-3 space-y-6">
                    <Visualizer history={history} currentPop={pop} algo={algo} config={config} />
                    <PopulationTable
                        population={pop}
                        algo={algo}
                        knapsackItems={config.knapsackItems}
                        knapsackCapacity={config.knapsackCapacity}
                        config={config}
                    />
                    <StepLogView logs={stepLogs} algo={algo} />
                </div>
            </div>
        </div>
    );
};

export default App;