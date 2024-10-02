import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

public class FileServer extends Thread
{
	FileServer()
    {

    }

    @Override
    public void run() 
    {
        try
        {
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
            server.createContext("/", new FileHandler());
            server.setExecutor(null);
            System.out.println("File server started at http://localhost:45");
            server.start();
        }
        catch (Exception e)
        {

        }
    }
}