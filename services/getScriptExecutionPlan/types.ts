export interface VulnerabilityScript {
  scriptId: number;
  dependencies: number[];
}

export interface ExecutionPlan {
  waves: number[][];        // [[1,8], [2,9], [3,10]]
  warnings: string[];       // Missing dependency warnings
  efficiency: number;       // 0.0 to 1.0 scale
}