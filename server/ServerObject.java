import org.java_websocket.WebSocket;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.LinkedList;
import org.json.JSONObject;
import java.net.*;

public class ServerObject
{
	private String public_key;
	private WebSocket conn;
	private Integer port;
	private Boolean client = false;
	private LinkedList<String> tasks = new LinkedList<String>();
	private String address;

	private HashMap<String, WebSocket> clients = new HashMap<String, WebSocket>();

	// For connected servers
	ServerObject(String key, WebSocket conn)
	{
		this.public_key = key;
		this.conn = conn;
		this.port = null;
	}

	// For localhost:port
	ServerObject(String key, Integer port)
	{
		this.public_key = key;
		this.conn = null;
		this.port = port;
	}

	ServerObject(String a)
	{
		this.conn = null;
		this.port = null;
		this.address = a;
	}

	WebSocket getServerConn()
	{
		return conn;
	}

	void addClient(String key, WebSocket conn)
	{
		clients.putIfAbsent(key, conn);
	}

	void removeClient(WebSocket conn)
	{
		for (Map.Entry<String, WebSocket> client : clients.entrySet())
		{
			if (conn == client.getValue())
			{
				clients.remove(client.getKey());
				return;
			}
		}
	}

	void sendToAll(String message)
	{
		for (WebSocket ws : clients.values())
		{
			ws.send(message);
		}
	}

	String getServerAddress() throws UnknownHostException
	{
		if (conn != null)
		{
			return String.valueOf(conn.getRemoteSocketAddress());
		}
		else if(client)
		{
			return address;
		}
		else
		{
			return String.valueOf(InetAddress.getLocalHost()) + ":" + String.valueOf(port);
		}
	}

	List<String> clientJSON()
	{
		// JSONArray ja = new JSONArray();
		List<String> list = new ArrayList<>();

		for (String s : clients.keySet())
		{
			list.add(s);
		}

		return list;
	}

	JSONObject serverJSON() throws UnknownHostException
	{
		JSONObject jo = new JSONObject();

		jo.put("clients", clientJSON());
		jo.put("address", getServerAddress());

		return jo;
	}

	void sendToServer(String message)
	{
		if ((conn != null) && !client)
		{
			conn.send(message);
		}
		else if (client)
		{
			tasks.add(message);
		}
	}

	String getAddress()
	{
		if (address == null)
		{
			return "null";
		}

		return address;
	}

	Boolean newTask()
	{
		return tasks.peekFirst() != null;
	}

	String getTask()
	{
		return tasks.removeFirst();
	}
}