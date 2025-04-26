// Mock API service for dashboard data

// Transaction flow data (wallet-to-wallet transfers)
export async function fetchTransactionFlowData() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      nodes: [
        { id: 'wallet1', label: 'Wallet 1', size: 20, color: '#82e0aa' },
        { id: 'wallet2', label: 'Wallet 2', size: 15, color: '#82e0aa' },
        { id: 'wallet3', label: 'Wallet 3', size: 25, color: '#f5cba7' },
        { id: 'wallet4', label: 'Wallet 4', size: 10, color: '#82e0aa' },
        { id: 'wallet5', label: 'Wallet 5', size: 18, color: '#f5cba7' },
        { id: 'wallet6', label: 'Wallet 6', size: 12, color: '#82e0aa' },
        { id: 'wallet7', label: 'Wallet 7', size: 22, color: '#f5cba7' },
        { id: 'exchange1', label: 'Exchange 1', size: 30, color: '#aed6f1' },
        { id: 'exchange2', label: 'Exchange 2', size: 28, color: '#aed6f1' },
      ],
      links: [
        { source: 'wallet1', target: 'wallet3', value: 5 },
        { source: 'wallet1', target: 'wallet2', value: 3 },
        { source: 'wallet2', target: 'wallet4', value: 2 },
        { source: 'wallet3', target: 'wallet5', value: 7 },
        { source: 'wallet3', target: 'exchange1', value: 10 },
        { source: 'wallet4', target: 'wallet6', value: 1 },
        { source: 'wallet5', target: 'exchange2', value: 8 },
        { source: 'wallet6', target: 'wallet7', value: 4 },
        { source: 'wallet7', target: 'exchange2', value: 6 },
      ]
    };
  }
  
  // Anomaly detection data
  export async function fetchAnomalyData() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      dates: [
        '2023-04-01', '2023-04-02', '2023-04-03', '2023-04-04', 
        '2023-04-05', '2023-04-06', '2023-04-07', '2023-04-08',
        '2023-04-09', '2023-04-10', '2023-04-11', '2023-04-12',
        '2023-04-13', '2023-04-14'
      ],
      values: [
        120, 125, 130, 220, 190, 185, 250, 280, 275, 190, 350, 320, 310, 290
      ],
      anomalies: [
        { date: '2023-04-04', value: 220, type: 'spike', percentage: 69.2 },
        { date: '2023-04-11', value: 350, type: 'spike', percentage: 84.2 },
      ]
    };
  }
  
  // Ownership concentration data
  export async function fetchOwnershipData() {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      { id: 'wallet1', label: 'Whale 1', value: 25.3 },
      { id: 'wallet2', label: 'Whale 2', value: 18.7 },
      { id: 'wallet3', label: 'Whale 3', value: 12.4 },
      { id: 'wallet4', label: 'Whale 4', value: 8.9 },
      { id: 'wallet5', label: 'Whale 5', value: 6.2 },
      { id: 'wallet6', label: 'Whale 6', value: 4.8 },
      { id: 'wallet7', label: 'Whale 7', value: 3.5 },
      { id: 'wallet8', label: 'Whale 8', value: 2.9 },
      { id: 'wallet9', label: 'Whale 9', value: 2.1 },
      { id: 'wallet10', label: 'Whale 10', value: 1.8 },
      { id: 'others', label: 'Others', value: 13.4 }
    ];
  }
  
  // Sell-off pattern data
  export async function fetchSellOffData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      dates: [
        '2023-04-01', '2023-04-02', '2023-04-03', '2023-04-04', 
        '2023-04-05', '2023-04-06', '2023-04-07'
      ],
      wallets: [
        {
          id: 'wallet1',
          label: 'Whale 1',
          balances: [1000000, 1000000, 950000, 800000, 500000, 200000, 0]
        },
        {
          id: 'wallet2',
          label: 'Whale 2',
          balances: [800000, 800000, 800000, 750000, 600000, 300000, 100000]
        },
        {
          id: 'wallet3',
          label: 'Whale 3',
          balances: [600000, 600000, 600000, 600000, 550000, 400000, 200000]
        },
        {
          id: 'wallet4',
          label: 'Whale 4',
          balances: [400000, 400000, 400000, 400000, 400000, 350000, 300000]
        }
      ]
    };
  }
  
  // Volume bracket distribution data
  export async function fetchVolumeBracketData() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      { bracket: '$0-$100', count: 1245 },
      { bracket: '$100-$500', count: 842 },
      { bracket: '$500-$1K', count: 433 },
      { bracket: '$1K-$5K', count: 287 },
      { bracket: '$5K-$10K', count: 126 },
      { bracket: '$10K-$50K', count: 64 },
      { bracket: '$50K-$100K', count: 28 },
      { bracket: '$100K+', count: 12 }
    ];
  }
  
  // Bot volume detection data
  export async function fetchBotVolumeData() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      { type: 'Bot Transactions', value: 42.7 },
      { type: 'Organic Transactions', value: 57.3 }
    ];
  }
  
  // Post-rug indicators data
  export async function fetchPostRugData() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      lpPull: 87.5, // percentage of LP pulled
      priceData: {
        dates: [
          '2023-04-01', '2023-04-02', '2023-04-03', '2023-04-04', 
          '2023-04-05', '2023-04-06', '2023-04-07'
        ],
        prices: [0.00012, 0.00011, 0.00010, 0.000095, 0.000025, 0.0000032, 0.0000008],
        rugEvent: '2023-04-05' // date of the rug pull
      },
      activityData: {
        dates: [
          '2023-04-01', '2023-04-02', '2023-04-03', '2023-04-04', 
          '2023-04-05', '2023-04-06', '2023-04-07'
        ],
        transactions: [1245, 1322, 1187, 1402, 1523, 245, 32],
        rugEvent: '2023-04-05' // date of the rug pull
      }
    };
  }
  
  // Wallet clustering data
  export async function fetchWalletClusteringData() {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      nodes: [
        { id: 'cluster1', label: 'Cluster 1', size: 25, color: '#82e0aa', type: 'cluster' },
        { id: 'cluster2', label: 'Cluster 2', size: 20, color: '#f5cba7', type: 'cluster' },
        { id: 'cluster3', label: 'Cluster 3', size: 15, color: '#aed6f1', type: 'cluster' },
        { id: 'wallet1', label: 'Wallet 1', size: 10, color: '#82e0aa', type: 'wallet', cluster: 'cluster1' },
        { id: 'wallet2', label: 'Wallet 2', size: 10, color: '#82e0aa', type: 'wallet', cluster: 'cluster1' },
        { id: 'wallet3', label: 'Wallet 3', size: 10, color: '#82e0aa', type: 'wallet', cluster: 'cluster1' },
        { id: 'wallet4', label: 'Wallet 4', size: 10, color: '#f5cba7', type: 'wallet', cluster: 'cluster2' },
        { id: 'wallet5', label: 'Wallet 5', size: 10, color: '#f5cba7', type: 'wallet', cluster: 'cluster2' },
        { id: 'wallet6', label: 'Wallet 6', size: 10, color: '#aed6f1', type: 'wallet', cluster: 'cluster3' },
        { id: 'wallet7', label: 'Wallet 7', size: 10, color: '#aed6f1', type: 'wallet', cluster: 'cluster3' },
      ],
      links: [
        { source: 'wallet1', target: 'cluster1', value: 1 },
        { source: 'wallet2', target: 'cluster1', value: 1 },
        { source: 'wallet3', target: 'cluster1', value: 1 },
        { source: 'wallet4', target: 'cluster2', value: 1 },
        { source: 'wallet5', target: 'cluster2', value: 1 },
        { source: 'wallet6', target: 'cluster3', value: 1 },
        { source: 'wallet7', target: 'cluster3', value: 1 },
        { source: 'wallet1', target: 'wallet2', value: 3 },
        { source: 'wallet2', target: 'wallet3', value: 2 },
        { source: 'wallet4', target: 'wallet5', value: 4 },
        { source: 'wallet6', target: 'wallet7', value: 1 },
        { source: 'cluster1', target: 'cluster2', value: 5 },
        { source: 'cluster2', target: 'cluster3', value: 3 },
      ],
      timeline: [
        { time: '2023-04-01 08:23', wallet: 'wallet1', action: 'buy', amount: 50000 },
        { time: '2023-04-01 09:45', wallet: 'wallet2', action: 'buy', amount: 75000 },
        { time: '2023-04-01 12:12', wallet: 'wallet4', action: 'buy', amount: 120000 },
        { time: '2023-04-02 14:30', wallet: 'wallet1', action: 'transfer', target: 'wallet3', amount: 25000 },
        { time: '2023-04-02 15:22', wallet: 'wallet4', action: 'transfer', target: 'wallet5', amount: 60000 },
        { time: '2023-04-03 10:15', wallet: 'wallet6', action: 'buy', amount: 90000 },
        { time: '2023-04-03 11:45', wallet: 'wallet7', action: 'buy', amount: 45000 },
        { time: '2023-04-04 09:30', wallet: 'wallet3', action: 'sell', amount: 15000 },
        { time: '2023-04-04 16:20', wallet: 'wallet5', action: 'sell', amount: 30000 },
      ]
    };
  }
  
  // Dashboard summary data
  export async function fetchDashboardSummary() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalTransactions: 1234,
      transactionsChange: 12.5,
      activeWallets: 567,
      walletsChange: 8.3,
      suspiciousActivity: 89,
      suspiciousChange: -5.2,
      botPercentage: 42.7,
      whaleConcentration: 84.7,
      anomalyCount: 5
    };
  }