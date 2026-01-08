# UI Usage Example: Adding Servers with Custom Names

## Before This Change
When adding a new server in the Inspector UI, you could only specify the URL. The server name would automatically be set to the URL.

## After This Change
You can now specify a custom name for your server!

## Step-by-Step Example

### 1. Open the MCP Inspector
Navigate to the Inspector UI at `http://localhost:3000/inspector` (or your server URL).

### 2. Add a New Server
You'll see a connection form with these fields:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Server Name (optional)                         │
│  ┌───────────────────────────────────────────┐  │
│  │ my-production-api                         │  │
│  └───────────────────────────────────────────┘  │
│  A custom name to identify this server.         │
│  If not provided, URL will be used.             │
│                                                 │
│  URL                                            │
│  ┌───────────────────────────────────────────┐  │
│  │ http://api.example.com/sse                │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Connection Type                                │
│  ...                                            │
│                                                 │
│  [ Connect ]                                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3. Fill in the Form

**Example 1: Production API**
- Server Name: `my-production-api`
- URL: `http://api.example.com/sse`

**Example 2: Staging API (same URL as production)**
- Server Name: `my-staging-api`
- URL: `http://api.example.com/sse` ← Same URL!

**Example 3: No custom name (uses URL)**
- Server Name: _(leave empty)_
- URL: `http://localhost:3000/sse`
- Result: Server will be named `http://localhost:3000/sse`

### 4. View Your Servers
After connecting, you'll see your servers listed with their custom names:

```
Connected Servers:
  ✓ my-production-api (http://api.example.com/sse)
  ✓ my-staging-api (http://api.example.com/sse)
  ✓ http://localhost:3000/sse
```

## Use Cases

### Different Authentication
Connect to the same API with different access levels:
- **Name**: `admin-access` → **URL**: `http://api.example.com/sse` + Admin Token
- **Name**: `readonly-access` → **URL**: `http://api.example.com/sse` + Read-Only Token

### Environment Separation
Connect to different environments of the same service:
- **Name**: `production-db`
- **Name**: `staging-db`
- **Name**: `development-db`
All pointing to: `http://database-api.example.com/sse`

### Service Integration
Organize by service purpose:
- **Name**: `github-integration`
- **Name**: `linear-integration`
- **Name**: `slack-notifications`

## Programmatic Usage

You can also use this feature programmatically:

### Python
```python
from mcp_use import MCPClient

client = MCPClient()

# Add servers with custom names
client.add_server("my-production-api", {
    "url": "http://api.example.com/sse",
    "auth": "prod_token_xyz"
})

client.add_server("my-staging-api", {
    "url": "http://api.example.com/sse",  # Same URL!
    "auth": "staging_token_abc"
})

# Create sessions
await client.create_session("my-production-api")
await client.create_session("my-staging-api")

# Access sessions by name
prod_session = client.get_session("my-production-api")
staging_session = client.get_session("my-staging-api")
```

### TypeScript
```typescript
import { MCPClient } from "mcp-use";

const client = new MCPClient();

// Add servers with custom names
client.addServer("my-production-api", {
  url: "http://api.example.com/sse",
  auth: "prod_token_xyz"
});

client.addServer("my-staging-api", {
  url: "http://api.example.com/sse",  // Same URL!
  auth: "staging_token_abc"
});

// Create sessions
await client.createSession("my-production-api");
await client.createSession("my-staging-api");

// Access sessions by name
const prodSession = client.getSession("my-production-api");
const stagingSession = client.getSession("my-staging-api");
```

## Benefits

1. **Clear Organization**: Use descriptive names instead of URLs
2. **Multiple Contexts**: Connect to the same URL with different configurations
3. **Better UX**: Easier to identify servers in the UI
4. **Backward Compatible**: If you don't provide a name, it works as before
5. **Flexible**: Names are completely independent from URLs

## Tips

- Use descriptive names like `github-integration` instead of URLs
- For environment separation, use names like `production`, `staging`, `development`
- For different access levels, use names like `admin`, `readonly`, `guest`
- Leave the name field empty if you want to use the URL as the name

## See Also

- [Server Configuration Guide](../SERVER_CONFIGURATION_GUIDE.md) - Comprehensive examples
- [Python README](../libraries/python/README.md) - Python-specific documentation
- [TypeScript README](../libraries/typescript/README.md) - TypeScript-specific documentation
