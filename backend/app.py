from flask import Flask, request, jsonify
from flask_cors import CORS

import sys
import os


# ==========================================
# FIND QUANTUM ENGINE
# ==========================================

quantum_engine_path = os.path.abspath(

    os.path.join(
        os.path.dirname(__file__),
        "..",
        "quantum-engine"
    )

)

sys.path.append(
    quantum_engine_path
)


from quantum_engine import (
    build_circuit,
    run_circuit
)


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return jsonify({

        "message":
            "Q-LENS Backend is running!"

    })


# ==========================================
# SIMULATION
# ==========================================

@app.route(
    "/simulate",
    methods=["POST"]
)
def simulate():

    try:

        data = request.json


        circuit = build_circuit(
            data
        )


        counts, statevector = run_circuit(

            circuit,

            data.get(
                "shots",
                1000
            )

        )


        return jsonify({

            "success": True,

            "results":
                counts,

            "statevector":
                statevector,

            "circuit":
                str(circuit)

        })


    except Exception as error:

        print(
            "Simulation error:",
            error
        )


        return jsonify({

            "success": False,

            "error":
                str(error)

        }), 400


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )
    