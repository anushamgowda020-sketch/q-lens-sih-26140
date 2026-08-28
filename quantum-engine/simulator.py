import json

from quantum_engine import build_circuit, run_circuit


# Load circuit configuration
with open("circuit.json", "r") as file:
    data = json.load(file)


# Build the Qiskit circuit
circuit = build_circuit(data)


# Run simulation
counts = run_circuit(
    circuit,
    data["shots"]
)


# Display results
print("\n========== Q-LENS QUANTUM SIMULATOR ==========")

print("\nCircuit:")
print(circuit)

print("\nMeasurement Results:")
print(counts)