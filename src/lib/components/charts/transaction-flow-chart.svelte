<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: {
    nodes: Array<{id: string, label: string, size: number, color: string}>,
    links: Array<{source: string, target: string, value: number}>
  } | null = null;
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let width: number;
  let height: number;
  let simulation: any = null;
  let animationId: number;
  
  // Force-directed graph simulation
  function createSimulation(nodes: any[], links: any[]) {
    // Create a map of node IDs to node objects
    const nodeMap = new Map();
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0 });
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
      const lineWidth = Math.max(1, Math.min(5, link.value / 2));
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      
      // Draw arrow
      const angle = Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x);
      const arrowSize = 5 + lineWidth;
      
      ctx.beginPath();
      ctx.moveTo(
        link.target.x - Math.cos(angle) * (link.target.size + 2),
        link.target.y - Math.sin(angle) * (link.target.size + 2)
      );
      ctx.lineTo(
        link.target.x - Math.cos(angle) * (link.target.size + 2) - Math.cos(angle - Math.PI/6) * arrowSize,
        link.target.y - Math.sin(angle) * (link.target.size + 2) - Math.sin(angle - Math.PI/6) * arrowSize
      );
      ctx.lineTo(
        link.target.x - Math.cos(angle) * (link.target.size + 2) - Math.cos(angle + Math.PI/6) * arrowSize,
        link.target.y - Math.sin(angle) * (link.target.size + 2) - Math.sin(angle + Math.PI/6) * arrowSize
      );
      ctx.closePath();
      ctx.fillStyle = '#94a3b8';
      ctx.fill();
    });
    
    // Draw nodes
    simulation.nodes.forEach((node: any) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw labels
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
    
    // Continue animation
    animationId = requestAnimationFrame(drawGraph);
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
</script>

<div class="w-full h-[300px] relative">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="h-full w-full bg-muted/50 animate-pulse rounded"></div>
    </div>
  {:else}
    <canvas bind:this={canvas} class="w-full h-full"></canvas>
    <div class="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 p-1 rounded">
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full bg-[#82e0aa]"></span>
        <span>Regular Wallet</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full bg-[#f5cba7]"></span>
        <span>Suspicious Wallet</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full bg-[#aed6f1]"></span>
        <span>Exchange</span>
      </div>
    </div>
  {/if}
</div>