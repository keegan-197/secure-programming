import java.net.*;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.java_websocket.WebSocket;
import org.java_websocket.WebSocketImpl;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;

/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

public class Server extends WebSocketServer
{
	private static Vector<ServerObject> servers = new Vector<ServerObject>();

	public Server(InetSocketAddress address)
	{
		super(address);
	}

	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) 
	{
		System.out.println("new connection to " + conn);
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) 
	{
		System.out.println("lost connection to " + conn);

		JSONObject response = new JSONObject();
		JSONArray ja = new JSONArray();

		for (ServerObject server : servers)
		{
			if (server.getServerConn() == null)
			{
				server.removeClient(conn);
			}
		}

		for (ServerObject server : servers)
		{
			try 
			{
				ja.put(server.serverJSON());
			} 
			catch (Exception e) 
			{
				e.printStackTrace();
			}
		}

		response.put("servers", ja);

		response.put("type", "client_list");

		for (ServerObject server : servers)
		{
			if (server.getServerConn() == null)
			{
				server.sendToAll(response.toString());
			}
		}

		JSONObject jo = new JSONObject();
		jo.put("type", "client_update");
		
		for (ServerObject server : servers)
		{
			if (server.getServerConn() == null)
			{
				jo.put("clients", server.clientJSON());
				server.sendToServer(jo.toString());
			}
		}
	}

	@Override
	public void onMessage(WebSocket conn, String message) 
	{
		new Connection(conn, message, servers).start();	
	}

	@Override
	public void onMessage(WebSocket conn, ByteBuffer message ) 
	{
	
	}

	@Override
	public void onError(WebSocket conn, Exception ex) 
	{
		System.err.println("An error occurred:" + ex);
		// this.stop();
	}
	
	@Override
	public void onStart() 
	{
		System.out.println("Server started successfully");
	}

	public static void main(String[] args) throws IOException
	{
		servers.add(new ServerObject("TODO", Integer.parseInt(args[0])));
		InetSocketAddress isa = new InetSocketAddress("localhost", Integer.parseInt(args[0]));

		String content = Files.readString(Paths.get("server/servers.json").toAbsolutePath());
		String temp = "ws://localhost:" + Integer.parseInt(args[0]);
		System.out.println(temp);

		JSONArray ja = new JSONArray(content);
		JSONObject jo;

		for (int i = 0; i < ja.length(); i++)
		{
			jo = ja.getJSONObject(i);
			if (temp.equals(jo.get("address").toString()))
			{
				System.out.println(jo.get("address").toString());
			}
			else
			{
				new ServerClient(jo.get("address").toString(), jo.get("public_key").toString(), servers, Integer.parseInt(args[0])).start();
			}
		}

		System.out.println(ja);

		WebSocketServer server = new Server(isa);
		FileServer fs = new FileServer();
		fs.start();
		server.run();
	}
}