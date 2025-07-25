from flask import Flask, jsonify
from backend.routes import hr_routes

app = Flask(__name__)
app.register_blueprint(hr_routes)

@app.route("/")
def healthcheck():
    return "MuvHR is live"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
