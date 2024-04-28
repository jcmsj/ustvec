import argparse
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from travel import checkItinerary

class TravelPlanHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers['Content-Length'])
        body = self.rfile.read(length).decode('utf-8')
        params = json.loads(body)

        if 'plan' not in params:
            self.send_response(400)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write('Missing "plan" parameter'.encode('utf-8'))
            return

        self.send_response(200)
        self.send_header('Content-type', 'text/plain; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type')
        self.end_headers()

        self.wfile.write(str(checkItinerary(params['plan'])).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

def run(server_class=HTTPServer, handler_class=TravelPlanHandler, host='localhost', port=8000):
    server_address = (host, port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='', help='Host address')
    parser.add_argument('--port', type=int, default=8000, help='Port number')
    args = parser.parse_args()
    print(f"Starting server on http://{'localhost' if args.host == '' else args.host}:{args.port}")
    run(host=args.host, port=args.port)
