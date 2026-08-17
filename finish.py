import os
try:
    if os.path.exists("index.html"):
        os.remove("index.html")
    os.rename("index_fixed.html", "index.html")
    print("SUCCESS")
except Exception as e:
    print(f"Error: {e}")
