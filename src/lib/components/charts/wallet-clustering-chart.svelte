<script lang="ts">
  import { onMount } from 'svelte';
  import { Badge } from "$lib/components/ui/badge";
  
  export let data: {
    nodes: Array<{id: string, label: string, size: number, color: string, type: string, cluster?: string}>,
    links: Array<{source: string, target: string, value: number}>,
    timeline: Array<{time: string, wallet: string, action: string, amount: number, target?: string}>
  } | null = null;
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let width: number;
  let height: number;
  let simulation: any = null;
  let animationId: number;
  let selectedNode: string | null = null;
  
  // Force-directed graph simulation
  function createSimulation(nodes: any[], links: any[]) {
    // Create a map of node IDs to node objects
    const nodeMap = new Map();
    nodes.forEach(node => {
      nodeMap.set(node.id, { 
        ...node, 
        x: Math.random() * width, 
        y: Math.random() * height, 
        vx: 0, 
        vy: 0,
        selected: node.id === selectedNode
      });
    });
    
    // Convert link source/target from IDs to node objects
    const processedLinks = links.map(link => ({
      ...link,
      source: nodeMap.get(link.source),
      target: nodeMap.get(link.target)
    }));
    
    const processedNodes = Array.from(nodeMap.values());
    
    return {
      nodes: processedNodes,
      links: processedLinks,
      tick: function() {
        // Apply forces
        processedLinks.forEach(link => {
          const dx = link.target.x - link.source.x;
          const dy = link.target.y - link.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (distance - 100) * 0.03; // Spring force
          
          const fx = dx / distance * force;
          const fy = dy / distance * force;
          
          link.target.vx += fx;
          link.target.vy += fy;
          link.source.vx -= fx;
          link.source.vy -= fy;
        });
        
        // Apply repulsive forces between nodes
        for (let i = 0; i < processedNodes.length; i++) {
          for (let j = i + 1; j < processedNodes.length; j++) {
            const nodeA = processedNodes[i];
            const nodeB = processedNodes[j];
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            if (distance < 150) {
              const force = 1 / (distance * distance) * 50;
              const fx = dx / distance * force;
              const fy = dy / distance * force;
              
              nodeA.vx -= fx;
              nodeA.vy -= fy;
              nodeB.vx += fx;
              nodeB.vy += fy;
            }
          }
        }
        
        // Update positions
        processedNodes.forEach(node => {
          node.vx *= 0.9; // Damping
          node.vy *= 0.9;
          
          node.x += node.vx;
          node.y += node.vy;
          
          // Boundary constraints
          if (node.x < node.size) node.x = node.size;
          if (node.x > width - node.size) node.x = width - node.size;
          if (node.y < node.size) node.y = node.size;
          if (node.y > height - node.size) node.y = height - node.size;
        });
      }
    };
  }
  
  function drawGraph() {
    if (!canvas || !data || isLoading) return;
    
    ctx = canvas.getContext('2d')!;
    width = canvas.width;
    height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (!simulation) {
      simulation = createSimulation(data.nodes, data.links);
    }
    
    // Run simulation step
    simulation.tick();
    
    // Draw links
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    simulation.links.forEach((link: any) => {
      // Check if either node is selected
      const isSelected = selectedNode && (link.source.id === selectedNode || link.target.id === selectedNode);
      
      const lineWidth = Math.max(1, Math.min(5, link.value / 2));
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.lineWidth = lineWidth;
      
      if (isSelected) {
        ctx.strokeStyle = '#f5cba7'; // Highlight selected links
      } else {
        ctx.strokeStyle = '#e2e8f0';
      }
      
      ctx.stroke();
    });
    
    // Draw nodes
    simulation.nodes.forEach((node: any) => {
      // Check if node is selected
      const isSelected = node.id === selectedNode;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size + (isSelected ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#f5cba7' : '#ffffff';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
      
      // Draw labels
      ctx.fillStyle = '#1e293b';
      ctx.font = isSelected ? 'bold 12px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
    
    // Continue animation
    animationId = requestAnimationFrame(drawGraph);
  }
  
  function handleCanvasClick(event: MouseEvent) {
    if (!canvas || !data || isLoading || !simulation) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find clicked node
    let clickedNode = null;
    for (const node of simulation.nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.size + 5) {
        clickedNode = node;
        break;
      }
    }
    
    if (clickedNode) {
      selectedNode = clickedNode.id === selectedNode ? null : clickedNode.id;
      
      // Reset simulation with new selection state
      simulation = createSimulation(data.nodes, data.links);
    } else {
      selectedNode = null;
      simulation = createSimulation(data.nodes, data.links);
    }
  }
  
  onMount(() => {
    // Set canvas dimensions based on its container
    const resize = () => {
      if (canvas) {
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width;
          canvas.height = 300;
          
          // Reset simulation when resizing
          if (simulation) {
            simulation = createSimulation(data?.nodes || [], data?.links || []);
          }
        }
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Start animation
    if (data && !isLoading) {
      animationId = requestAnimationFrame(drawGraph);
    }
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
  
  $: if (data && !isLoading && canvas) {
    // Reset simulation when data changes
    simulation = createSimulation(data.nodes, data.links);
    if (!animationId) {
      animationId = requestAnimationFrame(drawGraph);
    }
  }
  
  // Filter timeline based on selected node
  $: filteredTimeline = data?.timeline.filter(item => {
    if (!selectedNode) return true;
    return item.wallet === selectedNode || item.target === selectedNode;
  }) || [];
</script>

<div class="space-y-4">
  <div class="w-full h-[300px] relative">
    {#if isLoading}
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="h-full w-full bg-muted/50 animate-pulse rounded"></div>
      </div>
    {:else}
      <canvas 
        bind:this={canvas} 
        class="w-full h-full cursor-pointer" 
        on:click={handleCanvasClick}
      ></canvas>
      <div class="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 p-1 rounded">
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-[#82e0aa]"></span>
          <span>Cluster 1</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-[#f5cba7]"></span>
          <span>Cluster 2</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-[#aed6f1]"></span>
          <span>Cluster 3</span>
        </div>
      </div>
      <div class="absolute top-2 right-2 text-xs bg-background/80 p-1 rounded">
        <span>Click on a node to see its transactions</span>
      </div>
    {/if}
  </div>
  
  <div class="border rounded-md p-2">
    <h3 class="text-sm font-medium mb-2">
      {selectedNode ? `Transactions for ${selectedNode}` : 'Recent Transactions'}
    </h3>
    <div class="max-h-[200px] overflow-y-auto space-y-2">
      {#if filteredTimeline.length === 0}
        <div class="text-sm text-muted-foreground text-center py-4">
          {selectedNode ? 'No transactions found for this wallet' : 'No recent transactions'}
        </div>
      {:else}
        {#each filteredTimeline as item}
          <div class="flex items-center justify-between text-xs border-b pb-2">
            <div>
              <span class="font-medium">{item.wallet}</span>
              {#if item.action === 'transfer'}
                <span> transferred to </span>
                <span class="font-medium">{item.target}</span>
              {:else}
                <span> {item.action} </span>
              {/if}
              <span class="font-medium">{item.amount.toLocaleString()}</span> tokens
            </div>
            <div class="flex items-center gap-2">
              <Badge variant={item.action === 'buy' ? 'default' : item.action === 'sell' ? 'destructive' : 'outline'}>
                {item.action}
              </Badge>
              <span class="text-muted-foreground">{new Date(item.time).toLocaleString()}</span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>