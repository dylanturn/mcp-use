"""
Tests for server configuration with duplicate URLs and independent naming.
"""

import pytest

from mcp_use import MCPClient


class TestDuplicateURLs:
    """Test that servers can have duplicate URLs with different names."""

    def test_add_multiple_servers_same_url(self):
        """Test adding multiple servers with the same URL."""
        client = MCPClient()
        
        # Add two servers with the same URL but different names
        client.add_server("server1", {"url": "http://example.com/sse"})
        client.add_server("server2", {"url": "http://example.com/sse"})
        
        # Verify both servers are in the config
        servers = client.get_server_names()
        assert "server1" in servers
        assert "server2" in servers
        
        # Verify both have the same URL
        config1 = client.config["mcpServers"]["server1"]
        config2 = client.config["mcpServers"]["server2"]
        assert config1["url"] == config2["url"]
        assert config1["url"] == "http://example.com/sse"

    def test_independent_naming(self):
        """Test that server names are independent from URLs."""
        client = MCPClient()
        
        # Add server with custom name that doesn't match URL
        client.add_server("my_custom_name", {"url": "http://totally-different.com"})
        
        # Verify the name is what we specified
        servers = client.get_server_names()
        assert "my_custom_name" in servers
        
        # Verify the URL is stored correctly
        config = client.config["mcpServers"]["my_custom_name"]
        assert config["url"] == "http://totally-different.com"

    def test_dict_config_with_duplicate_urls(self):
        """Test creating client with dict config that has duplicate URLs."""
        config = {
            "mcpServers": {
                "production": {"url": "http://api.example.com"},
                "staging": {"url": "http://api.example.com"},
                "backup": {"url": "http://api.example.com"}
            }
        }
        
        client = MCPClient.from_dict(config)
        
        servers = client.get_server_names()
        assert len(servers) == 3
        assert "production" in servers
        assert "staging" in servers
        assert "backup" in servers
        
        # All should have the same URL
        for name in servers:
            assert client.config["mcpServers"][name]["url"] == "http://api.example.com"

    def test_same_url_different_auth(self):
        """Test multiple servers with same URL but different auth."""
        client = MCPClient()
        
        client.add_server("admin", {
            "url": "http://api.example.com",
            "auth": "admin_token"
        })
        client.add_server("readonly", {
            "url": "http://api.example.com",
            "auth": "readonly_token"
        })
        
        servers = client.get_server_names()
        assert len(servers) == 2
        
        admin_config = client.config["mcpServers"]["admin"]
        readonly_config = client.config["mcpServers"]["readonly"]
        
        # Same URL
        assert admin_config["url"] == readonly_config["url"]
        
        # Different auth
        assert admin_config["auth"] == "admin_token"
        assert readonly_config["auth"] == "readonly_token"

    def test_same_url_different_headers(self):
        """Test multiple servers with same URL but different headers."""
        client = MCPClient()
        
        client.add_server("json_api", {
            "url": "http://api.example.com",
            "headers": {"Content-Type": "application/json"}
        })
        client.add_server("xml_api", {
            "url": "http://api.example.com",
            "headers": {"Content-Type": "application/xml"}
        })
        
        servers = client.get_server_names()
        assert len(servers) == 2
        
        json_config = client.config["mcpServers"]["json_api"]
        xml_config = client.config["mcpServers"]["xml_api"]
        
        # Same URL
        assert json_config["url"] == xml_config["url"]
        
        # Different headers
        assert json_config["headers"]["Content-Type"] == "application/json"
        assert xml_config["headers"]["Content-Type"] == "application/xml"

    def test_many_servers_same_url(self):
        """Test adding many servers with the same URL."""
        client = MCPClient()
        url = "http://api.example.com"
        
        # Add 10 servers with the same URL
        for i in range(10):
            client.add_server(f"server_{i}", {"url": url})
        
        servers = client.get_server_names()
        assert len(servers) == 10
        
        # All should have the same URL
        for name in servers:
            assert client.config["mcpServers"][name]["url"] == url

    def test_descriptive_names(self):
        """Test using descriptive names that don't match URLs."""
        client = MCPClient()
        
        client.add_server("github_integration", {"url": "http://localhost:3001"})
        client.add_server("linear_integration", {"url": "http://localhost:3002"})
        client.add_server("slack_notifications", {"url": "http://localhost:3003"})
        
        servers = client.get_server_names()
        
        # Names are descriptive, not URL-based
        assert "github_integration" in servers
        assert "linear_integration" in servers
        assert "slack_notifications" in servers
        
        # Each has its own URL
        assert client.config["mcpServers"]["github_integration"]["url"] == "http://localhost:3001"
        assert client.config["mcpServers"]["linear_integration"]["url"] == "http://localhost:3002"
        assert client.config["mcpServers"]["slack_notifications"]["url"] == "http://localhost:3003"
