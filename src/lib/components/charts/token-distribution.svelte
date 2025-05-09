<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: { id: number; name: string; volume: number; change: number }[] = [];
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  
  const colors = [
    '#82e0aa', // primary
    '#f5cba7', // secondary
    '#aed6f1',
    '#f9e79f',
    '#d7bde2',
    '#a3e4d7',
    '#f5b7b1'
  ];
  
  function drawChart() {
    if (!canvas || isLoading) return;
    
    ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    const total = data.reduce((sum, item) => sum + item.volume, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    let startAngle = 0;
    
    // Draw pie slices
    data.forEach((item, index) => {
      const sliceAngle = (item.volume / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Draw label line and text if slice is big enough
      if (sliceAngle > 0.2) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.name, labelX, labelY);
      }
      
      startAngle = endAngle;
    });
    
    // Draw center circle (donut hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Draw legend
    const legendX = 10;
    let legendY = height - (data.length * 25) - 10;
    
    data.forEach((item, index) => {
      const color = colors[index % colors.length];
      
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY, 15, 15);
      
      // Draw text
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.name} (${Math.round(item.volume)}%)`, legendX + 25, legendY + 7.5);
      
      legendY += 25;
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