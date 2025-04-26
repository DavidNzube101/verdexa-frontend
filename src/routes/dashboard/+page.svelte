<script lang="ts">
    import { onMount } from "svelte";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "$lib/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
    import { Progress } from "$lib/components/ui/progress";
    import { Separator } from "$lib/components/ui/separator";
    import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
    import { Menu, BarChart3, PieChart, TrendingUp, Filter, RefreshCw, AlertTriangle, Network, Activity } from "lucide-svelte";
    
    import DataCard from "$lib/components/data-card.svelte";
    import TransactionChart from "$lib/components/charts/transaction-chart.svelte";
    import TokenDistribution from "$lib/components/charts/token-distribution.svelte";
    import TransactionFlowChart from "$lib/components/charts/transaction-flow-chart.svelte";
    import AnomalyDetectionChart from "$lib/components/charts/anomaly-detection-chart.svelte";
    import OwnershipChart from "$lib/components/charts/ownership-chart.svelte";
    import SellOffChart from "$lib/components/charts/sell-off-chart.svelte";
    import VolumeBracketChart from "$lib/components/charts/volume-bracket-chart.svelte";
    import BotVolumeChart from "$lib/components/charts/bot-volume-chart.svelte";
    import PostRugChart from "$lib/components/charts/post-rug-chart.svelte";
    import WalletClusteringChart from "$lib/components/charts/wallet-clustering-chart.svelte";
    
    import * as api from "$lib/api/dashboard-api";
    
    // State for all data
    let summaryData = null;
    let tokens = [];
    let transactions = [];
    let transactionFlowData = null;
    let anomalyData = null;
    let ownershipData = null;
    let sellOffData = null;
    let volumeBracketData = null;
    let botVolumeData = null;
    let postRugData = null;
    let walletClusteringData = null;
    
    let isLoading = true;
    
    onMount(async () => {
      try {
        // Load all data in parallel
        const [
          summary,
          transFlow,
          anomalies,
          ownership,
          sellOff,
          volumeBracket,
          botVolume,
          postRug,
          walletClustering
        ] = await Promise.all([
          api.fetchDashboardSummary(),
          api.fetchTransactionFlowData(),
          api.fetchAnomalyData(),
          api.fetchOwnershipData(),
          api.fetchSellOffData(),
          api.fetchVolumeBracketData(),
          api.fetchBotVolumeData(),
          api.fetchPostRugData(),
          api.fetchWalletClusteringData()
        ]);
        
        // Update state with fetched data
        summaryData = summary;
        tokens = [
          { id: 1, name: "PEPE", volume: 75, change: 12.5 },
          { id: 2, name: "DOGE", volume: 60, change: -5.2 },
          { id: 3, name: "SHIB", volume: 45, change: 8.7 },
          { id: 4, name: "FLOKI", volume: 30, change: 22.1 },
          { id: 5, name: "WOJAK", volume: 25, change: -15.3 }
        ];
        transactions = [
          { date: "2023-04-01", value: 120 },
          { date: "2023-04-02", value: 150 },
          { date: "2023-04-03", value: 180 },
          { date: "2023-04-04", value: 220 },
          { date: "2023-04-05", value: 190 },
          { date: "2023-04-06", value: 250 },
          { date: "2023-04-07", value: 280 }
        ];
        transactionFlowData = transFlow;
        anomalyData = anomalies;
        ownershipData = ownership;
        sellOffData = sellOff;
        volumeBracketData = volumeBracket;
        botVolumeData = botVolume;
        postRugData = postRug;
        walletClusteringData = walletClustering;
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        isLoading = false;
      }
    });
    
    async function refreshData() {
      isLoading = true;
      try {
        // Reload all data
        const [
          summary,
          transFlow,
          anomalies,
          ownership,
          sellOff,
          volumeBracket,
          botVolume,
          postRug,
          walletClustering
        ] = await Promise.all([
          api.fetchDashboardSummary(),
          api.fetchTransactionFlowData(),
          api.fetchAnomalyData(),
          api.fetchOwnershipData(),
          api.fetchSellOffData(),
          api.fetchVolumeBracketData(),
          api.fetchBotVolumeData(),
          api.fetchPostRugData(),
          api.fetchWalletClusteringData()
        ]);
        
        // Update state with fetched data
        summaryData = summary;
        transactionFlowData = transFlow;
        anomalyData = anomalies;
        ownershipData = ownership;
        sellOffData = sellOff;
        volumeBracketData = volumeBracket;
        botVolumeData = botVolume;
        postRugData = postRug;
        walletClusteringData = walletClustering;
        
      } catch (error) {
        console.error("Error refreshing dashboard data:", error);
      } finally {
        isLoading = false;
      }
    }
  </script>
  
  <div class="container mx-auto p-4">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" on:click={refreshData} disabled={isLoading}>
          <RefreshCw class="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <!-- <Sheet>
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
        </Sheet> -->
      </div>
    </header>
  
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <DataCard 
        title="Total Transactions" 
        value={summaryData ? summaryData.totalTransactions.toLocaleString() : "0"} 
        change={summaryData ? `+${summaryData.transactionsChange}%` : "0%"} 
        icon={BarChart3} 
        isPositive={true} 
        isLoading={isLoading} 
      />
      <DataCard 
        title="Active Wallets" 
        value={summaryData ? summaryData.activeWallets.toLocaleString() : "0"} 
        change={summaryData ? `+${summaryData.walletsChange}%` : "0%"} 
        icon={PieChart} 
        isPositive={true} 
        isLoading={isLoading} 
      />
      <DataCard 
        title="Suspicious Activity" 
        value={summaryData ? summaryData.suspiciousActivity.toLocaleString() : "0"} 
        change={summaryData ? `${summaryData.suspiciousChange}%` : "0%"} 
        icon={AlertTriangle} 
        isPositive={false} 
        isLoading={isLoading} 
      />
    </div>
  
    <Tabs defaultValue="overview" class="mb-6">
      <TabsList class="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="transactions">Transaction Analysis</TabsTrigger>
        <TabsTrigger value="wallets">Wallet Analysis</TabsTrigger>
        <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </TabsContent>
      
      <TabsContent value="transactions" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Flow Mapping</CardTitle>
              <CardDescription>Wallet-to-wallet token transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionFlowChart data={transactionFlowData} isLoading={isLoading} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Volume Bracket Distribution</CardTitle>
              <CardDescription>Transaction counts by volume size</CardDescription>
            </CardHeader>
            <CardContent>
              <VolumeBracketChart data={volumeBracketData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Bot Volume Detection</CardTitle>
            <CardDescription>Percentage of volume from bot vs. organic transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <BotVolumeChart data={botVolumeData} isLoading={isLoading} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="wallets" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ownership Concentration</CardTitle>
              <CardDescription>Top 10 wallet ownership percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <OwnershipChart data={ownershipData} isLoading={isLoading} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sell-Off Pattern</CardTitle>
              <CardDescription>Token balance over time for top wallets</CardDescription>
            </CardHeader>
            <CardContent>
              <SellOffChart data={sellOffData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet Clustering & Behavior Tracking</CardTitle>
            <CardDescription>Related wallet groups and transaction patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <WalletClusteringChart data={walletClusteringData} isLoading={isLoading} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="anomalies" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>Volume/price anomalies over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AnomalyDetectionChart data={anomalyData} isLoading={isLoading} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Post-Rug Indicators</CardTitle>
              <CardDescription>Signs of a rug pull event</CardDescription>
            </CardHeader>
            <CardContent>
              <PostRugChart data={postRugData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>