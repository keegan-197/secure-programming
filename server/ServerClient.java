import java.net.*;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.*;

/*

Group 8
Cheng Cao, Keegan Jackel, Malte Vollendorff, Po Yu Chen

*/

public class ServerClient extends Thread
{
    private static Vector<ServerObject> servers;
    String address;
    String public_key;
    static int server_port;


    ServerClient(String isa, String pk, Vector<ServerObject> s, int p)
    {
        this.address = isa;
        this.public_key = pk;
        servers = s;
        server_port = p;
    }

    static private class Listener extends Thread
    {
        private static Vector<ServerObject> servers;
        String address;
        WebSocketClient wsc;

        Listener(Vector<ServerObject> s, String a, WebSocketClient w)
        {
            servers = s;
            address = a;
            wsc = w;
        }

        @Override
        public void run()
        {
            Integer i = 0;
            while (true)
            {
                if (servers.elementAt(i).getAddress().equals(address))
                {
                    while (true)
                    {
                        if (servers.elementAt(i).newTask())
                        {
                            wsc.send(servers.elementAt(i).getTask());
                        }
                    }
                }

                i++;
                
                if (i > servers.size() - 1)
                {
                    i = 0;
                }
            }
        }
    }

    static private class Client extends WebSocketClient
    {
        private static Vector<ServerObject> servers;
        static int counter;
        String address;

        public Client(URI serverURI, String a, Vector<ServerObject> s) 
        {
            super(serverURI);
            counter = 1;
            address = a;
            servers = s;
        }

        void parseClientUpdate(JSONArray ja) throws UnknownHostException, JSONException
        {
            for (ServerObject server : servers)
            {
                if (server.getAddress().equals(address))
                {
                    for (int i = 0; i < ja.length(); i++)
                    {
                        server.addClient(ja.getString(i).toString(), null);
                    }
                }
                break;
            }
        }

        @Override
        public void onOpen(ServerHandshake handshakedata)
        {
            System.out.println("Connected to " + address);

            try
            {
                JSONObject temp = new JSONObject();
                JSONObject data = new JSONObject();

                data.put("type", "server_hello");
                data.put("sender", String.valueOf(InetAddress.getLocalHost()) + ":" + String.valueOf(server_port));
                String sign = data.toString() + String.valueOf(counter + 1);
                temp.put("data", data);
                temp.put("type", "signed_data");
                temp.put("counter", String.valueOf(counter + 1));
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hash = digest.digest(sign.getBytes(StandardCharsets.UTF_8));
                byte[] encoded = Base64.getEncoder().encode(hash);
                temp.put("signature", new String(encoded));
                send(temp.toString());

                temp.clear();

                temp.put("type", "client_update_request");
                send(temp.toString());

                servers.add(new ServerObject(address));
            }
            catch (Exception e)
            {
                System.out.println("Couldn't connect to " + address);
            }
        }

        // Only receives messages from other servers
        // No client_list_request, client_list, signed_data[server_hello], signed_data[hello]
        @Override
        public void onMessage(String message) {
            System.out.println("received: " + message);

            try
            {
                JSONObject mess = new JSONObject(message);
                JSONObject jo = new JSONObject();

                switch(String.valueOf(mess.get("type")))
                {
                case "signed_data":
                    for (ServerObject server : servers)
                    {
                        if (server.getServerConn() == null)
                        {
                            server.sendToAll(message);
                        }
                    }
                    break;
                case "client_update_request":
                    jo.put("type", "client_update");
                    
                    for (ServerObject server : servers)
                    {
                        if (server.getServerConn() == null)
                        {
                            jo.put("clients", server.clientJSON());
                        }
                    }

                    this.send(jo.toString());

                    break;
                case "client_update":
                    parseClientUpdate(mess.getJSONArray("clients"));
                    break;
                default:
                    // conn.close();
                }
            }
            catch (Exception e)
            {
                
            }
        }

        @Override
        public void onClose(int code, String reason, boolean remote) 
        {
            
        }

        @Override
        public void onError(Exception ex) 
        {
            
        }
    }

    @Override
    public void run()
    {
        try
        {
            WebSocketClient c = new Client(new URI(address), address, servers);
            Listener l = new Listener(servers, address, c);
            l.start();
            c.connect();
        }
        catch (Exception e)
        {
        }
    }
}
