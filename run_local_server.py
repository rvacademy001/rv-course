import http.server
import socketserver
import webbrowser
import threading
import time
import sys

PORT = 8000

def start_server():
    # Enforce UTF-8 coding for responses to prevent encoding mismatches
    class UTF8Handler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()

    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), UTF8Handler) as httpd:
            print(f"\n==================================================")
            print(f" RV ACADEMY Local Server is running!")
            print(f" URL: http://localhost:{PORT}/index.html")
            print(f" Press Ctrl+C in this window to stop the server.")
            print(f"==================================================\n")
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Start server in a daemon thread so it exits when the main script exits
    thread = threading.Thread(target=start_server, daemon=True)
    thread.start()
    
    # Wait a moment for server initialization
    time.sleep(1.2)
    
    # Open the browser to the local server
    print("Opening browser to local web page...")
    webbrowser.open(f"http://localhost:{PORT}/index.html")
    
    # Keep main thread alive to handle keyboard interrupt
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping local server... Goodbye!")
