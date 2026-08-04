# @pipeworx/kraken

[Kraken](https://docs.kraken.com/api/) MCP — keyless public market endpoints.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `server_time()` — server time
- `system_status()` — exchange status
- `assets(asset?, aclass?)` — asset info (BTC, ETH, …)
- `asset_pairs(pair?, info?)` — pair info (e.g. XXBTZUSD)
- `ticker(pair)` — current ticker
- `ohlc(pair, interval?, since?)` — OHLC candles
- `depth(pair, count?)` — orderbook
- `trades(pair, since?, count?)` — recent trades
- `spread(pair, since?)` — recent spread

## Data source

`https://api.kraken.com/0/public`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "kraken": {
      "url": "https://gateway.pipeworx.io/kraken/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Kraken data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
