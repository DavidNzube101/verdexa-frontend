<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: Array<{id: string, label: string, value: number}> | null = null;
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let tooltipEl: HTMLDivElement;
  let activeSliceIndex: number = -1;
  
  const colors = [
    '#82e0aa', // primary
    '#f5cba7', // secondary
    '#aed6f1',
    '#f9e79f',
    '#d7bde2',
    '#a3e4d7',
    '#f5b7b1',
    '#d5dbdb',
    '#aab7b8',
    '#85929e',
    '#d5f5e3' // others
  ];
  
  function drawChart() {
    if (!canvas || !data || isLoading) return;
    
    ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    let startAngle = 0;
    
    // Draw pie slices
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Highlight active slice
      if (index === activeSliceIndex) {
        ctx.fillStyle = colors[index % colors.length];
        // Draw slightly larger
        ctx.save();
        ctx.translate(
          centerX + Math.cos(startAngle + sliceAngle / 2) * 10,
          centerY + Math.sin(startAngle + sliceAngle / 2) * 10
        );
        ctx.scale(1.05, 1.05);
        ctx.translate(
          -(centerX + Math.cos(startAngle + sliceAngle / 2) * 10),
          -(centerY + Math.sin(startAngle + sliceAngle / 2) * 10)
        );
      } else {
        ctx.fillStyle = colors[index % colors.length];
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      if (index === activeSliceIndex) {
        ctx.restore();
      }
      
      // Draw label line and text if slice is big enough
      if (sliceAngle > 0.15) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.value.toFixed(1) + '%', labelX, labelY);
      }
      
      startAngle = endAngle;
    });
    
    // Draw center circle (donut hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw center text
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Top 10', centerX, centerY - 10);
    ctx.fillText('Wallets', centerX, centerY + 10);
    
    // Draw legend
    const legendX = 10;
    let legendY = 10;
    
    data.forEach((item, index) => {
      const color = colors[index % colors.length];
      
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY, 12, 12);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX, legendY, 12, 12);
      
      // Draw text
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      // Truncate label if too long
      let label = item.label;
      if (label.length > 10) {
        label = label.substring(0, 8) + '...';
      }
      
      ctx.fillText(`${label} (${item.value.toFixed(1)}%)`, legendX + 18, legendY + 6);
      
      legendY += 20;
      
      // Move to right column if too many items
      if (legendY > height - 20 && index < data.length / 2) {
        legendY = 10;
        let legendX = width - 120;
      }
    });
  }
  
  function handleMouseMove(event: MouseEvent) {
    if (!canvas || !data || isLoading) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if mouse is within the donut
    if (distance > radius * 0.5 && distance < radius) {
      // Calculate angle
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI; // Convert to 0-2π range
      
      // Find which slice this angle corresponds to
      const total = data.reduce((sum, item) => sum + item.value, 0);
      let startAngle = 0;
      
      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i].value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        
        if (angle >= startAngle && angle < endAngle) {
          if (activeSliceIndex !== i) {
            activeSliceIndex = i;
            drawChart();
            
            // Show tooltip
            tooltipEl.style.display = 'block';
            tooltipEl.style.left = `${event.clientX}px`;
            tooltipEl.style.top = `${event.clientY - 40}px`;
            
            const item = data[i];
            tooltipEl.innerHTML = `
              <div class="font-bold">${item.label}</div>
              <div>${item.value.toFixed(2)}% of total supply</div>
            `;
          }
          return;
        }
        
        startAngle = endAngle;
      }
    } else {
      if (activeSliceIndex !== -1) {
        activeSliceIndex = -1;
        drawChart();
        tooltipEl.style.display = 'none';
      }
    }
  }
  
  function handleMouseLeave() {
    if (activeSliceIndex !== -1) {
      activeSliceIndex = -1;
      drawChart();
      tooltipEl.style.display = 'none';
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
          drawChart();
        }
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Create tooltip element
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'absolute z-50 bg-white p-2 rounded shadow-lg text-xs pointer-events-none';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (tooltipEl && tooltipEl.parentNode) {
        tooltipEl.parentNode.removeChild(tooltipEl);
      }
    };
  });
  
  $: if (canvas && data && !isLoading) {
    drawChart();
  }
</script>

<div class="w-full h-[300px] relative">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="h-full w-full bg-muted/50 animate-pulse rounded"></div>
    </div>
  {:else}
    <canvas 
      bind:this={canvas} 
      class="w-full h-full" 
      on:mousemove={handleMouseMove}
      on:mouseleave={handleMouseLeave}
    ></canvas>
  {/if}
</div>