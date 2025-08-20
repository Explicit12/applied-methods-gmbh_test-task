import { describe, expect, test } from "vitest";

import { getScriptExecutionPlan } from "./getScriptExecutionPlan";

import type { VulnerabilityScript } from "./types";

const independentNodes = [
  { scriptId: 1, dependencies: [] },
  { scriptId: 2, dependencies: [] },
  { scriptId: 3, dependencies: [] },
];

const linearChain = [
  { scriptId: 1, dependencies: [] },
  { scriptId: 2, dependencies: [1] },
  { scriptId: 3, dependencies: [2] },
];

const complexGraph = [
  { scriptId: 1, dependencies: [] },
  { scriptId: 4, dependencies: [] },
  { scriptId: 2, dependencies: [1] },
  { scriptId: 5, dependencies: [2] },
  { scriptId: 3, dependencies: [5, 4] },
];

const emptyInput: VulnerabilityScript[] = [];

const singleNode = [{ scriptId: 1, dependencies: [] }];

const missingEdge = [
  { scriptId: 1, dependencies: [] },
  { scriptId: 2, dependencies: [1] },
  { scriptId: 3, dependencies: [1, 2] },
  { scriptId: 4, dependencies: [5, 55] },
  { scriptId: 5, dependencies: [99] },
  { scriptId: 6, dependencies: [3] },
  { scriptId: 7, dependencies: [6] },
  { scriptId: 8, dependencies: [7] },
];

describe("Sorting", () => {
  test("Should return scripts in topological order for linear chain", () => {
    const result = getScriptExecutionPlan(linearChain);

    expect(result.waves).toHaveLength(3);
    expect(result.waves).toEqual([[1], [2], [3]]);
  });

  test("Should return scripts in topological order for graph with multiple dependencies", () => {
    const result = getScriptExecutionPlan(complexGraph);

    expect(result.waves).toHaveLength(4);
    expect(result.waves).toEqual([[1, 4], [2], [5], [3]]);
  });

  test("Should return independent scripts in one wave", () => {
    const result = getScriptExecutionPlan(independentNodes);

    expect(result.waves).toHaveLength(1);
    expect(result.waves[0]).toEqual([1, 2, 3]);
  });

  test("Should handle single node with no dependencies", () => {
    const result = getScriptExecutionPlan(singleNode);

    expect(result.waves).toHaveLength(1);
    expect(result.waves[0]).toEqual([1]);
  });

  test("Should not run scripts with missing dependencies", () => {
    const result = getScriptExecutionPlan(missingEdge);

    expect(result.waves).toHaveLength(6);
    expect(result.waves).toEqual([[1], [2], [3], [6], [7], [8]]);
  });

  test("Should return waves array for empty input", () => {
    const result = getScriptExecutionPlan(emptyInput);

    expect(result.waves).toEqual([]);
  });
});

describe("Missing dependency warnings", () => {
  test("Should return no warnings when all dependencies are met", () => {
    const result = getScriptExecutionPlan(complexGraph);

    expect(result.warnings).toHaveLength(0);
  });

  test("Should return warnings for missing dependencies", () => {
    const result = getScriptExecutionPlan(missingEdge);

    expect(result.warnings).toHaveLength(2);
    expect(result.warnings).toContain("Script 5 has a missing dependency: 99");
    expect(result.warnings).toContain("Script 4 has a missing dependency: 55");
  });
});

describe("Efficiency computation", () => {
  test.each([
    [independentNodes, 1],
    [linearChain, 0.33],
    [complexGraph, 0.25],
    [emptyInput, 0],
    [singleNode, 1],
    [missingEdge, 0.17],
  ])("Should return correct efficiency value based on the number of waves", (input, expectedEfficiency) => {
    const result = getScriptExecutionPlan(input);

    expect(result.efficiency).toBe(expectedEfficiency);
  });
});
