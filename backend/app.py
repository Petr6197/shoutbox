import json
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Zprávy se ukládají do souboru vedle app.py
FILE = Path(__file__).parent / "messages.json"
MAX_MESSAGES = 100


def load_messages():
    if not FILE.exists():
        return []
    return json.loads(FILE.read_text(encoding="utf-8"))


def save_messages(messages):
    FILE.write_text(json.dumps(messages, ensure_ascii=False), encoding="utf-8")


@app.get("/api/messages")
def get_messages():
    return jsonify(load_messages())


@app.post("/api/messages")
def add_message():
    data = request.get_json(silent=True) or {}

    username = str(data.get("username", "")).strip()[:30]
    message = str(data.get("message", "")).strip()[:500]
    color = str(data.get("color", "#000000"))

    if not username or not message:
        return jsonify({"error": "Chybí jméno nebo zpráva"}), 400

    messages = load_messages()
    messages.append({"username": username, "message": message, "color": color})
    messages = messages[-MAX_MESSAGES:]  # nechá jen posledních 100
    save_messages(messages)

    return jsonify(messages)


if __name__ == "__main__":
    app.run(debug=True, port=5000)