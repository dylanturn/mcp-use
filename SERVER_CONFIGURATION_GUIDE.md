# Server Configuration Guide

## Defining Servers with Custom Names

In mcp-use, server names are completely independent from their URLs. This gives you flexibility to:

1. **Use descriptive names** that don't match the URL
2. **Connect to the same URL multiple times** with different configurations or contexts
3. **Organize servers logically** by environment or purpose

## Python Examples

### Basic Server Definition

```python
from mcp_use import MCPClient

client = MCPClient()

# The name "my_server" is independent from the URL
client.add_server("my_server", {"url": "http://api.example.com/sse"})
```

### Multiple Servers with Duplicate URLs

You can define multiple servers pointing to the same URL with different names:

```python
from mcp_use import MCPClient

client = MCPClient()

# All three servers point to the same URL but have different names
client.add_server("production", {"url": "http://api.example.com/sse"})
client.add_server("staging", {"url": "http://api.example.com/sse"})
client.add_server("backup", {"url": "http://api.example.com/sse"})

# Each server can be accessed independently
prod_session = client.get_session("production")
staging_session = client.get_session("staging")
```

### Using Dict Configuration

```python
from mcp_use import MCPClient

config = {
    "mcpServers": {
        # Descriptive names, independent from URLs
        "github_api": {
            "url": "http://github-server.example.com"
        },
        "linear_api": {
            "url": "http://linear-server.example.com"
        },
        # Same URL, different contexts
        "filesystem_readonly": {
            "url": "http://localhost:3000/sse",
            "auth": "readonly_token"
        },
        "filesystem_admin": {
            "url": "http://localhost:3000/sse",
            "auth": "admin_token"
        }
    }
}

client = MCPClient.from_dict(config)
```

## TypeScript Examples

### Basic Server Definition

```typescript
import { MCPClient } from "mcp-use";

const client = new MCPClient();

// The name "my_server" is independent from the URL
client.addServer("my_server", { url: "http://api.example.com/sse" });
```

### Multiple Servers with Duplicate URLs

```typescript
import { MCPClient } from "mcp-use";

const client = new MCPClient();

// All three servers point to the same URL but have different names
client.addServer("production", { url: "http://api.example.com/sse" });
client.addServer("staging", { url: "http://api.example.com/sse" });
client.addServer("backup", { url: "http://api.example.com/sse" });

// Create sessions for each
await client.createSession("production");
await client.createSession("staging");

// Access them independently
const prodSession = client.getSession("production");
const stagingSession = client.getSession("staging");
```

### Using Dict Configuration

```typescript
import { MCPClient } from "mcp-use";

const config = {
  mcpServers: {
    // Descriptive names, independent from URLs
    github_api: {
      url: "http://github-server.example.com"
    },
    linear_api: {
      url: "http://linear-server.example.com"
    },
    // Same URL, different contexts
    filesystem_readonly: {
      url: "http://localhost:3000/sse",
      auth: "readonly_token"
    },
    filesystem_admin: {
      url: "http://localhost:3000/sse",
      auth: "admin_token"
    }
  }
};

const client = MCPClient.fromDict(config);
```

## Use Cases for Duplicate URLs

### 1. Different Authentication Contexts

Connect to the same server with different authentication tokens:

```python
client.add_server("admin_access", {
    "url": "http://api.example.com",
    "auth": "admin_token_xyz"
})

client.add_server("readonly_access", {
    "url": "http://api.example.com",
    "auth": "readonly_token_abc"
})
```

### 2. Environment-Based Configuration

Use the same server configuration across different environments:

```python
client.add_server("production_db", {"url": "http://db.example.com"})
client.add_server("staging_db", {"url": "http://db.example.com"})
client.add_server("development_db", {"url": "http://db.example.com"})
```

### 3. Different Header Configurations

Connect to the same endpoint with different headers:

```python
client.add_server("json_api", {
    "url": "http://api.example.com",
    "headers": {"Content-Type": "application/json"}
})

client.add_server("xml_api", {
    "url": "http://api.example.com",
    "headers": {"Content-Type": "application/xml"}
})
```

## Key Points

- ✅ **Server names are user-defined** and can be any string
- ✅ **Names are independent from URLs** - they don't need to match
- ✅ **Duplicate URLs are fully supported** - multiple servers can point to the same URL
- ✅ **Each server config can have unique properties** (auth, headers, etc.)
- ✅ **Sessions are created per server name** - each name gets its own session

## API Reference

### Python

```python
# Add a server
client.add_server(name: str, server_config: dict)

# Get server names
names = client.get_server_names()  # Returns list of strings

# Get a session
session = client.get_session(server_name: str)
```

### TypeScript

```typescript
// Add a server
client.addServer(name: string, serverConfig: Record<string, any>)

// Get server names
const names = client.getServerNames()  // Returns string[]

// Get a session
const session = client.getSession(serverName: string)
```
