<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  
  import type { VulnerabilityScript } from "@/services/getScriptExecutionPlan/types";

  defineProps<{
    scripts: VulnerabilityScript[];
  }>();

  defineEmits<{
    (event: "remove", id: number): void;
  }>();
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">Script Id</TableHead>
        <TableHead class="w-full">Dependency Ids</TableHead>
        <TableHead />
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="{ scriptId, dependencies } in scripts" :key="scriptId">
        <TableCell class="font-medium">{{ scriptId }}</TableCell>
        <TableCell>{{ dependencies.join(", ") }}</TableCell>
        <TableCell>
          <Button @click="$emit('remove', scriptId)" variant="secondary">Remove</Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
