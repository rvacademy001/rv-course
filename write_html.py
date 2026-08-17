import sys
content = sys.stdin.read()
with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS")
