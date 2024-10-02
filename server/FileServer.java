import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

public class FileServer extends Thread
{
    static InetSocketAddress isa;

	FileServer(InetSocketAddress in)
    {
        isa = in;
    }

    @Override
    public void run() 
    {
        System.out.println("TEST");
        try
        {
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
            server.createContext("/", new FileHandler());
            server.setExecutor(null);
            System.out.println("File server started at http://localhost:8080");
            server.start();
        }
        catch (Exception e)
        {

        }
    }
}