import webbrowser
import time
import subprocess
import sys
import os

def main():
    print("====================================================================")
    print(" 🚀 STARTING MEDICINE REMINDER APP IN VS CODE...")
    print("====================================================================")
    
    script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "server.py")
    
    # Open browser after 1.5 seconds
    time.sleep(1)
    try:
        webbrowser.open("http://localhost:8080")
    except Exception as e:
        print(f"Could not auto-open browser: {e}")
        
    # Start server.py
    subprocess.run([sys.executable, script_path])

if __name__ == '__main__':
    main()
