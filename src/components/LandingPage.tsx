import { ArrowDown, Cpu, GitBranch, Globe, Zap, Activity, Dna, Search, Network, Sparkles } from 'lucide-react';
import BackgroundEffect from './BackgroundEffect';
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#0b1121] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Fixed Background - Stays while scrolling */}
      <BackgroundEffect />

      {/* SECTION 1: HERO */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8 z-10 animate-fade-in-up">
           
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-900/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-blue-400 hover:bg-blue-500/20 transition-all cursor-default shadow-[0_0_15px_rgba(59,130,246,0.2)]">
             <Sparkles className="w-3 h-3 animate-spin-slow" />
             <span>Interactive Evolution Engine</span>
           </div>

           <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 mb-6 drop-shadow-2xl">
             Evo<span className="text-blue-500">Viz</span>
           </h1>
           
           <p className="text-xl md:text-3xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
             Explore how Evolutionary Algorithms <span className="text-slate-100 font-medium border-b border-blue-500/40">evolve</span> and <span className="text-slate-100 font-medium border-b border-emerald-500/40">compute</span> by seeing actually stuff.
           </p>

           <div className="pt-12">
             <button 
               onClick={() => scrollToSection('why')}
               className="group flex flex-col items-center gap-4 text-slate-500 hover:text-white transition-colors mx-auto"
             >
               <span className="text-sm font-semibold tracking-widest uppercase">Begin the Journey</span>
               <div className="p-3 rounded-full border border-slate-700 bg-slate-800/50 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 animate-bounce">
                 <ArrowDown className="w-6 h-6" />
               </div>
             </button>
           </div>
        </div>
      </section>


      {/* SECTION 2: WHY WE DO THIS */}
      <section id="why" className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 bg-gradient-to-b from-transparent via-[#0f172a]/90 to-transparent backdrop-blur-sm">
        <div className="max-w-6xl w-full">
           <div className="text-center mb-16 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
                Why Visualize Evolution?
              </h2>
              <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Let's be honest, staring at <code className="bg-slate-800 px-1 rounded text-emerald-400">fitness: 0.8934</code> in a terminal is about as exciting as watching paint dry in a black hole.
              </p>
              <p className="text-slate-500 max-w-2xl mx-auto">
                 By visualizing the core process, lets bridge the gap between abstract math and organic behavior. You can actually <em>see</em> the struggle, the triumphs, and that one particle that refuses to cooperate.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <InfoCard 
                 icon={<Dna className="w-8 h-8 text-blue-400" />}
                 title="Nature's Code"
                 desc="Survival of the fittest, digital style. Watch binary critters date, mate, and mutate without any of the messy biological cleanup."
              />
              <InfoCard 
                 icon={<Search className="w-8 h-8 text-emerald-400" />}
                 title="Global Search"
                 desc="Peaks and valleys. See your population swarm the global optimum like tourists at a buffet, avoiding those pesky local optima traps."
              />
              <InfoCard 
                 icon={<Activity className="w-8 h-8 text-purple-400" />}
                 title="Emergent Chaos"
                 desc="From dumb agents to genius swarms. It's like watching a mosh pit organize itself into a symphony orchestra. Pure emergent intelligence."
              />
           </div>

           <div className="mt-20 text-center">
             <button 
               onClick={() => scrollToSection('algorithms')}
               className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all font-semibold flex items-center gap-2 mx-auto border border-slate-700 hover:border-slate-500"
             >
               <span>Choose your Simulation</span>
               <ArrowDown className="w-4 h-4" />
             </button>
           </div>
        </div>
      </section>


      {/* SECTION 3: ALGORITHM SELECTION */}
      <section id="algorithms" className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-7xl w-full text-center">
           <h2 className="text-4xl md:text-5xl font-black text-white mb-16 flex items-center justify-center gap-4">
              <Network className="w-10 h-10 text-blue-500" />
              Select Your Algorithm
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
               <AlgoCard 
                 id="GA" 
                 title="Genetic Algorithm" 
                 desc="The OG of evolution. Uses binary genes, crossover (mating), and mutation to pack the perfect backpack. It's Darwinism, but for math problems." 
                 icon={<Cpu />} 
                 color="blue" 
               />
               <AlgoCard 
                 id="DE" 
                 title="Differential Evolution" 
                 desc="Vector calculus meets survival. It uses differences between agents to drive mutation. Excellent for continuous functions and impressing your math professor." 
                 icon={<Zap />} 
                 color="amber" 
               />
               <AlgoCard 
                 id="PSO" 
                 title="Particle Swarm" 
                 desc="Bird flocking simulator. Particles fly through search space, remembering their best spots and gossiping with neighbors about theirs. No actual birds harmed." 
                 icon={<Globe />} 
                 color="emerald" 
               />
               <AlgoCard 
                 id="GP" 
                 title="Genetic Programming" 
                 desc="Evolution writing code. We breed syntax trees that eventually (hopefully) solve the equation. It's like infinite monkeys with typewriters, but optimized." 
                 icon={<GitBranch />} 
                 color="purple" 
               />
               <AlgoCard 
                 id="ES" 
                 title="Evolution Strategies" 
                 desc="The self-optimizing optimizer. It adapts its own mutation rates (Sigma) on the fly. It learns how to learn. Meta, right?" 
                 icon={<Activity />} 
                 color="fuchsia" 
               />
           </div>
           
           <footer className="mt-32 text-slate-600 text-sm font-medium border-t border-slate-800/50 pt-8">
             <p>EvoViz under EvOLve TAG and Core Lab</p>
           </footer>
        </div>
      </section>

    </div>
  );
};

const InfoCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/60 transition-colors duration-300 group">
     <div className="mb-6 p-4 rounded-2xl bg-slate-950 inline-block border border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
       {icon}
     </div>
     <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-white">{title}</h3>
     <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300">
       {desc}
     </p>
  </div>
);

const AlgoCard = ({ id, title, desc, icon, color }: any) => {
    // Dynamic color maps
    const colors: any = {
        blue: {
            border: "group-hover:border-blue-500/50",
            shadow: "group-hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.4)]",
            text: "group-hover:text-blue-400",
            bg: "group-hover:bg-blue-950/30",
            iconBg: "bg-slate-900/80 group-hover:bg-blue-600",
            iconColor: "text-blue-400 group-hover:text-white"
        },
        amber: {
            border: "group-hover:border-amber-500/50",
            shadow: "group-hover:shadow-[0_0_50px_-10px_rgba(245,158,11,0.4)]",
            text: "group-hover:text-amber-400",
            bg: "group-hover:bg-amber-950/30",
            iconBg: "bg-slate-900/80 group-hover:bg-amber-600",
            iconColor: "text-amber-400 group-hover:text-white"
        },
        emerald: {
            border: "group-hover:border-emerald-500/50",
            shadow: "group-hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)]",
            text: "group-hover:text-emerald-400",
            bg: "group-hover:bg-emerald-950/30",
            iconBg: "bg-slate-900/80 group-hover:bg-emerald-600",
            iconColor: "text-emerald-400 group-hover:text-white"
        },
        purple: {
            border: "group-hover:border-purple-500/50",
            shadow: "group-hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.4)]",
            text: "group-hover:text-purple-400",
            bg: "group-hover:bg-purple-950/30",
            iconBg: "bg-slate-900/80 group-hover:bg-purple-600",
            iconColor: "text-purple-400 group-hover:text-white"
        },
        fuchsia: {
            border: "group-hover:border-fuchsia-500/50",
            shadow: "group-hover:shadow-[0_0_50px_-10px_rgba(217,70,239,0.4)]",
            text: "group-hover:text-fuchsia-400",
            bg: "group-hover:bg-fuchsia-950/30",
            iconBg: "bg-slate-900/80 group-hover:bg-fuchsia-600",
            iconColor: "text-fuchsia-400 group-hover:text-white"
        },
    };

    const c = colors[color];

    return (
        <Link 
            to={`/visualizer/${id.toLowerCase()}`}
            className={`group text-left p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md transition-all duration-500 hover:-translate-y-3 relative overflow-hidden ${c.border} ${c.bg} ${c.shadow} block`}
        >
            {/* Inner Glow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg border border-white/5 ${c.iconBg} ${c.iconColor} group-hover:scale-110 group-hover:rotate-3`}>
                    {React.cloneElement(icon, { size: 28 })}
                </div>
                <div className={`opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 ${c.text}`}>
                    <ArrowDown className="w-6 h-6 -rotate-90" />
                </div>
            </div>

            <div className="relative z-10">
                <h3 className={`text-2xl font-bold text-slate-200 mb-3 transition-colors duration-300 ${c.text}`}>
                    {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {desc}
                </p>
            </div>
            
            <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-slate-400 group-hover:text-white">
               <span>Initialize Engine</span>
            </div>
        </Link>
    )
}

export default LandingPage;
