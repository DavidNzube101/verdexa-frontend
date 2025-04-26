<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: {
    dates: string[],
    wallets: Array<{
      id: string,
      label: string,
      balances: number[]
    }>
  } | null = null;
  export let isLoading: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  
  const colors = [
    '#82e0aa', // primary
    '#f5cba7', // secondary
    '#aed6f1',
    '#f9e79f'
  ];
  
  function drawChart() {
    if (!canvas || !data || isLoading) return;
    
    ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.dates.length === 0 || data.wallets.length === 0) return;
    
    // Find max balance value
    const allBalances = data.wallets.flatMap(wallet => wallet.balances);
    const maxBalance = Math.max(...allBalances);
    
    // Calculate scales
    const xScale = width / (data.dates.length - 1);
    const yScale = (height - 40) / maxBalance; // Leave space for labels
    
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
      ctx.fillText(formatNumber(i * maxBalance / 5), 5, y - 5);
    }
    ctx.setLineDash([]);
    
    // Draw lines for each wallet
    data.wallets.forEach((wallet, walletIndex) => {
      const color = colors[walletIndex % colors.length];
      
      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      wallet.balances.forEach((balance, i) => {
        const x = i * xScale;
        const y = height - 20 - (balance * yScale);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw points
      wallet.balances.forEach((balance, i) => {
        const x = i * xScale;
        const y = height - 20 - (balance * yScale);
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
    
    // Draw x-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    data.dates.forEach((date, i) => {
      if (i % Math.ceil(data.dates.length / 7) === 0 || i === data.dates.length - 1) {
        const x = i * xScale;
        const dateObj = new Date(date);
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.fillText(label, x, height - 5);
      }
    });
    
    // Draw legend
    const legendX = 10;
    let legendY = 20;
    
    data.wallets.forEach((wallet, index) => {
      const color = colors[index % colors.length];
      
      // Draw color line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 15, legendY);
      ctx.stroke();
      
      // Draw point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(legendX + 7.5, legendY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(wallet.label, legendX + 20, legendY);
      
      legendY += 15;
    });
  }
  
  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
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