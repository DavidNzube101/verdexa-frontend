<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: {
    dates: string[],
    values: number[],
    anomalies: Array<{date: string, value: number, type: string, percentage: number}>
  } | null = null;
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let tooltipEl: HTMLDivElement;
  let activeAnomalyIndex: number = -1;
  
  function drawChart() {
    if (!canvas || !data || isLoading) return;
    
    ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.values.length === 0) return;
    
    // Find min and max values
    const values = data.values;
    const maxValue = Math.max(...values) * 1.1;
    const minValue = Math.min(0, Math.min(...values) * 0.9);
    
    // Calculate scales
    const xScale = width / (data.dates.length - 1);
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
    data.dates.forEach((date, i) => {
      const x = i * xScale;
      const y = height - ((data.values[i] - minValue) * yScale);
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
    data.dates.forEach((date, i) => {
      const x = i * xScale;
      const y = height - ((data.values[i] - minValue) * yScale);
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
    
    // Draw points and anomalies
    data.dates.forEach((date, i) => {
      const x = i * xScale;
      const y = height - ((data.values[i] - minValue) * yScale);
      
      // Check if this point is an anomaly
      const isAnomaly = data.anomalies.some(a => a.date === date);
      
      if (isAnomaly) {
        // Draw anomaly point
        ctx.fillStyle = '#ef4444'; // Red for anomalies
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw vertical line for anomaly
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)'; // Transparent red
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw anomaly label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', x, y - 15);
      } else {
        // Draw regular point
        ctx.fillStyle = '#82e0aa';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    data.dates.forEach((date, i) => {
      if (i % Math.ceil(data.dates.length / 7) === 0) {
        const x = i * xScale;
        const dateObj = new Date(date);
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.fillText(label, x, height + 15);
      }
    });
  }
  
  function handleMouseMove(event: MouseEvent) {
    if (!canvas || !data || isLoading) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const width = canvas.width;
    const xScale = width / (data.dates.length - 1);
    
    // Find closest point
    let closestIndex = -1;
    let closestDistance = Infinity;
    
    data.dates.forEach((date, i) => {
      const pointX = i * xScale;
      const distance = Math.abs(x - pointX);
      
      if (distance < closestDistance && distance < 20) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    
    // Check if the closest point is an anomaly
    if (closestIndex !== -1) {
      const date = data.dates[closestIndex];
      const anomalyIndex = data.anomalies.findIndex(a => a.date === date);
      
      if (anomalyIndex !== -1) {
        activeAnomalyIndex = anomalyIndex;
        
        // Position tooltip
        const pointX = closestIndex * xScale;
        const maxValue = Math.max(...data.values) * 1.1;
        const minValue = Math.min(0, Math.min(...data.values) * 0.9);
        const yScale = canvas.height / (maxValue - minValue);
        const pointY = canvas.height - ((data.values[closestIndex] - minValue) * yScale);
        
        tooltipEl.style.display = 'block';
        tooltipEl.style.left = `${pointX + rect.left}px`;
        tooltipEl.style.top = `${pointY + rect.top - 70}px`;
        
        const anomaly = data.anomalies[anomalyIndex];
        tooltipEl.innerHTML = `
          <div class="font-bold text-red-500">Anomaly Detected</div>
          <div>Date: ${new Date(anomaly.date).toLocaleDateString()}</div>
          <div>Value: ${anomaly.value}</div>
          <div>Change: +${anomaly.percentage.toFixed(1)}%</div>
        `;
      } else {
        activeAnomalyIndex = -1;
        tooltipEl.style.display = 'none';
      }
    } else {
      activeAnomalyIndex = -1;
      tooltipEl.style.display = 'none';
    }
  }
  
  function handleMouseLeave() {
    activeAnomalyIndex = -1;
    if (tooltipEl) {
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
          canvas.height = 200;
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

<div class="w-full h-[250px] relative">
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
    <div class="absolute top-2 right-2 flex items-center gap-2 bg-background/80 p-1 rounded text-xs">
      <span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
      <span>Anomaly</span>
    </div>
  {/if}
</div>