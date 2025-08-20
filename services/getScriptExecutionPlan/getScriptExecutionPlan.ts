import type { VulnerabilityScript, ExecutionPlan } from "./types";

export function getScriptExecutionPlan(scripts: VulnerabilityScript[]): ExecutionPlan {
  const warnings: string[] = [];

  const scriptIds = new Set(scripts.map(({ scriptId }) => scriptId));

  const nodeInDegree = new Map();
  const nodeAdjacency = new Map();

  // Initialize in-degree, adjacency list, add warnings for missing dependencies
  for (const { scriptId, dependencies } of scripts) {
    nodeInDegree.set(scriptId, dependencies.length);

    for (const dep of dependencies) {
      if (!scriptIds.has(dep)) {
        warnings.push(`Script ${scriptId} has a missing dependency: ${dep}`);
      }

      if (!nodeAdjacency.has(dep)) {
        nodeAdjacency.set(dep, []);
      }

      nodeAdjacency.get(dep).push(scriptId);
    }
  }

  const waves = toLayeredTopologicalSort(nodeInDegree, nodeAdjacency);

  return {
    waves: waves,
    warnings: warnings,
    efficiency: calculateEfficiency(waves),
  };
}

function toLayeredTopologicalSort(nodeInDegree: Map<number, number>, nodeAdjacency: Map<number, number[]>) {
  let queue = [...nodeInDegree.entries()].filter(([, inDegree]) => !inDegree).map(([scriptId]) => scriptId);
  const waves: number[][] = [];

  while (queue.length > 0) {
    waves.push([...queue]);

    const newQueue: number[] = [];

    for (const node of queue) {
      if (!nodeAdjacency.has(node)) continue;

      for (const dependentScript of nodeAdjacency.get(node)!) {
        const updatedScriptInDegree = nodeInDegree.get(dependentScript)! - 1;

        nodeInDegree.set(dependentScript, updatedScriptInDegree);

        if (!updatedScriptInDegree) {
          newQueue.push(dependentScript);
        }
      }
    }

    queue = newQueue;
  }

  return waves;
}

function calculateEfficiency(waves: number[][]) {
  return Number.parseFloat(waves.length > 0 ? (1 / waves.length).toFixed(2) : "0");
} 