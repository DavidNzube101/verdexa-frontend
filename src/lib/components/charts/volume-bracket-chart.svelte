<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: Array<{bracket: string, count: number}> | null = null;
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  
  function drawChart() {
    if (!canvas || !data || isLoading) return;
    
    ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    // Find max count
    const maxCount = Math.max(...data.map(item => item.count));
    
    // Calculate scales
    const barWidth = width / data.length * 0.8;
    const barSpacing = width / data.length * 0.2;
    const yScale = (height - 40) / maxCount; // Leave space for labels
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(0, height - 20);
    ctx.lineTo(width, height - 20);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.setLineDash([2, 2]);
    for (let i = 1; i <= 5; i++) {
      const y = height - 20 - (i * (height - 40) / 5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Draw y-axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(Math.round(i * maxCount / 5).toString(), 5, y - 5);
    }
    ctx.setLineDash([]);
    
    // Draw bars
    data.forEach((item, i) => {
      const x = (i * (barWidth + barSpacing)) + barSpacing / 2;
      const barHeight = item.count * yScale;
      const y = height - 20 - barHeight;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, height - 20);
      gradient.addColorStop(0, '#82e0aa'); // primary
      gradient.addColorStop(1, '#f5cba7'); // secondary
      
      // Draw bar
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.rect(x, y, barWidth, barHeight);
      ctx.fill();
      
      // Draw bar border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw count on top of bar
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.count.toString(), x + barWidth / 2, y - 5);
      
      // Draw x-axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      
      // Rotate labels if they're too long
      const label = item.bracket;
      ctx.save();
      ctx.translate(x + barWidth / 2, height - 5);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
  }
  
  onMount(() => {
    // Set canvas dimensions based on its container
    const resize = () => {
      if (canvas) {
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width;
          canvas.height = 250;
          drawChart();
        }
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  });
  
  $: if (canvas && data && !isLoading) {
    drawChart();
  }
</script>

<div class="w-full h-[250px] relative">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="h-full w-full bg-muted/50 animate-pulse rounded"></div>
    </div>
  {:else}
    <canvas bind:this={canvas} class="w-full h-full"></canvas>
  {/if}
</div>