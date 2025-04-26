<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { navigating } from "$app/stores";
//   import { Button } from "$lib/components/ui/button";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Home, BarChart3, AlertCircle, Settings, Menu, Wallet } from "lucide-svelte";
</script>

<div class="min-h-screen bg-background flex flex-col">
  <header class="border-b">
    <div class="container mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon" class="md:hidden">
          <Menu class="h-5 w-5" />
        </Button>
        <span class="font-bold text-lg">Verdexa</span>
      </div>
      
      <nav class="hidden md:flex items-center gap-6">
        <a 
          href="/" 
          class="text-sm font-medium transition-colors hover:text-primary"
          aria-current={$page.url.pathname === "/" ? "page" : undefined}
        >
          Home
        </a>
        <a 
          href="/dashboard" 
          class="text-sm font-medium transition-colors hover:text-primary"
          aria-current={$page.url.pathname === "/dashboard" ? "page" : undefined}
        >
          Dashboard
        </a>
        <a 
          href="/alerts" 
          class="text-sm font-medium transition-colors hover:text-primary"
          aria-current={$page.url.pathname === "/alerts" ? "page" : undefined}
        >
          Alerts
        </a>
        <a 
          href="/settings" 
          class="text-sm font-medium transition-colors hover:text-primary"
          aria-current={$page.url.pathname === "/settings" ? "page" : undefined}
        >
          Settings
        </a>
      </nav>

      <AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
		  <Button builders={[builder]} variant="outline">Connect Wallet</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content class="bg-white p-10">
		  <AlertDialog.Header class="flex flex-column items-center">
			<Wallet class="h-15 w-15" />
			<AlertDialog.Title>Connect Your Wallet</AlertDialog.Title>
		  </AlertDialog.Header>
		  <AlertDialog.Footer>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		  </AlertDialog.Footer>
		</AlertDialog.Content>
	  </AlertDialog.Root>
      
    </div>
  </header>
  
  <div class="flex-1 flex">
    <aside class="hidden md:block w-64 border-r p-4">
      <nav class="space-y-2">
        <a 
          href="/" 
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"
          class:bg-accent={$page.url.pathname === "/"}
        >
          <Home class="h-4 w-4" />
          <span>Home</span>
        </a>
        <a 
          href="/dashboard" 
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"
          class:bg-accent={$page.url.pathname === "/dashboard"}
        >
          <BarChart3 class="h-4 w-4" />
          <span>Dashboard</span>
        </a>
        <a 
          href="/alerts" 
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"
          class:bg-accent={$page.url.pathname === "/alerts"}
        >
          <AlertCircle class="h-4 w-4" />
          <span>Alerts</span>
        </a>
        <a 
          href="/settings" 
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"
          class:bg-accent={$page.url.pathname === "/settings"}
        >
          <Settings class="h-4 w-4" />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
    
    <main class="flex-1">
      {#if $navigating}
        <div class="h-1 bg-primary animate-pulse fixed top-0 left-0 right-0 z-50"></div>
      {/if}
      
      <slot />
    </main>
  </div>
</div>