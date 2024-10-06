// import java.io.*;
import java.net.*;
import org.java_websocket.WebSocket;
// import java.util.concurrent.ConcurrentHashMap;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.*;

/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

public class Connection extends Thread
{
	private static Vector<ServerObject> servers;

	WebSocket conn;
	String message;

	Connection(WebSocket conn, String message, Vector<ServerObject> server)
	{
		this.conn = conn;
		this.message = message;
		servers = server;
	}

	void signed_data(JSONObject jo) throws UnknownHostException
	{
		JSONObject data = new JSONObject(String.valueOf(jo.get("data")));
		JSONObject response = new JSONObject();
		JSONArray ja = new JSONArray();

		switch(String.valueOf(data.get("type")))
		{
		case "hello":		
			for (ServerObject server : servers)
			{
				if (server.getServerConn() == null)
				{
					server.addClient(data.get("public_key").toString(), conn);
				}

				ja.put(server.serverJSON());
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

			break;

		case "chat":
			ja = data.getJSONArray("destination_servers");
			
			for (ServerObject server : servers)
			{
				for (int i = 0; i < ja.length(); i++)
				{
					System.out.println("Inner:" + ja.get(i));

					if (server.getServerAddress().equals(ja.get(i)))
					{
						server.sendToAll(message);
						ja.remove(i);
					}
				}
			}
			break;
		
		case "public_chat":
			for (ServerObject server : servers)
			{
				if (server.getServerConn() == null)
				{
					server.sendToAll(message);
				}
				else
				{
					server.sendToServer(message);
				}
			}
			break;
		case "server_hello":
			servers.add(new ServerObject("", conn));
			response.put("type", "client_update_request");
			conn.send(response.toString());
		default:
			// conn.close();
		}
	}

	void client_list_request() throws UnknownHostException
	{
		JSONObject response = new JSONObject();
		JSONArray ja = new JSONArray();

		for (ServerObject server : servers)
		{
			ja.put(server.serverJSON());
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
	}

	void parseClientUpdate(JSONArray ja) throws UnknownHostException, JSONException
	{
		// JSONArray temp;
		// for (int i = 0; i < ja.length(); i++)
		// {
		// 	for (ServerObject server : servers)
		// 	{
		// 		if (server.getServerAddress() == ja.getJSONObject(i).get("address"))
		// 		{
		// 			temp = ja.getJSONObject(i).getJSONArray("clients");
		// 			for (int j = 0; j < temp.length(); j++)
		// 			{
		// 				server.addClient(temp.getString(j).toString(), null);
		// 			}
		// 		}
		// 	}
		// }
		for (ServerObject server : servers)
            {
                if (server.getServerConn() == conn)
                {
                    for (int i = 0; i < ja.length(); i++)
                    {
                        server.addClient(ja.getString(i).toString(), null);
                    }
					break;
                }
            }
	}

	@Override
	public void run()
	{
		try
		{
			JSONObject jo = new JSONObject(message);
			JSONArray ja = new JSONArray();

			// client_list is only sent
			switch(String.valueOf(jo.get("type")))
			{
			case "signed_data":
				signed_data(jo);
				break;
			case "client_list_request":
				client_list_request();
				break;
			case "client_update":
				System.out.println("client_update");
				parseClientUpdate(jo.getJSONArray("clients"));
				break;
			case "client_update_request":
				System.out.println("client_update_request");
				jo.put("type", "client_update");
				
				for (ServerObject server : servers)
				{
					if (server.getServerConn() == null)
					{
						jo.put("clients", server.clientJSON());
						server.sendToServer(jo.toString());
					}
				}
				conn.send(jo.toString());
				
			default:
				// conn.close();
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}