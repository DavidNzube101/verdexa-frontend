<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "$lib/components/ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Progress } from "$lib/components/ui/progress";
  import { Separator } from "$lib/components/ui/separator";
  import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
  import { Menu, BarChart3, PieChart, TrendingUp, Filter, RefreshCw } from "lucide-svelte";
  import TransactionChart from "$lib/components/charts/transaction-chart.svelte";
  import TokenDistribution from "$lib/components/charts/token-distribution.svelte";
  import DataCard from "$lib/components/data-card.svelte";
  import { onMount } from "svelte";
  
  // Mock data for the dashboard
  let tokens = [
    { id: 1, name: "PEPE", volume: 75, change: 12.5 },
    { id: 2, name: "DOGE", volume: 60, change: -5.2 },
    { id: 3, name: "SHIB", volume: 45, change: 8.7 },
    { id: 4, name: "FLOKI", volume: 30, change: 22.1 },
    { id: 5, name: "WOJAK", volume: 25, change: -15.3 }
  ];
  
  let transactions = [
    { date: "2023-04-01", value: 120 },
    { date: "2023-04-02", value: 150 },
    { date: "2023-04-03", value: 180 },
    { date: "2023-04-04", value: 220 },
    { date: "2023-04-05", value: 190 },
    { date: "2023-04-06", value: 250 },
    { date: "2023-04-07", value: 280 }
  ];
  
  let isLoading = true;
  
  onMount(() => {
    // Simulate data loading
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  });
  
  function refreshData() {
    isLoading = true;
    setTimeout(() => {
      // Simulate updated data
      tokens = tokens.map(token => ({
        ...token,
        volume: Math.min(100, Math.max(10, token.volume + (Math.random() * 20 - 10))),
        change: Math.min(30, Math.max(-30, token.change + (Math.random() * 10 - 5)))
      }));
      isLoading = false;
    }, 1000);
  }
</script>

<div class="container mx-auto p-4">
  <header class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Memecrime Scene Investigation</h1>
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" on:click={refreshData} disabled={isLoading}>
        <RefreshCw class="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Menu class="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="right" class="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Investigation Filters</SheetTitle>
            <SheetDescription>
              Apply filters to narrow down your investigation.
            </SheetDescription>
          </SheetHeader>
          <div class="py-4">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium mb-2">Time Range</h3>
                <div class="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Last 24h</Button>
                  <Button variant="outline" size="sm">Last Week</Button>
                  <Button variant="outline" size="sm">Last Month</Button>
                  <Button variant="outline" size="sm">Custom</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 class="text-sm font-medium mb-2">Token Type</h3>
                <div class="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Memecoins</Button>
                  <Button variant="outline" size="sm">NFTs</Button>
                  <Button variant="outline" size="sm">DeFi</Button>
                  <Button variant="outline" size="sm">All</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 class="text-sm font-medium mb-2">Transaction Volume</h3>
                <div class="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">High</Button>
                  <Button variant="outline" size="sm">Medium</Button>
                  <Button variant="outline" size="sm">Low</Button>
                  <Button variant="outline" size="sm">All</Button>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button class="w-full">Apply Filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <DataCard 
      title="Total Transactions" 
      value="1,234" 
      change="+12.5%" 
      icon={BarChart3} 
      isPositive={true} 
      isLoading={isLoading} 
    />
    <DataCard 
      title="Active Wallets" 
      value="567" 
      change="+8.3%" 
      icon={PieChart} 
      isPositive={true} 
      isLoading={isLoading} 
    />
    <DataCard 
      title="Suspicious Activity" 
      value="89" 
      change="-5.2%" 
      icon={TrendingUp} 
      isPositive={false} 
      isLoading={isLoading} 
    />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <Card>
      <CardHeader>
        <CardTitle>Transaction Flow</CardTitle>
        <CardDescription>Daily transaction volume over time</CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionChart data={transactions} isLoading={isLoading} />
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Token Distribution</CardTitle>
        <CardDescription>Distribution of transaction volume by token</CardDescription>
      </CardHeader>
      <CardContent>
        <TokenDistribution data={tokens} isLoading={isLoading} />
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Top Meme Tokens</CardTitle>
      <CardDescription>Performance of top meme tokens by volume</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead class="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#if isLoading}
            {#each Array(5) as _}
              <TableRow>
                <TableCell>
                  <div class="h-4 w-16 bg-muted animate-pulse rounded"></div>
                </TableCell>
                <TableCell>
                  <div class="h-4 w-full bg-muted animate-pulse rounded"></div>
                </TableCell>
                <TableCell>
                  <div class="h-4 w-16 bg-muted animate-pulse rounded ml-auto"></div>
                </TableCell>
              </TableRow>
            {/each}
          {:else}
            {#each tokens as token}
              <TableRow>
                <TableCell class="font-medium">{token.name}</TableCell>
                <TableCell>
                  <div class="w-full max-w-xs">
                    <Progress value={token.volume} max={100} class="h-2" />
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <span class={token.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {token.change >= 0 ? "+" : ""}{token.change.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
            {/each}
          {/if}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>