<script lang="ts">
  import { onMount } from 'svelte';
  import { Progress } from "$lib/components/ui/progress";
  
  export let data: {
    lpPull: number,
    priceData: {
      dates: string[],
      prices: number[],
      rugEvent: string
    },
    activityData: {
      dates: string[],
      transactions: number[],
      rugEvent: string
    }
  } | null = null;
  export let isLoading: boolean = false;
  
  let priceCanvas: HTMLCanvasElement;
  let activityCanvas: HTMLCanvasElement;
  let priceCtx: CanvasRenderingContext2D;
  let activityCtx: CanvasRenderingContext2D;
  
  function drawPriceChart() {
    if (!priceCanvas || !data || isLoading) return;
    
    priceCtx = priceCanvas.getContext('2d')!;
    const width = priceCanvas.width;
    const height = priceCanvas.height;
    
    // Clear canvas
    priceCtx.clearRect(0, 0, width, height);
    
    if (data.priceData.dates.length === 0) return;
    
    // Find min and max values
    const prices = data.priceData.prices;
    const maxPrice = Math.max(...prices) * 1.1;
    const minPrice = Math.min(...prices) * 0.9;
    
    // Calculate scales
    const xScale = width / (data.priceData.dates.length - 1);
    const yScale = height / (maxPrice - minPrice);
    
    // Draw axes
    priceCtx.strokeStyle = '#e2e8f0';
    priceCtx.beginPath();
    priceCtx.moveTo(0, height);
    priceCtx.lineTo(width, height);
    priceCtx.stroke();
    
    // Draw grid lines
    priceCtx.strokeStyle = '#e2e8f0';
    priceCtx.setLineDash([2, 2]);
    for (let i = 1; i <= 5; i++) {
      const y = height - (i * height / 5);
      priceCtx.beginPath();
      priceCtx.moveTo(0, y);
      priceCtx.lineTo(width, y);
      priceCtx.stroke();
    }
    priceCtx.setLineDash([]);
    
    // Draw line
    priceCtx.strokeStyle = '#82e0aa';
    priceCtx.lineWidth = 2;
    priceCtx.beginPath();
    data.priceData.dates.forEach((date, i) => {
      const x = i * xScale;
      const y = height - ((prices[i] - minPrice) * yScale);
      if (i === 0) {
        priceCtx.moveTo(x, y);
      } else {
        priceCtx.lineTo(x, y);
      }
    });
    priceCtx.stroke();
    
    // Draw area
    priceCtx.fillStyle = 'rgba(130, 224, 170, 0.2)';
    priceCtx.beginPath();
    data.priceData.dates.forEach((date, i) => {
      const x = i * xScale;
      const y = height - ((prices[i] - minPrice) * yScale);
      if (i === 0) {
        priceCtx.moveTo(x, y);
      } else {
        priceCtx.lineTo(x, y);
      }
    });
    priceCtx.lineTo(width, height);
    priceCtx.lineTo(0, height);
    priceCtx.closePath();
    priceCtx.fill();
    
    // Draw rug event line
    const rugIndex = data.priceData.dates.indexOf(data.priceData.rugEvent);
    if (rugIndex !== -1) {
      const x = rugIndex * xScale;
      
      priceCtx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red
      priceCtx.lineWidth = 2;
      priceCtx.setLineDash([5, 3]);
      priceCtx.beginPath();
      priceCtx.moveTo(x, 0);
      priceCtx.lineTo(x, height);
      priceCtx.stroke();
      priceCtx.setLineDash([]);
      
      // Draw rug event label
      priceCtx.fillStyle = '#ef4444';
      priceCtx.font = 'bold 10px sans-serif';
      priceCtx.textAlign = 'center';
      priceCtx.fillText('Rug Pull', x, 10);
    }
    
    // Draw points
    data.priceData.dates.forEach((date, i) => {
      const x = i * xScale;
      const y = height - ((prices[i] - minPrice) * yScale);
      
      priceCtx.fillStyle = '#82e0aa';
      priceCtx.beginPath();
      priceCtx.arc(x, y, 3, 0, Math.PI * 2);
      priceCtx.fill();
    });
    
    // Draw labels
    priceCtx.fillStyle = '#64748b';
    priceCtx.font = '8px sans-serif';
    priceCtx.textAlign = 'center';
    data.priceData.dates.forEach((date, i) => {
      if (i % Math.ceil(data.priceData.dates.length / 5) === 0 || i === data.priceData.dates.length - 1) {
        const x = i * xScale;
        const dateObj = new Date(date);
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        priceCtx.fillText(label, x, height - 5);
      }
    });
  }
  
  function drawActivityChart() {
    if (!activityCanvas || !data || isLoading) return;
    
    activityCtx = activityCanvas.getContext('2d')!;
    const width = activityCanvas.width;
    const height = activityCanvas.height;
    
    // Clear canvas
    activityCtx.clearRect(0, 0, width, height);
    
    if (data.activityData.dates.length === 0) return;
    
    // Find max value
    const transactions = data.activityData.transactions;
    const maxTransactions = Math.max(...transactions) * 1.1;
    
    // Calculate scales
    const barWidth = width / transactions.length * 0.8;
    const barSpacing = width / transactions.length * 0.2;
    const yScale = height / maxTransactions;
    
    // Draw axes
    activityCtx.strokeStyle = '#e2e8f0';
    activityCtx.beginPath();
    activityCtx.moveTo(0, height);
    activityCtx.lineTo(width, height);
    activityCtx.stroke();
    
    // Draw grid lines
    activityCtx.strokeStyle = '#e2e8f0';
    activityCtx.setLineDash([2, 2]);
    for (let i = 1; i <= 5; i++) {
      const y = height - (i * height / 5);
      activityCtx.beginPath();
      activityCtx.moveTo(0, y);
      activityCtx.lineTo(width, y);
      activityCtx.stroke();
      
      // Draw y-axis labels
      activityCtx.fillStyle = '#64748b';
      activityCtx.font = '8px sans-serif';
      activityCtx.textAlign = 'left';
      activityCtx.fillText(Math.round(i * maxTransactions / 5).toString(), 5, y - 2);
    }
    activityCtx.setLineDash([]);
    
    // Draw bars
    data.activityData.dates.forEach((date, i) => {
      const x = (i * (barWidth + barSpacing)) + barSpacing / 2;
      const barHeight = transactions[i] * yScale;
      const y = height - barHeight;
      
      // Color bars differently before and after rug event
      const rugIndex = data.activityData.dates.indexOf(data.activityData.rugEvent);
      let color;
      
      if (i < rugIndex) {
        color = '#82e0aa'; // primary
      } else if (i === rugIndex) {
        color = '#f5cba7'; // secondary
      } else {
        color = '#ef4444'; // red
      }
      
      // Draw bar
      activityCtx.fillStyle = color;
      activityCtx.beginPath();
      activityCtx.rect(x, y, barWidth, barHeight);
      activityCtx.fill();
      
      // Draw bar border
      activityCtx.strokeStyle = '#ffffff';
      activityCtx.lineWidth = 1;
      activityCtx.stroke();
      
      // Draw x-axis labels
      if (i % Math.ceil(data.activityData.dates.length / 5) === 0 || i === data.activityData.dates.length - 1) {
        activityCtx.fillStyle = '#64748b';
        activityCtx.font = '8px sans-serif';
        activityCtx.textAlign = 'center';
        const dateObj = new Date(date);
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        activityCtx.fillText(label, x + barWidth / 2, height - 5);
      }
    });
    
    // Draw rug event line
    const rugIndex = data.activityData.dates.indexOf(data.activityData.rugEvent);
    if (rugIndex !== -1) {
      const x = (rugIndex * (barWidth + barSpacing)) + barSpacing / 2 + barWidth / 2;
      
      activityCtx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red
      activityCtx.lineWidth = 2;
      activityCtx.setLineDash([5, 3]);
      activityCtx.beginPath();
      activityCtx.moveTo(x, 0);
      activityCtx.lineTo(x, height);
      activityCtx.stroke();
      activityCtx.setLineDash([]);
      
      // Draw rug event label
      activityCtx.fillStyle = '#ef4444';
      activityCtx.font = 'bold 10px sans-serif';
      activityCtx.textAlign = 'center';
      activityCtx.fillText('Rug Pull', x, 10);
    }
  }
  
  onMount(() => {
    // Set canvas dimensions based on its container
    const resize = () => {
      if (priceCanvas && activityCanvas) {
        const priceRect = priceCanvas.parentElement?.getBoundingClientRect();
        const activityRect = activityCanvas.parentElement?.getBoundingClientRect();
        
        if (priceRect && activityRect) {
          priceCanvas.width = priceRect.width;
          priceCanvas.height = 150;
          
          activityCanvas.width = activityRect.width;
          activityCanvas.height = 150;
          
          if (data && !isLoading) {
            drawPriceChart();
            drawActivityChart();
          }
        }
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  });
  
  $: if (priceCanvas && activityCanvas && data && !isLoading) {
    drawPriceChart();
    drawActivityChart();
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-4">
    <div class="flex-1">
      <div class="text-sm font-medium mb-1">LP Pull Percentage</div>
      <div class="flex items-center gap-2">
        <Progress value={data?.lpPull || 0} max={100} class="h-4" />
        <span class="text-sm font-bold">{data?.lpPull || 0}%</span>
      </div>
    </div>
  </div>
  
  <div>
    <div class="text-sm font-medium mb-1">Price Impact</div>
    <div class="w-full h-[150px] relative">
      {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-full w-full bg-muted/50 animate-pulse rounded"></div>
        </div>
      {:else}
        <canvas bind:this={priceCanvas} class="w-full h-full"></canvas>
      {/if}
    </div>
  </div>
  
  <div>
    <div class="text-sm font-medium mb-1">Activity Drop</div>
    <div class="w-full h-[150px] relative">
      {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-full w-full bg-muted/50 animate-pulse rounded"></div>
        </div>
      {:else}
        <canvas bind:this={activityCanvas} class="w-full h-full"></canvas>
      {/if}
    </div>
  </div>
</div>