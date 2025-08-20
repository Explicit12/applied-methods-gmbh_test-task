import type { Updater } from "@tanstack/vue-table";

import type { Ref } from "vue";
import { isFunction } from "@tanstack/vue-table";

export function valueUpdater<T>(updaterOrValue: Updater<T>, reference: Ref<T>) {
  reference.value = isFunction(updaterOrValue)
    ? updaterOrValue(reference.value)
    : updaterOrValue;
}
