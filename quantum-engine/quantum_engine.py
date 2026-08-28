from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector


def build_circuit(data):

    circuit = QuantumCircuit(
        data["qubits"],
        data["classical_bits"]
    )

    for gate in data["gates"]:

        if gate["type"] == "h":

            circuit.h(
                gate["qubit"]
            )

        elif gate["type"] == "x":

            circuit.x(
                gate["qubit"]
            )

        elif gate["type"] == "y":

            circuit.y(
                gate["qubit"]
            )

        elif gate["type"] == "z":

            circuit.z(
                gate["qubit"]
            )

        elif gate["type"] == "cx":

            circuit.cx(
                gate["control"],
                gate["target"]
            )

        else:

            raise ValueError(
                f"Unsupported gate: {gate['type']}"
            )


    for measurement in data["measurements"]:

        circuit.measure(
            measurement["qubit"],
            measurement["classical_bit"]
        )


    return circuit


def run_circuit(circuit, shots=1000):

    simulator = AerSimulator()


    # --------------------------------------
    # Measurement simulation
    # --------------------------------------

    job = simulator.run(
        circuit,
        shots=shots
    )

    result = job.result()

    counts = result.get_counts()


    # --------------------------------------
    # Statevector calculation
    # --------------------------------------

    circuit_without_measurements = \
        circuit.remove_final_measurements(
            inplace=False
        )


    statevector = Statevector.from_instruction(
        circuit_without_measurements
    )


    amplitudes = []


    for index, amplitude in enumerate(
        statevector.data
    ):

        basis_state = format(
            index,
            f"0{circuit.num_qubits}b"
        )


        probability = float(
            abs(amplitude) ** 2
        )


        amplitudes.append({

            "basis_state":
                basis_state,

            "real":
                float(amplitude.real),

            "imaginary":
                float(amplitude.imag),

            "probability":
                probability

        })


    return counts, amplitudes