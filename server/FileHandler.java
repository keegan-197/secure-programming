import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import java.net.URI;
import java.net.URISyntaxException;

public class FileHandler implements HttpHandler
{
    public void handle(HttpExchange exchange) throws IOException
    {
        String requestMethod = exchange.getRequestMethod();

        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Filename");
            exchange.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("GET".equalsIgnoreCase(requestMethod)) 
        {
            handleGet(exchange);
        } 
        else if ("POST".equalsIgnoreCase(requestMethod)) 
        {
            try
            {
                handlePost(exchange);
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        } 
        else 
        {
            // Send 405 Method Not Allowed response
            String response = "Method not allowed";
            exchange.sendResponseHeaders(405, response.length());
            
            try (OutputStream os = exchange.getResponseBody()) 
            {
                os.write(response.getBytes());
            }

            System.out.println("Method not allowed");
        }
    }

    private void handleGet(HttpExchange exchange) throws IOException 
    {    
        String filePath = "." + exchange.getRequestURI().getPath();
        File file = new File(filePath);

        if (file.exists() && !file.isDirectory()) 
        {
            // Send the file
            exchange.getResponseHeaders().add("Content-Type", "application/octet-stream");
            exchange.sendResponseHeaders(200, file.length());

            try (
                OutputStream os = exchange.getResponseBody();
                FileInputStream fis = new FileInputStream(file)
                ) 
            {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) 
                {
                    os.write(buffer, 0, bytesRead);
                }
            }
            System.out.println("Sent file: " + filePath);
        } 
        else 
        {
            // Send 404 response
            String response = "File not found";
            exchange.sendResponseHeaders(404, response.length());
            try (OutputStream os = exchange.getResponseBody()) 
            {
                os.write(response.getBytes());
            }
            System.out.println("File not found: " + filePath);
        }
    }

    private void handlePost(HttpExchange exchange) throws IOException, URISyntaxException 
    {
        Map<String, List<String>> headers = exchange.getRequestHeaders();
        String filePath = new URI("./" + String.join(", ", headers.get("X-filename"))).getPath();
        System.out.println(filePath);
        File file = new File(filePath);

        try (InputStream is = exchange.getRequestBody();
            FileOutputStream fos = new FileOutputStream(file)) 
        {
            System.out.println("POST2");
            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = is.read(buffer)) != -1) 
            {
                fos.write(buffer, 0, bytesRead);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        String response = String.join(", ", headers.get("Host")) + "/" + filePath;

        JSONObject jo = new JSONObject();
        jo.put("file_url", response);
        response = jo.toString();
        jo.clear();
        jo.put("body", new JSONObject(response));
        response = jo.toString();

        exchange.sendResponseHeaders(200, response.length()); // 201 Created
        try (OutputStream os = exchange.getResponseBody()) 
        {
            os.write(response.getBytes());
        }
    }
}
