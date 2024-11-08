const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];

// Patient Add Function
function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if (name && gender && age && condition) {
        // Add Patient
        patients.push({ name, gender: gender.value, age, condition });
        // Reset Form
        resetForm();
        // Report Genration
        generateReport();
    }

}

// Reset Form Function
function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}


// Search Health Condition Informations
function searchCondition() {
    // Retrieves the value entered in the input fiels
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Initiate Fetch Sequence
    fetch('health_analysis.json')
        // Convert to JSON Format
        .then(response => response.json())
        // Parse the retrieved JSON Data
        .then(data => {
            // Initiate Search
            const condition = data.conditions.find(item => item.name.toLowerCase() === input);

            if (condition) {
                const symptoms = condition.symptoms.join(", ");
                const prevention = condition.prevention.join(", ");
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
            } else {
                resultDiv.innerHTML = 'Condition not found.';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            resultDiv.innerHTML = 'An error occurred while fetching data.';
        });
};

btnSearch.addEventListener('click', searchCondition);

// Report Generation Function
function generateReport() {
    // Total numbers of patients in patients[]
    const numPatients = patients.length;

    // initializing counters for specific medical conditions 
    // (Diabetes, Thyroid, High Blood Pressure), initially set to zero.
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    // gender-specific condition counters ( male and female) for each medical condition
    // also initialized to zero for each condition
    const genderConditionsCount = {
        Male: {
              Diabetes: 0,
              Thyroid: 0,
              "High Blood Pressure": 0,
            },
        Female: {
              Diabetes: 0,
              Thyroid: 0,
              "High Blood Pressure": 0,
            },
    };

    for (const patient of patients) {
        // Increments the count for each patient's specific medical condition
        conditionsCount[patient.condition]++;
        // Increases the count of each medical condition within the respective gender category
        genderConditionsCount[patient.gender][patient.condition]++;
    };

    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    };

    report.innerHTML += `<br>Gender-Based Condtions:<br>`;
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        };
    };
};

addPatientButton.addEventListener("click", addPatient);