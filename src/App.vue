<script setup lang="ts">
  import { ref } from "vue";

  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import ScriptExecutionPlanCard from "./components/ScriptExecutionPlanCard.vue";
  import ScriptsTable from "./components/ScriptsTable.vue";

  import type { VulnerabilityScript } from "@/services/getScriptExecutionPlan/types";

  const scriptInput = ref({
    scriptId: undefined,
    dependencies: "",
  });

  const error = ref("");

  const scripts = ref([
    { scriptId: 1, dependencies: [] },
    { scriptId: 2, dependencies: [1] },
    { scriptId: 3, dependencies: [1, 2] },
    { scriptId: 4, dependencies: [99] },
  ]);

  function removeScript(targetScriptId: number) {
    scripts.value = scripts.value.filter(({ scriptId }) => targetScriptId !== scriptId);
  }

  function addScript() {
    const newScript = {
      scriptId: Number(scriptInput.value.scriptId),
      dependencies: scriptInput.value.dependencies.split(",").map((id) => +id.replaceAll(/[^0-9]/g, "")),
    };

    validateScript(newScript);

    if (error.value) return;

    scripts.value.push(newScript);
  }

  function resetError() {
    error.value = "";
  }

  function validateScript(newScript: VulnerabilityScript) {
    const isScriptInList = scripts.value.find(({ scriptId }) => scriptId === newScript.scriptId);
    const isCycledDependency = newScript.dependencies.includes(newScript.scriptId);

    if (isCycledDependency) {
      error.value = "List cannot contain cyclic dependencies.";
    }

    if (isScriptInList) {
      error.value = "Script is already in the list.";
    }
  }
</script>

<template>
  <main class="mx-auto px-4 max-w-7xl py-6 md:py-8 h-screen">
    <div class="flex flex-col-reverse md:flex-row gap-2 md:h-full">
      <section class="flex-1/2 min-h-96">
        <header class="flex flex-col gap-2">
          <div class="flex gap-2">
            <Input
              @input="resetError"
              v-model.number="scriptInput.scriptId"
              class="max-w-32"
              inputmode="numeric"
              placeholder="Script Id"
            />
            <Input
              @input="resetError"
              v-model="scriptInput.dependencies"
              inputmode="numeric"
              placeholder="Despondencies separated by comma"
            />
            <Button :disabled="!scriptInput.scriptId" @click="addScript">Add</Button>
          </div>
          <p class="text-red-400">
            {{ error }}
          </p>
        </header>

        <ScriptsTable :scripts="scripts" @remove="removeScript" />
      </section>

      <ScriptExecutionPlanCard :scripts="scripts" class="flex-1/2" />
    </div>
  </main>
</template>
