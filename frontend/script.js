// ==========================================
// GET HTML ELEMENTS
// ==========================================

const gateSelect =
    document.getElementById("gateSelect");

const qubitSelect =
    document.getElementById("qubitSelect");

const targetSelect =
    document.getElementById("targetSelect");

const targetLabel =
    document.getElementById("targetLabel");

const addGateButton =
    document.getElementById("addGate");

const runButton =
    document.getElementById("runSimulation");

const resultsBox =
    document.getElementById("results");

const explanationBox =
    document.getElementById("explanation");

const probabilityBox =
    document.getElementById("stateProbabilities");


// ==========================================
// CIRCUIT DATA
// ==========================================

const circuitData = {

    gates: []

};


// ==========================================
// SHOW / HIDE TARGET FOR CX
// ==========================================

gateSelect.addEventListener("change", function () {

    if (gateSelect.value === "cx") {

        targetSelect.style.display =
            "inline-block";

        targetLabel.style.display =
            "inline-block";

    } else {

        targetSelect.style.display =
            "none";

        targetLabel.style.display =
            "none";

    }

});


// ==========================================
// ADD GATE
// ==========================================

addGateButton.addEventListener("click", function () {

    const gate =
        gateSelect.value;

    const qubit =
        Number(qubitSelect.value);


    // Controlled-X

    if (gate === "cx") {

        const target =
            Number(targetSelect.value);


        if (qubit === target) {

            alert(
                "Control and target qubits must be different!"
            );

            return;

        }


        circuitData.gates.push({

            type: "cx",

            control: qubit,

            target: target

        });

    }


    // Normal gate

    else {

        circuitData.gates.push({

            type: gate,

            qubit: qubit

        });

    }


    displayCircuit();

    displayExplanation();

});


// ==========================================
// DISPLAY CIRCUIT
// ==========================================

function displayCircuit() {

    const q0wire =
        document.getElementById("q0wire");

    const q1wire =
        document.getElementById("q1wire");


    q0wire.innerHTML = "";

    q1wire.innerHTML = "";


    circuitData.gates.forEach(function (gate) {


        // CX GATE

        if (gate.type === "cx") {

            const control =
                document.createElement("span");

            control.className = "gate";

            control.textContent = "●";


            const target =
                document.createElement("span");

            target.className = "gate";

            target.textContent = "X";


            if (gate.control === 0) {

                q0wire.appendChild(control);

                q1wire.appendChild(target);

            } else {

                q1wire.appendChild(control);

                q0wire.appendChild(target);

            }

        }


        // NORMAL GATE

        else {

            const gateElement =
                document.createElement("span");

            gateElement.className =
                "gate";

            gateElement.textContent =
                gate.type.toUpperCase();


            if (gate.qubit === 0) {

                q0wire.appendChild(
                    gateElement
                );

            } else {

                q1wire.appendChild(
                    gateElement
                );

            }

        }

    });

}


// ==========================================
// CIRCUIT EXPLANATION
// ==========================================

function displayExplanation() {

    if (circuitData.gates.length === 0) {

        explanationBox.innerHTML =
            "Add gates to your circuit to see an explanation.";

        return;

    }


    let html = "";


    circuitData.gates.forEach(
        function (gate, index) {


            if (gate.type === "h") {

                html += `
                    <div class="explanation-item">

                        <h3>
                            ${index + 1}. Hadamard Gate (H)
                        </h3>

                        <p>
                            The Hadamard gate creates
                            superposition on qubit
                            ${gate.qubit}.
                        </p>

                        <p>
                            This gives the qubit an equal
                            probability of being measured
                            as |0⟩ or |1⟩.
                        </p>

                    </div>
                `;

            }


            else if (gate.type === "x") {

                html += `
                    <div class="explanation-item">

                        <h3>
                            ${index + 1}. Pauli-X Gate (X)
                        </h3>

                        <p>
                            The X gate flips the state
                            of qubit ${gate.qubit}.
                        </p>

                        <p>
                            |0⟩ becomes |1⟩ and
                            |1⟩ becomes |0⟩.
                        </p>

                    </div>
                `;

            }


            else if (gate.type === "y") {

                html += `
                    <div class="explanation-item">

                        <h3>
                            ${index + 1}. Pauli-Y Gate (Y)
                        </h3>

                        <p>
                            The Y gate changes the
                            qubit state with a phase
                            transformation.
                        </p>

                    </div>
                `;

            }


            else if (gate.type === "z") {

                html += `
                    <div class="explanation-item">

                        <h3>
                            ${index + 1}. Pauli-Z Gate (Z)
                        </h3>

                        <p>
                            The Z gate applies a phase
                            flip to the |1⟩ state.
                        </p>

                    </div>
                `;

            }


            else if (gate.type === "cx") {

                html += `
                    <div class="explanation-item">

                        <h3>
                            ${index + 1}. Controlled-X Gate (CX)
                        </h3>

                        <p>
                            Qubit ${gate.control}
                            is the control qubit.
                        </p>

                        <p>
                            Qubit ${gate.target}
                            is the target qubit.
                        </p>

                        <p>
                            The X operation is applied
                            to the target when the
                            control qubit is |1⟩.
                        </p>

                    </div>
                `;

            }

        }
    );


    explanationBox.innerHTML = html;

}


// ==========================================
// DISPLAY PROBABILITIES
// ==========================================

function displayStateProbabilities(
    statevector
) {

    probabilityBox.innerHTML = "";


    if (
        !statevector ||
        statevector.length === 0
    ) {

        probabilityBox.innerHTML =
            "No probability data received.";

        return;

    }


    statevector.forEach(function (state) {

        const basisState =
            state.basis_state;

        const probability =
            Number(state.probability);


        const percentage =
            probability * 100;


        const row =
            document.createElement("div");

        row.className =
            "state-row";


        row.innerHTML = `

            <div class="state-label">

                <span>
                    |${basisState}⟩
                </span>

                <span>
                    ${percentage.toFixed(2)}%
                </span>

            </div>


            <div class="probability-bar">

                <div
                    class="probability-fill"
                    style="width:${percentage}%"
                ></div>

            </div>

        `;


        probabilityBox.appendChild(row);

    });

}


// ==========================================
// RUN SIMULATION
// ==========================================

runButton.addEventListener(
    "click",
    async function () {


        if (circuitData.gates.length === 0) {

            alert(
                "Please add at least one gate first."
            );

            return;

        }


        resultsBox.innerHTML =
            "Running quantum simulation...";


        probabilityBox.innerHTML =
            "Calculating quantum state probabilities...";


        const circuit = {

            qubits: 2,

            classical_bits: 2,

            shots: 1000,

            gates: circuitData.gates,

            measurements: [

                {
                    qubit: 0,
                    classical_bit: 0
                },

                {
                    qubit: 1,
                    classical_bit: 1
                }

            ]

        };


        console.log(
            "Circuit being sent:",
            circuit
        );


        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/simulate",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(circuit)

                    }
                );


            const data =
                await response.json();


            console.log(
                "Backend response:",
                data
            );


            if (data.success) {


                // Measurement results

                resultsBox.innerHTML = `

                    <h3>
                        Simulation Successful ✅
                    </h3>

                    <p>
                        Measurement Results:
                    </p>

                    <pre>
${JSON.stringify(
    data.results,
    null,
    2
)}
                    </pre>

                `;


                // State probabilities

                if (data.statevector) {

                    displayStateProbabilities(
                        data.statevector
                    );

                } else {

                    probabilityBox.innerHTML =
                        "State probability data was not received.";

                }

            }


            else {

                resultsBox.innerHTML = `

                    <h3>
                        Simulation Failed ❌
                    </h3>

                    <pre>
${data.error}
                    </pre>

                `;


                probabilityBox.innerHTML =
                    "Probability calculation failed.";

            }

        }


        catch (error) {

            console.error(error);


            resultsBox.innerHTML = `

                <h3>
                    Could not connect to quantum backend ❌
                </h3>

                <p>
                    Make sure Flask is running on
                    port 5000.
                </p>

                <pre>
${error}
                </pre>

            `;


            probabilityBox.innerHTML =
                "Backend connection required.";

        }

    }
);


// ==========================================
// INITIAL MESSAGE
// ==========================================

console.log(
    "Q-LENS frontend loaded successfully."
);
// ==========================================
// LEARNING MODE
// ==========================================

const conceptSelect =
    document.getElementById("conceptSelect");

const learnButton =
    document.getElementById("learnButton");

const lessonContent =
    document.getElementById("lessonContent");


learnButton.addEventListener(
    "click",
    function () {

        const concept =
            conceptSelect.value;


        if (concept === "qubit") {

            lessonContent.innerHTML = `

                <h3>⚛️ What is a Qubit?</h3>

                <p>
                    A qubit is the basic unit of
                    quantum information.
                </p>

                <p>
                    Unlike a classical bit, which can
                    be either 0 or 1, a qubit can exist
                    in a quantum superposition of
                    |0⟩ and |1⟩.
                </p>

                <div class="lesson-example">

                    <b>Classical bit:</b>

                    <p>
                        0 OR 1
                    </p>

                    <b>Qubit:</b>

                    <p>
                        α|0⟩ + β|1⟩
                    </p>

                </div>

            `;

        }


        else if (concept === "superposition") {

            lessonContent.innerHTML = `

                <h3>🌊 Superposition</h3>

                <p>
                    Superposition allows a qubit to
                    exist in a combination of quantum
                    states.
                </p>

                <p>
                    The Hadamard (H) gate is commonly
                    used to create an equal
                    superposition.
                </p>

                <div class="lesson-example">

                    <b>Before H:</b>

                    <p>
                        |0⟩
                    </p>

                    <b>After H:</b>

                    <p>
                        (|0⟩ + |1⟩) / √2
                    </p>

                    <b>Measurement probabilities:</b>

                    <p>
                        |0⟩ → 50%
                    </p>

                    <p>
                        |1⟩ → 50%
                    </p>

                </div>

            `;

        }


        else if (concept === "entanglement") {

            lessonContent.innerHTML = `

                <h3>🔗 Quantum Entanglement</h3>

                <p>
                    Entanglement creates a strong
                    quantum correlation between
                    qubits.
                </p>

                <p>
                    A common example is the Bell state.
                </p>

                <div class="lesson-example">

                    <b>Step 1:</b>

                    <p>
                        Apply H to q₀.
                    </p>

                    <b>Step 2:</b>

                    <p>
                        Apply CX(q₀, q₁).
                    </p>

                    <b>Result:</b>

                    <p>
                        (|00⟩ + |11⟩) / √2
                    </p>

                    <p>
                        Measurement gives approximately
                        50% |00⟩ and 50% |11⟩.
                    </p>

                </div>

            `;

        }


        else if (concept === "measurement") {

            lessonContent.innerHTML = `

                <h3>🎯 Quantum Measurement</h3>

                <p>
                    Measurement converts quantum
                    information into a classical
                    result.
                </p>

                <p>
                    When a qubit is measured, the
                    quantum state produces a classical
                    outcome such as 0 or 1.
                </p>

                <div class="lesson-example">

                    <b>Example:</b>

                    <p>
                        A qubit in equal superposition
                        has:
                    </p>

                    <p>
                        P(0) = 50%
                    </p>

                    <p>
                        P(1) = 50%
                    </p>

                    <p>
                        After measurement, one
                        classical result is obtained.
                    </p>

                </div>

            `;

        }

    }
);
// ==========================================
// PREDICTION MODE
// ==========================================

const predictionSelect =
    document.getElementById("predictionSelect");

const checkPredictionButton =
    document.getElementById("checkPrediction");

const predictionFeedback =
    document.getElementById("predictionFeedback");


checkPredictionButton.addEventListener(
    "click",
    function () {

        const prediction =
            predictionSelect.value;


        if (prediction === "") {

            predictionFeedback.innerHTML = `
                <p>
                    ⚠️ Please select a prediction first.
                </p>
            `;

            return;

        }


        if (prediction === "00-11") {

            predictionFeedback.innerHTML = `
                <h3>🎉 Excellent Prediction!</h3>

                <p>
                    For the Bell state
                    (|00⟩ + |11⟩) / √2,
                    the expected measurement outcomes
                    are |00⟩ and |11⟩.
                </p>

                <p>
                    Run the simulation to compare your
                    prediction with the actual result.
                </p>
            `;

        } else {

            predictionFeedback.innerHTML = `
                <h3>💡 Good Try!</h3>

                <p>
                    Now run the simulation and compare
                    your prediction with the actual
                    measurement results.
                </p>
            `;

        }

    }
);