interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Kraken MCP (public endpoints).
 */


const BASE = 'https://api.kraken.com/0/public';
const UA = 'pipeworx-mcp-kraken/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'server_time', description: 'Server time.', inputSchema: { type: 'object', properties: {} } },
  { name: 'system_status', description: 'Exchange status.', inputSchema: { type: 'object', properties: {} } },
  { name: 'assets', description: 'Asset info.', inputSchema: { type: 'object', properties: { asset: { type: 'string' }, aclass: { type: 'string' } } } },
  { name: 'asset_pairs', description: 'Pair info.', inputSchema: { type: 'object', properties: { pair: { type: 'string' }, info: { type: 'string' } } } },
  { name: 'ticker', description: 'Current ticker.', inputSchema: { type: 'object', properties: { pair: { type: 'string' } }, required: ['pair'] } },
  { name: 'ohlc', description: 'OHLC candles.', inputSchema: { type: 'object', properties: { pair: { type: 'string' }, interval: { type: 'number' }, since: { type: 'number' } }, required: ['pair'] } },
  { name: 'depth', description: 'Orderbook.', inputSchema: { type: 'object', properties: { pair: { type: 'string' }, count: { type: 'number' } }, required: ['pair'] } },
  { name: 'trades', description: 'Recent trades.', inputSchema: { type: 'object', properties: { pair: { type: 'string' }, since: { type: 'number' }, count: { type: 'number' } }, required: ['pair'] } },
  { name: 'spread', description: 'Recent spread.', inputSchema: { type: 'object', properties: { pair: { type: 'string' }, since: { type: 'number' } }, required: ['pair'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) p.set(k, String(v));
    const url = `${BASE}${path}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Kraken: ${res.status}`);
    const j = (await res.json()) as { error?: string[]; result?: unknown };
    if (j.error && j.error.length) throw new Error(`Kraken: ${j.error.join('; ')}`);
    return j.result;
  };
  const pick = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, args[k]]));
  switch (name) {
    case 'server_time':
      return get('/Time');
    case 'system_status':
      return get('/SystemStatus');
    case 'assets':
      return get('/Assets', pick(['asset', 'aclass']));
    case 'asset_pairs':
      return get('/AssetPairs', pick(['pair', 'info']));
    case 'ticker':
      return get('/Ticker', pick(['pair']));
    case 'ohlc':
      return get('/OHLC', pick(['pair', 'interval', 'since']));
    case 'depth':
      return get('/Depth', pick(['pair', 'count']));
    case 'trades':
      return get('/Trades', pick(['pair', 'since', 'count']));
    case 'spread':
      return get('/Spread', pick(['pair', 'since']));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
