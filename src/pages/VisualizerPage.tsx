import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Population, EAConfig, DEFAULT_CONFIG } from '../utils/common';
import { StepLog } from '../utils/internal-algo-logs';
import PopulationTable from '../components/PopulationTable';
import Visualizer from '../components/Visualizer';
import ConfigPanel from '../components/ConfigPanel';
import StepLogView from '../components/StepLogView';
import { Github, ArrowLeft } from 'lucide-react';
import { ALGORITHMS, AlgorithmId, getAlgorithmConfig, supports3DVisualization } from '../config/algorithms';
import { getAlgorithmFunctions } from '../config/algorithmRegistry';

const VisualizerPage: React.FC = () => {
    const { algo: algoParam } = useParams<{ algo: string }>();
    const navigate = useNavigate();
    
    // Validate algo param using config
    const validAlgoIds = ALGORITHMS.map(a => a.id);
    const algoId = (validAlgoIds.find(a => a === algoParam?.toUpperCase()) || 'GA') as AlgorithmId;
    const algoConfig = getAlgorithmConfig(algoId)!;

    // Scroll to top when component mounts or algo changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [algoId]);

    // Redirect if param was invalid (optional, but keeps URL clean)
    useEffect(() => {
        if (algoParam?.toUpperCase() !== algoId) {
            navigate(`/visualizer/${algoId.toLowerCase()}`, { replace: true });
        }
    }, [algoParam, algoId, navigate]);

    const [config, setConfig] = useState<EAConfig>(DEFAULT_CONFIG);
    const [pop, setPop] = useState<Population>([]);
    const [gen, setGen] = useState(0);
    const [history, setHistory] = useState<{ generation: number, bestFitness: number, avgFitness: number }[]>([]);
    const [running, setRunning] = useState(false);
    const [stepLogs, setStepLogs] = useState<StepLog>([]);
    const [errorHistoryMaximized, setErrorHistoryMaximized] = useState(false);
    const [scatter2DMaximized, setScatter2DMaximized] = useState(false);
    const [scatter3DMaximized, setScatter3DMaximized] = useState(false);

    // Enforce genome count based on algorithm and problem type
    useEffect(() => {
        setConfig(prev => {
            const is3DViz = supports3DVisualization(algoId, prev.gpProblem);
            
            let targetGenes = prev.genesCount;
            if (is3DViz) {
                targetGenes = 2;
            } else if (algoId === 'GP' && prev.gpProblem === 'Sine') {
                targetGenes = 5;
            } else if (algoId === 'GA') {
                // GA uses knapsack items count, handled elsewhere
                return prev;
            } else {
                targetGenes = algoConfig.defaultGenesCount;
            }
            
            if (prev.genesCount !== targetGenes) {
                return { ...prev, genesCount: targetGenes };
            }
            return prev;
        });
    }, [algoId, config.gpProblem, algoConfig]);

    // Initialize function
    const reset = useCallback(() => {
        const algoFunctions = getAlgorithmFunctions(algoId);
        const initialPop = algoFunctions.init(config);

        setPop(initialPop);
        setGen(0);

        const fits = initialPop.map(p => p.fitness);
        const best = algoConfig.fitnessDirection === 'maximize' 
            ? Math.max(...fits) 
            : Math.min(...fits);
        const avg = fits.reduce((a, b) => a + b, 0) / fits.length;

        setHistory([{
            generation: 0,
            bestFitness: best,
            avgFitness: avg
        }]);
        setStepLogs([]);
        setRunning(false);
    }, [algoId, config, algoConfig]);

    // Initial load & when algo changes
    useEffect(() => {
        reset();
    }, [reset]);

    const step = useCallback(() => {
        if (gen >= config.maxGenerations) {
            setRunning(false);
            return;
        }

        setPop(prev => {
            const algoFunctions = getAlgorithmFunctions(algoId);
            const result = algoFunctions.step(prev, config);

            const { nextPop, logs } = result;

            const fits = nextPop.map(p => p.fitness);
            const best = algoConfig.fitnessDirection === 'maximize'
                ? Math.max(...fits)
                : Math.min(...fits);
            const avg = fits.reduce((a, b) => a + b, 0) / fits.length;

            setHistory(h => {
                if (h.length > 0 && h[h.length - 1].generation === gen + 1) return h;
                return [...h, { generation: gen + 1, bestFitness: best, avgFitness: avg }];
            });

            setStepLogs(logs);
            return nextPop;
        });
        setGen(g => g + 1);
    }, [algoId, gen, config, algoConfig]);

    useEffect(() => {
        let interval: any;
        if (running && gen < config.maxGenerations) {
            interval = setInterval(step, 800);
        } else if (gen >= config.maxGenerations) {
            setRunning(false);
        }
        return () => clearInterval(interval);
    }, [running, gen, step, config.maxGenerations]);

    // Handle completion - auto-stop when reaching max generations
    useEffect(() => {
        if (gen >= config.maxGenerations && running) {
            setRunning(false);
        }
    }, [gen, config.maxGenerations, running]);

    const handleAlgoChange = (newAlgoId: AlgorithmId) => {
        navigate(`/visualizer/${newAlgoId.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans">
            <header className="mb-8 py-2 px-2 sm:px-4 relative overflow-visible rounded-3xl border border-white/5 bg-slate-900/50 flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                 <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px]"></div>
                 </div>

                 {/* Mobile: Top row with back arrow and GitHub */}
                 <div className="relative z-10 w-full flex justify-between items-center sm:hidden">
                    <Link
                        to="/"
                        className="group p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-800/90 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] cursor-pointer inline-flex items-center justify-center"
                        title="Back to Home"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </Link>
                    <a
                        href="https://github.com/Astrasv/EvoViz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-800/90 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] cursor-pointer inline-flex items-center justify-center"
                        title="View on GitHub"
                    >
                        <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </a>
                 </div>

                 {/* Desktop: Left: Back Arrow */}
                 <div className="relative z-10 hidden sm:flex items-center justify-start">
                    <Link
                        to="/"
                        className="group p-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-800/90 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] cursor-pointer inline-flex items-center justify-center"
                        title="Back to Home"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </Link>
                 </div>

                 {/* Center: Navigation Tabs - Grouped as single component */}
                 <div className="relative z-10 flex gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto justify-center sm:justify-start scrollbar-hide">
                    {ALGORITHMS.map((algo, index) => {
                        // Show tooltip above for last 2 buttons (GP, ES) to prevent overflow
                        const showTooltipAbove = index >= 3;
                        return (
                            <button
                                key={algo.id}
                                onClick={() => handleAlgoChange(algo.id)}
                                title={algo.fullName}
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all relative group whitespace-nowrap flex-shrink-0 ${
                                    algoId === algo.id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                            >
                                {algo.name}
                                <span className={`hidden sm:block absolute ${showTooltipAbove ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-slate-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-700 shadow-lg z-50`}>
                                    {algo.fullName}
                                </span>
                            </button>
                        );
                    })}
                 </div>

                 {/* Desktop: Right: GitHub Link */}
                 <div className="relative z-10 hidden sm:flex items-center justify-end">
                    <a
                        href="https://github.com/Astrasv/EvoViz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-800/90 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] cursor-pointer inline-flex items-center justify-center"
                        title="View on GitHub"
                    >
                        <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </a>
                 </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Column: Controls & Configuration */}
                <div className="xl:col-span-1">
                    <div className="xl:sticky xl:top-4 space-y-6">
                        {/* Problem Context - Separate Section */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <h4 className="text-sm font-bold uppercase text-slate-300 mb-4">Problem Context</h4>
                            {algoConfig.visualizationType === 'knapsack' && (
                                <div className="text-sm space-y-2">
                                    <p className="text-amber-400 font-semibold text-base">Knapsack Problem</p>
                                    <p className="text-slate-300">Capacity: <span className="text-amber-400 font-semibold">{config.knapsackCapacity}</span></p>
                                    <p className="text-slate-400 mt-3 italic text-xs">See item list in configuration above.</p>
                                </div>
                            )}
                            {algoConfig.visualizationType === 'real-valued' && (
                                <div className="text-sm space-y-2">
                                    <p className={`font-semibold text-base ${
                                        algoConfig.color === 'fuchsia' ? 'text-fuchsia-400' :
                                        algoConfig.color === 'emerald' ? 'text-emerald-400' :
                                        'text-blue-400'
                                    }`}>{algoConfig.fullName}</p>
                                    
                                    <p className="text-white font-bold mt-3 text-base">{config.problemType || 'Sphere'} Function</p>
                                    
                                    {(!config.problemType || config.problemType === 'Sphere') ? (
                                        <p className="text-slate-300">Minimize <span className="font-mono text-blue-400">f(x) = Σ x²</span></p>
                                    ) : (
                                        <p className="text-slate-300">Min Ackley <span className="text-slate-400">(Multi-modal)</span></p>
                                    )}
                                    <p className="text-slate-300">Range: <span className="text-emerald-400">[-5, 5]</span></p>
                                    <p className="text-slate-300">Target: <span className="text-emerald-400 font-semibold">0</span></p>
                                </div>
                            )}
                            {(algoConfig.visualizationType === 'gp-linear' || algoConfig.visualizationType === 'gp-sine') && (
                                <div className="text-sm space-y-2">
                                    <p className="text-purple-400 font-semibold text-base">Genetic Programming</p>
                                    {config.gpProblem === 'Linear' ? (
                                        <>
                                            <p className="text-slate-300">Find ops to reach <span className="text-purple-400 font-semibold">0</span> from <span className="text-purple-400 font-semibold">50</span>.</p>
                                            <p className="text-slate-300">Ops: <span className="font-mono text-blue-400">+1, -1, -10, /2</span></p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-slate-300">Find <span className="font-mono text-purple-400">f(x)</span> to match <span className="font-mono text-purple-400">sin(x)</span>.</p>
                                            <p className="text-slate-300">Ops: <span className="font-mono text-blue-400">+x, +1, sin, *2</span></p>
                                            <p className="text-slate-300">Register Start: <span className="text-purple-400 font-semibold">0</span></p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm uppercase tracking-wider text-slate-400">Control Panel</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${gen >= config.maxGenerations ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>
                                Gen: {gen} / {config.maxGenerations}
                            </span>
                        </div>

                        <div className="flex space-x-2 mb-6">
                            <button
                                onClick={() => {
                                    if (gen >= config.maxGenerations) {
                                        reset();
                                    } else {
                                        setRunning(!running);
                                    }
                                }}
                                className={`flex-1 py-2 rounded-lg font-bold transition text-sm ${
                                    gen >= config.maxGenerations 
                                        ? 'bg-blue-600 hover:bg-blue-500' 
                                        : running 
                                            ? 'bg-amber-600 hover:bg-amber-500' 
                                            : 'bg-emerald-600 hover:bg-emerald-500'
                                }`}
                            >
                                {gen >= config.maxGenerations ? 'Finish' : running ? 'Pause' : 'Start'}
                            </button>
                            <button
                                onClick={step}
                                disabled={running || gen >= config.maxGenerations}
                                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

                        <ConfigPanel config={config} setConfig={setConfig} disabled={running || gen > 0} algo={algoId} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Visualization & Data */}
                <div className="xl:col-span-3 space-y-6">
                    <Visualizer 
                        history={history} 
                        currentPop={pop} 
                        algo={algoId} 
                        config={config} 
                        errorHistoryMaximized={errorHistoryMaximized}
                        scatter2DMaximized={scatter2DMaximized}
                        scatter3DMaximized={scatter3DMaximized}
                        onToggleErrorHistory={() => {
                            const newState = !errorHistoryMaximized;
                            setErrorHistoryMaximized(newState);
                            // Only minimize others if expanding this one
                            if (newState) {
                                setScatter2DMaximized(false);
                                setScatter3DMaximized(false);
                            }
                        }}
                        onToggleScatter2D={() => {
                            const newState = !scatter2DMaximized;
                            setScatter2DMaximized(newState);
                            // Only minimize others if expanding this one
                            if (newState) {
                                setErrorHistoryMaximized(false);
                                setScatter3DMaximized(false);
                            }
                        }}
                        onToggleScatter3D={() => {
                            const newState = !scatter3DMaximized;
                            setScatter3DMaximized(newState);
                            // Only minimize others if expanding this one
                            if (newState) {
                                setErrorHistoryMaximized(false);
                                setScatter2DMaximized(false);
                            }
                        }}
                    />
                    {!errorHistoryMaximized && !scatter2DMaximized && !scatter3DMaximized && (
                        <>
                            <PopulationTable
                                population={pop}
                                algo={algoId}
                                knapsackItems={config.knapsackItems}
                                knapsackCapacity={config.knapsackCapacity}
                                config={config}
                            />
                            <StepLogView logs={stepLogs} algo={algoId} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualizerPage;
