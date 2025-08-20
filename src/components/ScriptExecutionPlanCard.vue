<script setup lang="ts">
  import { computed } from "vue";
  import { getScriptExecutionPlan } from "@/services/getScriptExecutionPlan/getScriptExecutionPlan";

  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

  import type { VulnerabilityScript } from "@/services/getScriptExecutionPlan/types";

  const props = defineProps<{
    scripts: VulnerabilityScript[];
  }>();

  const scriptExecutionPlan = computed(() => getScriptExecutionPlan(props.scripts));
</script>

<template>
  <Card class="flex-1/2 min-h-full max-h-full">
    <CardHeader>
      <CardTitle> Script execution order </CardTitle>
      <CardDescription> Efficiency: {{ scriptExecutionPlan.efficiency }} </CardDescription>
    </CardHeader>
    <CardContent class="max-h-36 h-36 overflow-y-scroll md:max-h-full md:h-fit">
      <ol>
        <li v-for="(wave, idx) in scriptExecutionPlan.waves" :key="wave.join()">Wave {{ idx + 1 }}: {{ wave }}</li>
      </ol>
      <ul>
        <li v-for="warn in scriptExecutionPlan.warnings" :key="warn" class="text-orange-300">
          {{ warn }}
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
