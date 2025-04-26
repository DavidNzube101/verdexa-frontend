<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import type { ComponentType } from "svelte";
  
  export let title: string;
  export let value: string;
  export let change: string;
  export let icon: ComponentType;
  export let isPositive: boolean = true;
  export let isLoading: boolean = false;
</script>

<Card>
  <CardContent class="pt-6">
    <div class="flex justify-between items-start">
      <div>
        {#if isLoading}
          <div class="h-5 w-24 bg-muted animate-pulse rounded mb-2"></div>
          <div class="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
          <div class="h-4 w-12 bg-muted animate-pulse rounded"></div>
        {:else}
          <p class="text-sm text-muted-foreground">{title}</p>
          <h2 class="text-3xl font-bold">{value}</h2>
          <p class={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        {/if}
      </div>
      <div class="p-2 bg-primary/20 rounded-full">
        <svelte:component this={icon} class="h-5 w-5 text-primary" />
      </div>
    </div>
  </CardContent>
</Card>