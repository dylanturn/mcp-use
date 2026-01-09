/**
 * Tests for server configuration with duplicate URLs and independent naming.
 */

import { describe, expect, it } from "vitest";
import { BaseMCPClient } from "../../src/client/base.js";
import { BaseConnector } from "../../src/connectors/base.js";

// Create a minimal mock connector for testing
class MockConnector extends BaseConnector {
  async connect(): Promise<void> {}
  async close(): Promise<void> {}
  async sendMessage(_message: any): Promise<any> {
    return {};
  }
  async initialize(): Promise<void> {}
}

// Create a test client that extends BaseMCPClient
class TestMCPClient extends BaseMCPClient {
  protected createConnectorFromConfig(_serverConfig: Record<string, any>): BaseConnector {
    return new MockConnector();
  }
}

describe("Duplicate URLs and Independent Naming", () => {
  it("should allow multiple servers with the same URL", () => {
    const client = new TestMCPClient();

    // Add two servers with the same URL but different names
    client.addServer("server1", { url: "http://example.com/sse" });
    client.addServer("server2", { url: "http://example.com/sse" });

    // Verify both servers are in the config
    const servers = client.getServerNames();
    expect(servers).toContain("server1");
    expect(servers).toContain("server2");

    // Verify both have the same URL
    const config1 = client.getServerConfig("server1");
    const config2 = client.getServerConfig("server2");
    expect(config1.url).toBe(config2.url);
    expect(config1.url).toBe("http://example.com/sse");
  });

  it("should allow server names independent from URLs", () => {
    const client = new TestMCPClient();

    // Add server with custom name that doesn't match URL
    client.addServer("my_custom_name", { url: "http://totally-different.com" });

    // Verify the name is what we specified
    const servers = client.getServerNames();
    expect(servers).toContain("my_custom_name");

    // Verify the URL is stored correctly
    const config = client.getServerConfig("my_custom_name");
    expect(config.url).toBe("http://totally-different.com");
  });

  it("should support dict config with duplicate URLs", () => {
    const config = {
      mcpServers: {
        production: { url: "http://api.example.com" },
        staging: { url: "http://api.example.com" },
        backup: { url: "http://api.example.com" },
      },
    };

    const client = new TestMCPClient(config);

    const servers = client.getServerNames();
    expect(servers).toHaveLength(3);
    expect(servers).toContain("production");
    expect(servers).toContain("staging");
    expect(servers).toContain("backup");

    // All should have the same URL
    for (const name of servers) {
      const cfg = client.getServerConfig(name);
      expect(cfg.url).toBe("http://api.example.com");
    }
  });

  it("should support same URL with different auth", () => {
    const client = new TestMCPClient();

    client.addServer("admin", {
      url: "http://api.example.com",
      auth: "admin_token",
    });
    client.addServer("readonly", {
      url: "http://api.example.com",
      auth: "readonly_token",
    });

    const servers = client.getServerNames();
    expect(servers).toHaveLength(2);

    const adminConfig = client.getServerConfig("admin");
    const readonlyConfig = client.getServerConfig("readonly");

    // Same URL
    expect(adminConfig.url).toBe(readonlyConfig.url);

    // Different auth
    expect(adminConfig.auth).toBe("admin_token");
    expect(readonlyConfig.auth).toBe("readonly_token");
  });

  it("should support same URL with different headers", () => {
    const client = new TestMCPClient();

    client.addServer("json_api", {
      url: "http://api.example.com",
      headers: { "Content-Type": "application/json" },
    });
    client.addServer("xml_api", {
      url: "http://api.example.com",
      headers: { "Content-Type": "application/xml" },
    });

    const servers = client.getServerNames();
    expect(servers).toHaveLength(2);

    const jsonConfig = client.getServerConfig("json_api");
    const xmlConfig = client.getServerConfig("xml_api");

    // Same URL
    expect(jsonConfig.url).toBe(xmlConfig.url);

    // Different headers
    expect(jsonConfig.headers["Content-Type"]).toBe("application/json");
    expect(xmlConfig.headers["Content-Type"]).toBe("application/xml");
  });

  it("should support many servers with the same URL", () => {
    const client = new TestMCPClient();
    const url = "http://api.example.com";

    // Add 10 servers with the same URL
    for (let i = 0; i < 10; i++) {
      client.addServer(`server_${i}`, { url });
    }

    const servers = client.getServerNames();
    expect(servers).toHaveLength(10);

    // All should have the same URL
    for (const name of servers) {
      const config = client.getServerConfig(name);
      expect(config.url).toBe(url);
    }
  });

  it("should support descriptive names that don't match URLs", () => {
    const client = new TestMCPClient();

    client.addServer("github_integration", { url: "http://localhost:3001" });
    client.addServer("linear_integration", { url: "http://localhost:3002" });
    client.addServer("slack_notifications", { url: "http://localhost:3003" });

    const servers = client.getServerNames();

    // Names are descriptive, not URL-based
    expect(servers).toContain("github_integration");
    expect(servers).toContain("linear_integration");
    expect(servers).toContain("slack_notifications");

    // Each has its own URL
    expect(client.getServerConfig("github_integration").url).toBe("http://localhost:3001");
    expect(client.getServerConfig("linear_integration").url).toBe("http://localhost:3002");
    expect(client.getServerConfig("slack_notifications").url).toBe("http://localhost:3003");
  });
});
