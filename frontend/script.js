// ==========================================
// GET HTML ELEMENTS
// ==========================================
const algorithmSelect =
    document.getElementById("algorithmSelect");

const loadAlgorithmButton =
    document.getElementById("loadAlgorithm");
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
const clearButton =
    document.getElementById("clearCircuit");    

const resultsBox =
    document.getElementById("results");

const explanationBox =
    document.getElementById("explanation");

const probabilityBox =
    document.getElementById("stateProbabilities");
const gateInfo =
    document.getElementById("gateInfo");    
const algorithmWalkthrough =
    document.getElementById("algorithmWalkthrough");    
const predictionFeedback =
    document.getElementById("predictionFeedback");    


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
            control.addEventListener(
    "click",
    function () {

        showGateInformation(gate);

    }
);

target.addEventListener(
    "click",
    function () {

        showGateInformation(gate);

    }
);


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
            gateElement.addEventListener(
    "click",
    function () {

        showGateInformation(gate);

    }
);    


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

    // ==============================
    // MEASUREMENT RESULTS
    // ==============================

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


    // ==============================
    // STATE PROBABILITIES
    // ==============================

    if (data.statevector) {

        displayStateProbabilities(
            data.statevector
        );
         displayQuantumState(
        data.statevector
    );


    } else {

        probabilityBox.innerHTML =
            "State probability data was not received.";

    }


    // ==============================
    // PREDICTION EVALUATION
    // ==============================

    const prediction =
        predictionSelect.value;
console.log("Prediction value:", prediction);

    if (prediction === "") {

        predictionFeedback.innerHTML = `

            <h3>🤔 No Prediction Made</h3>

            <p>
                Try making a prediction before
                running the simulation next time.
            </p>

        `;

    } else {
console.log("STEP 12B REACHED");
        const results =
            data.results;
            const accuracy =
    calculatePredictionAccuracy(results);

console.log(
    "Prediction accuracy:",
    accuracy.toFixed(2) + "%"
);
// ==========================================
// UPDATE LEARNING MASTERY
// ==========================================

const learningConcept =
    detectLearningConcept(
        circuitData.gates
    );


let masteryGain = 0;


// Strong performance

if (accuracy >= 80) {

    masteryGain = 10;

}


// Moderate performance

else if (accuracy >= 50) {

    masteryGain = 5;

}


// Attempt / low performance

else {

    masteryGain = 2;

}


updateLearningMastery(
    learningConcept,
    masteryGain
);


console.log(
    "Learning concept:",
    learningConcept
);

console.log(
    "Mastery gained:",
    masteryGain
);
if (prediction !== "") {

   const mistakeAnalysis =
    analyzePredictionMistake(
        prediction,
        results,
        circuitData.gates
    );

    console.log(
        "Mistake Analysis:",
        mistakeAnalysis
    );
    // ==========================================
// PERSONALIZED RECOMMENDATION
// STEP 23B
// ==========================================

const recommendation =
    generateLearningRecommendation(
        mistakeAnalysis,
        circuitData.gates
    );

console.log(
    "Learning Recommendation:",
    recommendation
);


    // ==========================================
    // DISPLAY MISTAKE ANALYSIS
    // ==========================================

    predictionFeedback.innerHTML += `

        <div class="mistake-analysis">

            <h3>
                🧠 Learning Analysis
            </h3>

            <p>
                <strong>Concept:</strong>
                ${mistakeAnalysis.concept}
            </p>

            <p>
                <strong>Why?</strong>
                ${mistakeAnalysis.explanation}
            </p>

            <p>
                <strong>💡 Recommendation:</strong>
                ${mistakeAnalysis.recommendation}
            </p>

        </div>

    `;
    predictionFeedback.innerHTML += `

    <div class="learning-recommendation">

        <h3>
            🎓 Your Next Learning Step
        </h3>

        <p>
            <strong>Topic:</strong>
            ${recommendation.topic}
        </p>

        <p>
            <strong>Try this:</strong>
            ${recommendation.activity}
        </p>

        <p>
            <strong>Learning Goal:</strong>
            ${recommendation.goal}
        </p>

    </div>

`;

}
predictionFeedback.innerHTML = `

    <h3>🎯 Prediction Evaluation</h3>

    <p>
        Prediction Accuracy:
        <b>${accuracy.toFixed(2)}%</b>
    </p>

`;
predictionFeedback.innerHTML = `

    <h3>🎯 Prediction Evaluation</h3>

    <p>
        Your prediction:
        <b>|00⟩ and |11⟩</b>
    </p>

    <p>
        Prediction Accuracy:
        <b>${accuracy.toFixed(2)}%</b>
    </p>

`;

        const has00 =
            results["00"] !== undefined &&
            results["00"] > 0;

        const has11 =
            results["11"] !== undefined &&
            results["11"] > 0;


        if (
            prediction === "00-11" &&
            has00 &&
            has11
        ) {

            predictionFeedback.innerHTML = `

                <h3>🎉 Prediction Correct!</h3>

                <p>
                    Your prediction:
                    <b>|00⟩ and |11⟩</b>
                </p>

                <p>
                    The simulation produced both
                    |00⟩ and |11⟩ outcomes.
                </p>

                <h3>🏆 Score: 10 / 10</h3>
                <p>
    🎯 Prediction Accuracy:
    <b>${accuracy.toFixed(2)}%</b>
</p>

                <p>
                    Excellent! You correctly predicted
                    the Bell-state measurement outcomes.
                </p>

            `;

        } else {

            predictionFeedback.innerHTML = `

                <h3>💡 Not Quite!</h3>

                <p>
                    Your prediction did not match
                    the observed measurement outcomes.
                </p>

                <p>
                    Review the circuit and try again.
                </p>

                <h3>🏆 Score: 0 / 10</h3>

            `;

        }

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
let selectedPrediction = "";
const predictionSelect =
    document.getElementById("predictionSelect");

const checkPredictionButton =
    document.getElementById("checkPrediction");




checkPredictionButton.addEventListener(
    "click",
    function () {

        const prediction =
    predictionSelect.value;

selectedPrediction =
    prediction;


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


// ==========================================
// PROBABILITY-BASED PREDICTION SCORE
// ==========================================

function calculatePredictionAccuracy(results) {

    const totalShots =
        Object.values(results)
            .reduce(
                (sum, value) => sum + value,
                0
            );

    if (totalShots === 0) {
        return 0;
    }

    const probability00 =
        results["00"] !== undefined
            ? (results["00"] / totalShots) * 100
            : 0;

    const probability11 =
        results["11"] !== undefined
            ? (results["11"] / totalShots) * 100
            : 0;

    const error00 =
        Math.abs(50 - probability00);

    const error11 =
        Math.abs(50 - probability11);

    const averageError =
        (error00 + error11) / 2;

    const accuracy =
        Math.max(
            0,
            100 - (averageError * 2)
        );

    return accuracy;
}
// ==========================================
// CLEAR CIRCUIT
// ==========================================

clearButton.addEventListener(
    "click",
    function () {

        circuitData.gates = [];

        displayCircuit();

        displayExplanation();

        resultsBox.innerHTML =
            "Click Run Simulation to execute the circuit.";

        probabilityBox.innerHTML =
            "Add gates to see quantum state probabilities.";

        predictionFeedback.innerHTML =
            "Make a prediction before running the simulation.";

        selectedPrediction = "";

    }
);
// ==========================================
// ALGORITHM PRESETS
// ==========================================

loadAlgorithmButton.addEventListener(
    "click",
    function () {

        const algorithm =
            algorithmSelect.value;

        if (algorithm === "") {

            alert(
                "Please select an algorithm first."
            );

            return;
        }

        // ==============================
        // BELL STATE
        // ==============================

        if (algorithm === "bell") {

            circuitData.gates = [

                {
                    type: "h",
                    qubit: 0
                },

                {
                    type: "cx",
                    control: 0,
                    target: 1
                }

            ];

            displayCircuit();

            displayExplanation();

            displayBellWalkthrough();

            resultsBox.innerHTML =
                "Bell State circuit loaded. Make your prediction and run the simulation.";

            probabilityBox.innerHTML =
                "Run the simulation to see quantum state probabilities.";

            predictionFeedback.innerHTML =
                "Make your prediction before running the simulation.";

        }
        // ==============================
// SUPERPOSITION
// ==============================

if (algorithm === "superposition") {

    circuitData.gates = [

        {
            type: "h",
            qubit: 0
        }

    ];

    displayCircuit();

    displayExplanation();

    displaySuperpositionWalkthrough();

    resultsBox.innerHTML =
        "Superposition circuit loaded. Make your prediction and run the simulation.";

    probabilityBox.innerHTML =
        "Run the simulation to see quantum state probabilities.";

    predictionFeedback.innerHTML =
        "Make your prediction before running the simulation.";

}

    }
);
// ==========================================
// INTERACTIVE ALGORITHM WALKTHROUGH
// ==========================================

function displayBellWalkthrough() {

    algorithmWalkthrough.innerHTML = `

        <h2>🔗 Bell State Walkthrough</h2>

        <div class="walkthrough-step">

            <h3>Step 1 — Create Superposition</h3>

            <p>
                Apply the Hadamard gate (H) to
                qubit 0.
            </p>

            <p>
                This changes q₀ from |0⟩ into:
            </p>

            <p>
                <b>
                    (|0⟩ + |1⟩) / √2
                </b>
            </p>

            <p>
                The qubit now has approximately
                50% probability of being measured
                as |0⟩ or |1⟩.
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 2 — Create Entanglement</h3>

            <p>
                Apply a Controlled-X (CX) gate
                with q₀ as the control and
                q₁ as the target.
            </p>

            <p>
                This creates an entangled Bell state:
            </p>

            <p>
                <b>
                    (|00⟩ + |11⟩) / √2
                </b>
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 3 — Make Your Prediction 🎯</h3>

            <p>
                Before running the simulation,
                predict which states will be observed.
            </p>

            <p>
                Expected outcomes:
                <b>|00⟩ and |11⟩</b>
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 4 — Run the Simulation ⚛️</h3>

            <p>
                Click <b>Run Simulation</b> to
                observe the actual measurement results.
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 5 — Understand the Result 🧠</h3>

            <p>
                You should observe approximately:
            </p>

            <p>
                <b>|00⟩ ≈ 50%</b>
            </p>

            <p>
                <b>|11⟩ ≈ 50%</b>
            </p>

            <p>
                This correlation is a signature of
                quantum entanglement.
            </p>

        </div>

    `;

}
// ==========================================
// SUPERPOSITION WALKTHROUGH
// ==========================================

function displaySuperpositionWalkthrough() {

    algorithmWalkthrough.innerHTML = `

        <h2>🌊 Superposition Walkthrough</h2>

        <div class="walkthrough-step">

            <h3>Step 1 — Start State</h3>

            <p>
                Both qubits initially begin in
                the state |0⟩.
            </p>

            <p>
                The initial two-qubit state is:
            </p>

            <p>
                <b>|00⟩</b>
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 2 — Apply Hadamard Gate</h3>

            <p>
                Apply the H gate to qubit 0.
            </p>

            <p>
                The Hadamard gate creates
                superposition.
            </p>

            <p>
                q₀ becomes:
            </p>

            <p>
                <b>
                    (|0⟩ + |1⟩) / √2
                </b>
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 3 — Understand the Probabilities 📊</h3>

            <p>
                Measuring q₀ gives approximately:
            </p>

            <p>
                <b>P(0) = 50%</b>
            </p>

            <p>
                <b>P(1) = 50%</b>
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 4 — Predict 🎯</h3>

            <p>
                The complete two-qubit measurement
                should produce approximately:
            </p>

            <p>
                <b>|00⟩ ≈ 50%</b>
            </p>

            <p>
                <b>|01⟩ ≈ 50%</b>
            </p>

        </div>


        <div class="walkthrough-step">

            <h3>Step 5 — Run the Simulation ⚛️</h3>

            <p>
                Click <b>Run Simulation</b> and
                compare your prediction with the
                actual measurement results.
            </p>

        </div>

    `;

}
// ==========================================
// GATE INFORMATION
// ==========================================

function showGateInformation(gate) {

    if (gate.type === "h") {

        gateInfo.innerHTML = `

            <h3>🌊 Hadamard Gate (H)</h3>

            <p>
                Applied to qubit ${gate.qubit}.
            </p>

            <p>
                The Hadamard gate creates
                quantum superposition.
            </p>

            <p>
                <b>
                    |0⟩ → (|0⟩ + |1⟩) / √2
                </b>
            </p>

            <p>
                Expected probabilities:
            </p>

            <p>
                P(0) ≈ 50%
            </p>

            <p>
                P(1) ≈ 50%
            </p>

        `;

    }


    else if (gate.type === "x") {

        gateInfo.innerHTML = `

            <h3>🔄 Pauli-X Gate (X)</h3>

            <p>
                Applied to qubit ${gate.qubit}.
            </p>

            <p>
                The X gate flips the qubit state.
            </p>

            <p>
                <b>
                    |0⟩ → |1⟩
                </b>
            </p>

            <p>
                <b>
                    |1⟩ → |0⟩
                </b>
            </p>

        `;

    }


    else if (gate.type === "y") {

        gateInfo.innerHTML = `

            <h3>🌀 Pauli-Y Gate (Y)</h3>

            <p>
                Applied to qubit ${gate.qubit}.
            </p>

            <p>
                The Y gate changes both the
                amplitude and phase of the state.
            </p>

        `;

    }


    else if (gate.type === "z") {

        gateInfo.innerHTML = `

            <h3>🔀 Pauli-Z Gate (Z)</h3>

            <p>
                Applied to qubit ${gate.qubit}.
            </p>

            <p>
                The Z gate changes the phase
                of the |1⟩ state.
            </p>

            <p>
                <b>
                    |0⟩ → |0⟩
                </b>
            </p>

            <p>
                <b>
                    |1⟩ → −|1⟩
                </b>
            </p>

        `;

    }


    else if (gate.type === "cx") {

        gateInfo.innerHTML = `

            <h3>🔗 Controlled-X Gate (CX)</h3>

            <p>
                Control qubit:
                <b>${gate.control}</b>
            </p>

            <p>
                Target qubit:
                <b>${gate.target}</b>
            </p>

            <p>
                The X operation is applied to
                the target only when the control
                qubit is |1⟩.
            </p>

            <p>
                CX is commonly used to create
                quantum entanglement.
            </p>

        `;

    }

}
// ==========================================
// QUIZ / ASSESSMENT MODE
// ==========================================

const quizOptions =
    document.querySelectorAll(".quiz-option");

const quizFeedback =
    document.getElementById("quizFeedback");


// ==========================================
// QUIZ QUESTIONS
// ==========================================

const quizQuestions = [

    {
        question:
            "What does the Hadamard (H) gate primarily create?",

        options: [
            "Entanglement",
            "Superposition",
            "Measurement",
            "A classical bit"
        ],

        correct: 1
    },


    {
        question:
            "Which gate is commonly used to create entanglement between two qubits?",

        options: [
            "X gate",
            "Z gate",
            "CX gate",
            "H gate"
        ],

        correct: 2
    },


    {
        question:
            "What is the result of measuring a qubit?",

        options: [
            "A classical outcome",
            "Another qubit",
            "A new quantum gate",
            "A probability equation"
        ],

        correct: 0
    }

];


// ==========================================
// QUIZ STATE
// ==========================================

let quizScore = 0;

let currentQuestion = 0;


// ==========================================
// START QUIZ
// ==========================================

function startQuiz() {

    quizScore = 0;

    currentQuestion = 0;

    showQuizQuestion();

}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuizQuestion() {

    const question =
        quizQuestions[currentQuestion];


    const quizContainer =
        document.getElementById("quizQuestion");


    quizContainer.innerHTML = `

        <h3>
            Question ${currentQuestion + 1}
            / ${quizQuestions.length}
        </h3>

        <p>
            <b>
                ${question.question}
            </b>
        </p>

        <div class="quiz-options">

            ${question.options.map(
                function (option, index) {

                    return `

                        <button
                            class="quiz-option"
                            data-index="${index}"
                        >
                            ${String.fromCharCode(65 + index)}.
                            ${option}
                        </button>

                    `;

                }
            ).join("")}

        </div>

    `;


    quizFeedback.innerHTML =
        "Choose an answer.";


    const options =
        quizContainer.querySelectorAll(
            ".quiz-option"
        );


    options.forEach(
        function (button) {

            button.addEventListener(
                "click",
                handleQuizAnswer
            );

        }
    );

}


// ==========================================
// CHECK ANSWER
// ==========================================

function handleQuizAnswer(event) {

    const selectedAnswer =
        Number(
            event.target.dataset.index
        );


    const correctAnswer =
        quizQuestions[currentQuestion].correct;


    const options =
        document.querySelectorAll(
            "#quizQuestion .quiz-option"
        );


    // Prevent multiple clicks

    options.forEach(
        function (button) {

            button.disabled = true;

        }
    );


    if (
        selectedAnswer ===
        correctAnswer
    ) {

        quizScore++;


        quizFeedback.innerHTML = `

            <h3>
                🎉 Correct!
            </h3>

            <p>
                Great job! Your answer is correct.
            </p>

        `;

    } else {

        quizFeedback.innerHTML = `

            <h3>
                ❌ Not quite!
            </h3>

            <p>
                The correct answer is:
                <b>
                    ${quizQuestions[currentQuestion]
                        .options[correctAnswer]}
                </b>
            </p>

        `;

    }


    setTimeout(
        function () {

            currentQuestion++;


            if (
                currentQuestion <
                quizQuestions.length
            ) {

                showQuizQuestion();

            } else {

                showQuizResult();

            }

        },
        1200
    );

}


// ==========================================
// FINAL QUIZ RESULT
// ==========================================

function showQuizResult() {

    const quizContainer =
        document.getElementById("quizQuestion");


    let message = "";


    if (quizScore === 3) {

        message =
            "Excellent quantum understanding! 🏆";

    } else if (quizScore === 2) {

        message =
            "Good understanding! Keep practicing. 💪";

    } else {

        message =
            "Keep learning and try the quiz again! 📚";

    }


    quizContainer.innerHTML = `

        <h2>
            🏆 Quiz Complete!
        </h2>

        <h3>
            Score:
            ${quizScore} / ${quizQuestions.length}
        </h3>

        <p>
            ${message}
        </p>

        <button
            id="restartQuiz"
            class="run-button"
        >
            🔄 Try Again
        </button>

    `;


    quizFeedback.innerHTML =
        "Assessment completed.";


    document
        .getElementById("restartQuiz")
        .addEventListener(
            "click",
            startQuiz
        );

}


// ==========================================
// START INITIAL QUIZ
// ==========================================

startQuiz();
// ==========================================
// QUANTUM ALGORITHM LIBRARY
// ==========================================





const algorithmDescription =
    document.getElementById("algorithmDescription");


// ==========================================
// LOAD SELECTED ALGORITHM
// ==========================================

loadAlgorithmButton.addEventListener(
    "click",
    function () {

        const algorithm =
            algorithmSelect.value;


        // No algorithm selected

        if (algorithm === "") {

            algorithmDescription.innerHTML = `

                <p>
                    ⚠️ Please select an algorithm first.
                </p>

            `;

            return;

        }


        // ==================================
        // BELL STATE
        // ==================================

        if (algorithm === "bell") {

            // Clear existing circuit

            circuitData.gates = [];


            // H on q0

            circuitData.gates.push({

                type: "h",

                qubit: 0

            });


            // CX q0 -> q1

            circuitData.gates.push({

                type: "cx",

                control: 0,

                target: 1

            });


            algorithmDescription.innerHTML = `

                <h3>
                    🔗 Bell State
                </h3>

                <p>
                    The Bell state demonstrates
                    quantum entanglement between
                    two qubits.
                </p>

                <p>
                    The circuit applies a Hadamard
                    gate to q₀ followed by a
                    Controlled-X gate.
                </p>

                <p>
                    Expected state:
                    <b>
                        (|00⟩ + |11⟩) / √2
                    </b>
                </p>

                <p>
                    Expected measurement:
                    approximately 50% |00⟩ and
                    50% |11⟩.
                </p>

            `;

        }


        // ==================================
        // SUPERPOSITION
        // ==================================

        else if (
            algorithm === "superposition"
        ) {

            // Clear existing circuit

            circuitData.gates = [];


            // H on q0

            circuitData.gates.push({

                type: "h",

                qubit: 0

            });


            algorithmDescription.innerHTML = `

                <h3>
                    🌊 Superposition
                </h3>

                <p>
                    The Hadamard gate creates a
                    superposition on q₀.
                </p>

                <p>
                    The qubit becomes a combination
                    of |0⟩ and |1⟩.
                </p>

                <p>
                    Expected probabilities:
                    approximately 50% |0⟩ and
                    50% |1⟩ for q₀.
                </p>

            `;

        }


        // ==================================
        // UPDATE CIRCUIT
        // ==================================

        displayCircuit();

        displayExplanation();

    }
);
// ==========================================
// QUANTUM STATE DISPLAY
// ==========================================

function displayQuantumState(statevector) {

    const quantumStateBox =
        document.getElementById("quantumState");

    if (
        !statevector ||
        statevector.length === 0
    ) {

        quantumStateBox.innerHTML =
            "No quantum state data received.";

        return;

    }


    let stateText = "";


    statevector.forEach(function (state) {

        const basisState =
            state.basis_state;

        const real =
            Number(state.real);

        const imaginary =
            Number(state.imaginary);


        // Ignore states with zero amplitude

        if (
            Math.abs(real) < 0.0001 &&
            Math.abs(imaginary) < 0.0001
        ) {

            return;

        }


        // Real-only amplitude

        if (
            Math.abs(imaginary) < 0.0001
        ) {

            stateText +=
                `${real.toFixed(3)}|${basisState}⟩ `;

        }


        // Imaginary-only amplitude

        else if (
            Math.abs(real) < 0.0001
        ) {

            stateText +=
                `${imaginary.toFixed(3)}i|${basisState}⟩ `;

        }


        // Complex amplitude

        else {

            stateText +=
                `(${real.toFixed(3)} + ${imaginary.toFixed(3)}i)|${basisState}⟩ `;

        }

    });


    if (stateText === "") {

        stateText =
            "Quantum state could not be represented.";

    }


    quantumStateBox.innerHTML = `

        <div class="quantum-state-display">

            <h3>
                |ψ⟩ =
            </h3>

            <p>
                ${stateText}
            </p>

        </div>

    `;

}
// ==========================================
// EXPLAIN MY MISTAKE ENGINE
// STEP 22A
// ==========================================
function analyzePredictionMistake(
    prediction,
    results,
    gates
) {

    const has00 =
        results["00"] !== undefined &&
        results["00"] > 0;

    const has01 =
        results["01"] !== undefined &&
        results["01"] > 0;

    const has10 =
        results["10"] !== undefined &&
        results["10"] > 0;

    const has11 =
        results["11"] !== undefined &&
        results["11"] > 0;


    // ------------------------------------------
    // Bell State mistake
    // ------------------------------------------

    if (
        prediction === "00-11" &&
        has00 &&
        has11
    ) {

        return {

            concept: "Bell State / Entanglement",

            explanation:
                "Your prediction matches the expected Bell-state outcomes.",

            recommendation:
                "Try the next quantum challenge."

        };

    }


    if (
        prediction === "00-11" &&
        (has01 || has10)
    ) {

        return {

            concept: "Controlled-X / Entanglement",

            explanation:
                "Your prediction expected |00⟩ and |11⟩, but the circuit produced other states. Check the control and target qubits of the CX gate.",

            recommendation:
                "Review Controlled-X gates and try building the Bell state again."

        };

    }


    // ------------------------------------------
    // Prediction of 00 + 01
    // ------------------------------------------

    if (
        prediction === "00-01" &&
        (has00 || has01)
    ) {

        return {

            concept: "Superposition / Qubit Correlation",

            explanation:
                "Your prediction expected |00⟩ and |01⟩. Check whether the circuit contains a controlled operation that correlates the two qubits.",

            recommendation:
                "Review how CX changes the target qubit based on the control qubit."

        };

    }


    // ------------------------------------------
    // Prediction of 00 + 10
    // ------------------------------------------

    if (
        prediction === "00-10" &&
        (has00 || has10)
    ) {

        return {

            concept: "Qubit State Transformation",

            explanation:
                "Your prediction expected |00⟩ and |10⟩. Review which qubit receives the Hadamard or other gate.",

            recommendation:
                "Review single-qubit gates and their effect on the circuit."

        };

    }


    // ------------------------------------------
    // All four states
    // ------------------------------------------

    if (prediction === "all") {

        const stateCount =
            [has00, has01, has10, has11]
                .filter(Boolean)
                .length;


        if (stateCount === 4) {

            return {

                concept: "Multi-State Superposition",

                explanation:
                    "Your prediction matched a circuit producing all four computational basis states.",

                recommendation:
                    "Try a more advanced quantum circuit."

            };

        }

    }

// ------------------------------------------
// Circuit-aware Bell State analysis
// ------------------------------------------

const hasHadamard =
    gates.some(
        gate =>
            gate.type === "h"
    );

const hasCX =
    gates.some(
        gate =>
            gate.type === "cx"
    );


if (
    hasHadamard &&
    hasCX &&
    prediction !== "00-11"
) {

    return {

        concept:
            "Bell State / Quantum Entanglement",

        explanation:
            "Your circuit contains a Hadamard gate followed by a Controlled-X gate. This combination creates correlations between the two qubits, so the expected Bell-state outcomes are |00⟩ and |11⟩.",

        recommendation:
            "Try predicting |00⟩ and |11⟩ for this circuit, then run the simulation again."

    };

}
    // ------------------------------------------
    // General fallback
    // ------------------------------------------

    return {

        concept: "Quantum Circuit Reasoning",

        explanation:
            "The observed result did not match your prediction. Examine the gates, their qubits, and the order in which they were applied.",

        recommendation:
            "Review the circuit step by step and try the prediction again."

    };

}
// ==========================================
// PERSONALIZED LEARNING RECOMMENDATION
// STEP 23A
// ==========================================

function generateLearningRecommendation(
    mistakeAnalysis,
    gates
) {
    // ==========================================
// PRIORITY: BELL STATE / ENTANGLEMENT
// ==========================================

const hasHadamard =
    gates.some(
        gate => gate.type === "h"
    );

const hasCX =
    gates.some(
        gate => gate.type === "cx"
    );

if (hasHadamard && hasCX) {

    return {

        topic:
            "Quantum Entanglement",

        activity:
            "Build a Bell state using H(q₀) followed by CX(q₀,q₁).",

        goal:
            "Understand how quantum entanglement creates correlated measurement outcomes."

    };

}

    const concept =
        mistakeAnalysis.concept;


    // Bell State / Entanglement
    if (
        concept.includes("Bell") ||
        concept.includes("Entanglement")
    ) {

        return {

            topic:
                "Quantum Entanglement",

            activity:
                "Build a Bell state using H(q₀) followed by CX(q₀,q₁).",

            goal:
                "Understand how two qubits become correlated."

        };

    }


    // Controlled-X
    if (
        concept.includes("Controlled-X")
    ) {

        return {

            topic:
                "Controlled-X Gate",

            activity:
                "Experiment with different control and target qubits.",

            goal:
                "Understand how the control qubit affects the target."

        };

    }


    // Superposition
    if (
        concept.includes("Superposition")
    ) {

        return {

            topic:
                "Quantum Superposition",

            activity:
                "Apply an H gate to a qubit and observe its state probabilities.",

            goal:
                "Understand how a qubit can exist in a combination of states."

        };

    }


    // General recommendation
    return {

        topic:
            "Quantum Circuit Reasoning",

        activity:
            "Build a simple circuit and predict its measurement outcomes before running it.",

        goal:
            "Improve your understanding of how quantum gates affect measurement."

    };

}
// ==========================================
// STUDENT LEARNING PROGRESS
// STEP 23C
// ==========================================

const learningProgress = {

    superposition: 0,

    entanglement: 0,

    measurement: 0

};
function displayLearningProgress() {

    const progressBox =
        document.getElementById(
            "learningProgress"
        );


    if (!progressBox) {
        return;
    }


    const overall =
        Math.round(
            (
                learningProgress.superposition +
                learningProgress.entanglement +
                learningProgress.measurement
            ) / 3
        );


    progressBox.innerHTML = `

        <div class="progress-item">

            <strong>
                🌊 Superposition
            </strong>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${learningProgress.superposition}%"
                ></div>

            </div>

            <span>
                ${learningProgress.superposition}%
            </span>

        </div>


        <div class="progress-item">

            <strong>
                🔗 Entanglement
            </strong>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${learningProgress.entanglement}%"
                ></div>

            </div>

            <span>
                ${learningProgress.entanglement}%
            </span>

        </div>


        <div class="progress-item">

            <strong>
                🎯 Measurement
            </strong>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${learningProgress.measurement}%"
                ></div>

            </div>

            <span>
                ${learningProgress.measurement}%
            </span>

        </div>


        <hr>

        <h3>
            🏆 Overall Mastery: ${overall}%
        </h3>

    `;

}
displayLearningProgress();
// ==========================================
// UPDATE STUDENT MASTERY
// STEP 23D
// ==========================================

function updateLearningMastery(
    concept,
    performance
) {

    if (!learningProgress.hasOwnProperty(concept)) {
        return;
    }


    // Increase mastery based on performance

    learningProgress[concept] =
        Math.min(
            100,
            learningProgress[concept] + performance
        );


    displayLearningProgress();

}
// ==========================================
// DETECT LEARNING CONCEPT
// ==========================================

function detectLearningConcept(gates) {

    const hasHadamard =
        gates.some(
            gate => gate.type === "h"
        );

    const hasCX =
        gates.some(
            gate => gate.type === "cx"
        );


    // H + CX = Entanglement

    if (
        hasHadamard &&
        hasCX
    ) {

        return "entanglement";

    }


    // H = Superposition

    if (hasHadamard) {

        return "superposition";

    }


    // Measurement-based activity

    return "measurement";

}