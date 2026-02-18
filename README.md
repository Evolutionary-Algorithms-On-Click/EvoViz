# EvoViz - Evolutionary Algorithms Visualization

<p align="center">
  <img src="assets/Evo-Viz-Logo.png" width="280"/>
</p>


Application is deployed at here. [Use EvoViz Now](https://evolutionary-algorithms-on-click.github.io/EvoViz/)

EvoViz is an interactive web-based tool designed to visualize and demonstrate the core mechanics of various Evolutionary Algorithms (EAs). It provides a real-time simulation environment where users can observe how natural selection, mutation, and crossover operations influence optimization processes across different problem domains.

## Overview

This project serves as an educational and experimental platform to understand Evolutionary Computation concepts. Instead of treating these algorithms as black boxes, EvoViz breaks down their execution, allowing users to step through generations, inspect population states, and analyze convergence behavior through dynamic charts and logs.

<img width="1905" height="1080" alt="image" src="https://github.com/user-attachments/assets/59b44ba8-1e7f-4e21-abae-8829b29d49a5" />



## Supported Algorithms and Problems

The application currently supports the following algorithms, each paired with a specific optimization problem:

*   **Genetic Algorithm (GA)**: Solves the **Knapsack Problem**. It demonstrates binary encoding, selection pressure, and combinatorial optimization.
*   **Differential Evolution (DE)**: Optimizes the **Sphere Function** (Minimize f(x) = sum(x^2)). It showcases real-valued optimization and vector-based mutation strategies.
*   **Particle Swarm Optimization (PSO)**: Optimizes the **Sphere Function**. It visualizes swarm intelligence, velocity updates, and global vs. local best tracking.
*   **Evolution Strategy (ES)**: Optimizes the **Sphere Function**. It highlights self-adaptive mutation rates and selection strategies typical in ES.
*   **Genetic Programming (GP)**: Solves **Linear and Sine Genetic Programming** tasks (e.g., finding a sequence of operations to reach a target number or approximating a Sine function). It illustrates program synthesis and register-based evolution.

## Features

*   **Interactive Simulation Control**: Start, pause, resume, or step through the evolutionary process generation by generation.
*   **Real-time Configuration**: Adjust algorithm parameters on the fly, such as population size, mutation rates, crossover probabilities, and problem-specific constraints (e.g., knapsack capacity).
*   **Dynamic Visualization**:
    *   **Fitness History Charts**: Track best and average fitness over time to analyze convergence.
    *   **Population Inspection**: View detailed attributes of every individual in the current population (genotype, phenotype, fitness).
    *   **Problem-Specific Views**: Visual representations relevant to the specific algorithm (e.g., 2D plots for function optimization).
*   **Step Logs**: Detailed textual logs describing the internal operations performed during each generation (e.g., specific parents selected, mutation events).


## DevDocs

Before running the project, ensure you have the following installed:

*   **Node.js** (Version 18 or higher recommended)
*   **npm** (Node Package Manager)

## Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory in your terminal.
3.  Install the required dependencies:

    ```bash
    npm install
    ```

## Usage

### Development Server

To start the local development server with hot-reload enabled:

```bash
npm run dev
```

The application will be accessible at the URL provided in the terminal (usually `http://localhost:5173`).

### Production Build

To build the project for production deployment:

```bash
npm run build
```

To deploy the project :

```bash
npm run deploy
```

To preview the production build locally:

```bash
npm run preview
```

## CLI Usage

The project also contains a CLI entry point (`main_cli.ts`) for running algorithms in a headless environment. To run the CLI:

```bash
npm start
```

## Contributing

Interested in adding a new evolutionary algorithm to EvoViz? Check out our [Contributing Guide](CONTRIBUTING.md) for detailed instructions on how to add new algorithms to the platform.