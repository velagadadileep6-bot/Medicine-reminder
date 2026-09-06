import sys
import os

# Add parent directory to path so we can import server
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import server

# Expose CustomHTTPRequestHandler as handler for Vercel
class handler(server.CustomHTTPRequestHandler):
    pass
