<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: { date: string; value: number }[] = [];
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  
  function drawChart() {
    if (!canvas || isLoading) return;
    
    ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    // Find min and max values
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values) * 1.1;
    const minValue = Math.min(0, Math.min(...values) * 0.9);
    
    // Calculate scales
    const xScale = width / (data.length - 1);
    const yScale = height / (maxValue - minValue);
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.setLineDash([2, 2]);
    for (let i = 1; i <= 5; i++) {
      const y = height - (i * height / 5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw line
    ctx.strokeStyle = '#82e0aa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = i * xScale;
      const y = height - ((d.value - minValue) * yScale);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw area
    ctx.fillStyle = 'rgba(130, 224, 170, 0.2)';
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = i * xScale;
      const y = height - ((d.value - minValue) * yScale);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    
    // Draw points
    ctx.fillStyle = '#82e0aa';
    data.forEach((d, i) => {
      const x = i * xScale;
      const y = height - ((d.value - minValue) * yScale);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      if (i % Math.ceil(data.length / 7) === 0) {
        const x = i * xScale;
        const date = new Date(d.date);
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.fillText(label, x, height + 15);
      }
    });
  }
  
  onMount(() => {
    // Set canvas dimensions based on its container
    const resize = () => {
      if (canvas) {
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width;
          canvas.height = 200;
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
  
  $: if (canvas && !isLoading) {
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