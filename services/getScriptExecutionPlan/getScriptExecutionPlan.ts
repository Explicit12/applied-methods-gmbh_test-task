import type { VulnerabilityScript, ExecutionPlan } from "./types";

export function getScriptExecutionPlan(scripts: VulnerabilityScript[]): ExecutionPlan {
  console.log("getScriptExecutionPlan called with scripts:", scripts);

  return {
    waves: [],
    warnings: [],
    efficiency: 0,
  };
}
