#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EchoShadow 1314 - English Shadowing Assistant Server
Zero external dependency Python 3 HTTP server with REST API support.
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os
import sys
import mimetypes
from pathlib import Path

# Fix Windows console UTF-8 output encoding
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

PORT = 8765
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
DATA_DIR = BASE_DIR / "data"

DATA_DIR.mkdir(exist_ok=True)
HISTORY_FILE = DATA_DIR / "user_data.json"
SETTINGS_FILE = DATA_DIR / "settings.json"

if not HISTORY_FILE.exists():
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False, indent=2)

if not SETTINGS_FILE.exists():
    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "rate": 0.9,
            "interval": 2.0,
            "repeatCount": 3,
            "voiceName": "",
            "apiKey": os.environ.get("GEMINI_API_KEY", "")
        }, f, ensure_ascii=False, indent=2)

# Ensure proper mime types
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("text/html", ".html")
mimetypes.add_type("application/json", ".json")

class ShadowingRequestHandler(http.server.BaseHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local development
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        path = self.path.split("?")[0]

        if path == "/api/history":
            try:
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    history = json.load(f)
                self.send_json(history)
            except Exception as e:
                self.send_json({"error": str(e)}, status=500)
            return

        elif path == "/api/network-info":
            import socket
            ip = "127.0.0.1"
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(('10.255.255.255', 1))
                ip = s.getsockname()[0]
                s.close()
            except Exception:
                pass
            self.send_json({
                "port": PORT,
                "local_ip": ip,
                "network_url": f"http://{ip}:{PORT}",
                "local_url": f"http://localhost:{PORT}"
            })
            return

        elif path == "/api/settings":
            try:
                with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                    settings = json.load(f)
                self.send_json(settings)
            except Exception as e:
                self.send_json({"error": str(e)}, status=500)
            return

        elif path == "/api/health":
            self.send_json({"status": "ok", "version": "1.0.0"})
            return

        # Serve static files
        if path == "/" or path == "":
            file_path = STATIC_DIR / "index.html"
        else:
            rel_path = path.lstrip("/")
            file_path = STATIC_DIR / rel_path

        if file_path.exists() and file_path.is_file():
            mime_type, _ = mimetypes.guess_type(str(file_path))
            if not mime_type:
                mime_type = "application/octet-stream"
            try:
                with open(file_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error reading file: {e}".encode("utf-8"))
        else:
            # Fallback to index.html for SPA if not found
            fallback = STATIC_DIR / "index.html"
            if fallback.exists():
                with open(fallback, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"404 Not Found")

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            req_data = json.loads(body)
        except Exception:
            req_data = {}

        path = self.path.split("?")[0]

        if path == "/api/generate":
            self.handle_generate(req_data)
        elif path == "/api/history":
            self.handle_save_history(req_data)
        elif path == "/api/history/favorite":
            self.handle_toggle_favorite(req_data)
        elif path == "/api/settings":
            self.handle_save_settings(req_data)
        else:
            self.send_json({"error": "Endpoint not found"}, status=404)

    def do_DELETE(self):
        path = self.path.split("?")[0]
        if path.startswith("/api/history"):
            try:
                # Query param or id from path
                params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                item_id = params.get("id", [None])[0]
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    history = json.load(f)
                if item_id:
                    history = [item for item in history if str(item.get("id")) != str(item_id)]
                else:
                    history = []
                with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                    json.dump(history, f, ensure_ascii=False, indent=2)
                self.send_json({"success": True, "count": len(history)})
            except Exception as e:
                self.send_json({"error": str(e)}, status=500)
        else:
            self.send_json({"error": "Endpoint not found"}, status=404)

    def handle_save_history(self, item):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                history = json.load(f)
            
            # Check if item with same ID or same text exists, update or prepend
            existing_idx = None
            for idx, h in enumerate(history):
                if str(h.get("id")) == str(item.get("id")) or h.get("text", "").lower() == item.get("text", "").lower():
                    existing_idx = idx
                    break
            
            if existing_idx is not None:
                history[existing_idx] = item
            else:
                history.insert(0, item)
            
            # Keep latest 200 items
            history = history[:200]
            with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(history, f, ensure_ascii=False, indent=2)
            self.send_json({"success": True, "item": item})
        except Exception as e:
            self.send_json({"error": str(e)}, status=500)

    def handle_toggle_favorite(self, req_data):
        item_id = str(req_data.get("id", ""))
        text = req_data.get("text", "").lower().strip()
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                history = json.load(f)
            found = False
            target_status = False
            for h in history:
                if (item_id and str(h.get("id")) == item_id) or (text and h.get("text", "").lower().strip() == text):
                    h["favorite"] = not h.get("favorite", False)
                    target_status = h["favorite"]
                    found = True
                    break
            if not found and req_data.get("item"):
                item = req_data["item"]
                item["favorite"] = True
                target_status = True
                history.insert(0, item)
            with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(history, f, ensure_ascii=False, indent=2)
            self.send_json({"success": True, "favorite": target_status, "count": len(history)})
        except Exception as e:
            self.send_json({"error": str(e)}, status=500)

    def handle_save_settings(self, settings):
        try:
            with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
                json.dump(settings, f, ensure_ascii=False, indent=2)
            self.send_json({"success": True, "settings": settings})
        except Exception as e:
            self.send_json({"error": str(e)}, status=500)

    def handle_generate(self, req_data):
        gen_type = req_data.get("type", "phrase") # 'phrase' or 'word' or 'recommend_batch'
        query = req_data.get("query", "").strip()
        api_key = req_data.get("apiKey", "").strip()

        # Check settings or env if api_key is empty
        if not api_key:
            try:
                with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                    s = json.load(f)
                    api_key = s.get("apiKey", "")
            except Exception:
                pass
        if not api_key:
            api_key = os.environ.get("GEMINI_API_KEY", "")

        # If Gemini API Key exists, call Gemini directly!
        if api_key:
            result = self.call_gemini_api(gen_type, query, api_key)
            if result and not result.get("error"):
                self.send_json(result)
                return

        # Fallback to local intelligent generation engine
        local_result = self.generate_local(gen_type, query)
        self.send_json(local_result)

    def call_gemini_api(self, gen_type, query, api_key):
        """Call Google Gemini API using native urllib"""
        if gen_type == "phrase":
            prompt = f"""
你是一位專門設計「YouTube English Podcast 1314」（Podcast學英語1314）風格的專業美式英語口說教練。
用戶想要學習英語片語：「{query}」。
請為此片語生成最道地、自然、適合 Shadowing（跟讀法）的學習資料。
請以繁體中文回答，並輸出純 JSON 格式（不要使用 markdown 程式碼區塊外多餘文字）：
{{
  "text": "{query}",
  "type": "phrase",
  "translation": "片語的道地繁體中文翻譯",
  "explanation": "Podcast 1314 風格的語境剖析（何時使用、情緒氛圍、口語習慣）",
  "pronunciation": "發音與連音口訣（例如連音、弱讀技巧）",
  "sentence": "非常道地自然的生活/Podcast風格例句（適合跟讀，長度適中）",
  "sentence_translation": "例句的繁體中文翻譯",
  "dialogue": [
    {{"speaker": "A", "line": "Speaker A的自然對話（包含或引出該片語）", "translation": "A的中文翻譯"}},
    {{"speaker": "B", "line": "Speaker B的真實回覆（展示該片語的完美應用）", "translation": "B的中文翻譯"}}
  ],
  "shadowing_tips": "跟讀建議（重音落在哪個字、語調上揚或下沉）"
}}
"""
        elif gen_type == "word":
            prompt = f"""
你是一位專業美語口說教學專家。用戶想要學習單字：「{query}」。
用戶明確需求：【請簡單造句】，必須是日常生活高頻、口語化、簡單好讀、非常適合跟讀的句子，不要複雜長難句！
請以繁體中文回答，並輸出純 JSON 格式：
{{
  "text": "{query}",
  "type": "word",
  "pos": "詞性 (例如: n., v., adj., adv.)",
  "phonetic": "KK音標或IPA",
  "translation": "最核心常見的繁體中文解釋",
  "sentence": "生活日常超實用的簡單造句（字數約 6-12 字，節奏流暢，非常適合跟讀口說）",
  "sentence_translation": "簡單造句的繁體中文翻譯",
  "alternative_sentence": "另一個日常生活簡單例句",
  "alternative_translation": "另一個例句的中文翻譯",
  "shadowing_tips": "發音小提醒（易錯音、重音位置）"
}}
"""
        elif gen_type == "recommend_batch":
            category = query or "日常生活"
            prompt = f"""
請推薦 5 個「English Podcast 1314」風格最受歡迎的道地美語片語/習語（主題：{category}）。
請以純 JSON 陣列格式輸出：
[
  {{
    "text": "片語英文 (例如 hit the nail on the head)",
    "translation": "繁體中文翻譯",
    "category": "{category}",
    "level": "B1",
    "sentence": "Podcast風格生活化實用例句",
    "sentence_translation": "例句中文翻譯",
    "dialogue": [
      {{"speaker": "A", "line": "對話A", "translation": "翻譯A"}},
      {{"speaker": "B", "line": "對話B", "translation": "翻譯B"}}
    ],
    "explanation": "Podcast風格生動解說"
  }}
]
"""
        else:
            return {"error": "Invalid generation type"}

        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.7,
                "responseMimeType": "application/json"
            }
        }

        try:
            req = urllib.request.Request(
                endpoint,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                res_body = response.read().decode("utf-8")
                res_json = json.loads(res_body)
                content_text = res_json["candidates"][0]["content"]["parts"][0]["text"]
                # Clean up markdown fences if present
                clean_json = content_text.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                elif clean_json.startswith("```"):
                    clean_json = clean_json[3:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
                clean_json = clean_json.strip()
                return json.loads(clean_json)
        except Exception as e:
            # Return error so caller falls back to local engine
            return {"error": f"Gemini API error: {e}"}

    def generate_local(self, gen_type, query):
        """Intelligent offline fallback engine with podcast style"""
        q = query.strip()
        q_lower = q.lower()

        # Check curated database.json first
        db_path = DATA_DIR / "database.json"
        if db_path.exists():
            try:
                with open(db_path, "r", encoding="utf-8") as f:
                    db = json.load(f)
                if gen_type == "phrase":
                    for p in db.get("phrases", []):
                        if p.get("text", "").lower() == q_lower:
                            return {**p, "type": "phrase"}
                elif gen_type == "word":
                    for w in db.get("words", []):
                        if w.get("word", "").lower() == q_lower:
                            return {**w, "text": w.get("word"), "type": "word"}
            except Exception as e:
                print(f"Error reading database.json: {e}")

        if gen_type == "phrase":
            return {
                "text": q,
                "type": "phrase",
                "translation": f"「{q}」（道地美式日常口語）",
                "explanation": f"在美式口語與 English Podcast 1314 中，「{q}」常出現在輕鬆的朋友聊天或職場非正式溝通中，能夠讓你的對話聽起來更像母語人士，告別生硬的書面語。",
                "pronunciation": f"注意連音與重音位置，將「{q}」視為一個完整意群順暢吐氣。",
                "sentence": f"Whenever things get tough, I just remember to {q}.",
                "sentence_translation": f"每當事情變得棘手時，我就會提醒自己要 {q}。",
                "dialogue": [
                    {
                        "speaker": "A",
                        "line": f"Are you sure we should {q} right now?",
                        "translation": f"你確定我們現在就該 {q} 嗎？"
                    },
                    {
                        "speaker": "B",
                        "line": f"Trust me, it's the most natural choice. Let's {q} and see how it goes.",
                        "translation": f"相信我，這是最自然的選擇。就這麼做，看看接下來如何吧。"
                    }
                ],
                "shadowing_tips": "跟讀時注意節奏感，語速保持平穩，不要刻意將每個單字分開唸。"
            }

        elif gen_type == "word":
            return {
                "text": q,
                "type": "word",
                "pos": "日常單字",
                "phonetic": f"/{q}/",
                "translation": f"「{q}」",
                "sentence": f"I really want to {q} today.",
                "sentence_translation": f"我今天真的很想 {q}。",
                "alternative_sentence": f"Can you show me how to {q}?",
                "alternative_translation": f"你能示範給我看如何 {q} 嗎？",
                "shadowing_tips": f"【簡單造句練習】這是一個短而清晰的日常句，跟讀時請跟隨音檔抑揚頓挫，重複跟讀3至5遍以建立肌肉記憶。"
            }

        else:
            return {"error": "Unsupported type"}

def run_server():
    import urllib.parse
    import socket
    local_ip = "127.0.0.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('10.255.255.255', 1))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        pass

    print(f"==================================================")
    print(f" 🎧 EchoShadow 1314 English Shadowing Server")
    print(f" 本機電腦網址: http://localhost:{PORT}")
    print(f" 手機同Wi-Fi網址: http://{local_ip}:{PORT}")
    print(f" 按 Ctrl+C 可停止伺服器")
    print(f"==================================================")
    
    # Try binding port with SO_REUSEADDR
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ShadowingRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shutting down gracefully.")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
