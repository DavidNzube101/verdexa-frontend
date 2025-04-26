<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: Array<{type: string, value: number}> | null = null;
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
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    
    // Draw pie slices
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Set colors based on type
      if (item.type.toLowerCase().includes('bot')) {
        ctx.fillStyle = '#f5cba7'; // secondary for bots
      } else {
        ctx.fillStyle = '#82e0aa'; // primary for organic
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw percentage label
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.value.toFixed(1) + '%', labelX, labelY);
      
      startAngle = endAngle;
    });
    
    // Draw legend
    const legendY = height - 50;
    
    data.forEach((item, index) => {
      const legendX = width / 4 + (index * width / 2);
      
      // Set colors based on type
      let color;
      if (item.type.toLowerCase().includes('bot')) {
        color = '#f5cba7'; // secondary for bots
      } else {
        color = '#82e0aa'; // primary for organic
      }
      
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX - 50, legendY, 15, 15);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX - 50, legendY, 15, 15);
      
      // Draw text
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.type} (${item.value.toFixed(1)}%)`, legendX - 30, legendY + 7.5);
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
  
  $: if (canvas && data && !isLoading) {
    drawChart();
  }
</script>

<div class="w-full h-[200px] relative">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="h-full w-full bg-muted/50 animate-pulse rounded"></div>
    </div>
  {:else}
    <canvas bind:this={canvas} class="w-full h-full"></canvas>
  {/if}
</div>