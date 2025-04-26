<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "$lib/components/ui/card";
  import { ArrowRight, Shield, TrendingUp, Search } from "lucide-svelte";
</script>

<div class="container mx-auto px-4 py-12">
  <div class="max-w-3xl mx-auto text-center mb-12">
    <h1 class="text-6xl font-bold mb-4">Verdexa</h1>
    <p class="text-xl text-muted-foreground mb-8">
      Advanced analytics and monitoring for meme token transactions and suspicious activities
    </p>
    <div class="flex flex-wrap justify-center gap-4">
      <Button size="lg">
        <a href="/dashboard">View Dashboard</a>
      </Button>
      <Button variant="outline" size="lg">
        Learn More
      </Button>
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <Card>
      <CardHeader>
        <Shield class="h-10 w-10 text-primary mb-2" />
        <CardTitle>Fraud Detection</CardTitle>
        <CardDescription>
          Identify suspicious patterns and potential scams in meme token transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          Our advanced algorithms analyze transaction patterns to detect potential rug pulls, 
          pump and dump schemes, and other fraudulent activities.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" class="w-full justify-start">
          Learn more <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
    
    <Card>
      <CardHeader>
        <TrendingUp class="h-10 w-10 text-primary mb-2" />
        <CardTitle>Market Analysis</CardTitle>
        <CardDescription>
          Track and analyze meme token market trends and trading volumes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          Get real-time insights into market movements, trading volumes, and price actions
          to make informed decisions about meme token investments.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" class="w-full justify-start">
          Learn more <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
    
    <Card>
      <CardHeader>
        <Search class="h-10 w-10 text-primary mb-2" />
        <CardTitle>Wallet Investigation</CardTitle>
        <CardDescription>
          Trace and investigate suspicious wallet activities and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          Follow the money trail with our wallet investigation tools. Identify connections
          between wallets and track the flow of funds across the blockchain.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" class="w-full justify-start">
          Learn more <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  </div>
  
  <div class="bg-muted rounded-lg p-8 text-center">
    <h2 class="text-2xl font-bold mb-4">Ready to investigate?</h2>
    <p class="text-muted-foreground mb-6">
      Start using our dashboard to monitor and analyze meme token transactions.
    </p>
    <Button size="lg">
      <a href="/dashboard">Get Started</a>
    </Button>
  </div>
</div>