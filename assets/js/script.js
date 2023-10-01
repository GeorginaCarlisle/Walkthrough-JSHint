const API_KEY = "HYkIpK3AyvrBJteAhBGNNfjSC5U";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// Clicking the get Status button

/**
 * Called by event listener on the status button
 * Connects to API with URL including key
 * Awaits response and if response ok calls display status function passing returned data
 * Else throws an error 
 */
async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}
/**
 * Called by the getStatus function and passed returned data
 * Displays data in the modal
 */
function displayStatus(data) {

    const title = document.getElementById("resultsModalTitle");
    title.innerText = "API Key Status";

    const body = document.getElementById("results-content");
    body.innerHTML = `
    <p>Your key is valid until</p>
    <p>${data.expiry}</p>
    `;
    
    resultsModal.show();
}


// Clicking the submit button on the form

/**
 * Called by event listener on the submit button
 * Calls processOptions function to obtain data from the form
 * Sends form using POST
 * Awaits response and if response ok calls displayErrors function
 * Else throws an error
 */
async function postForm(e) {
    const form = processOptions (new FormData(document.getElementById("checksform")));
    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form,
                        });
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
    
}

/**
 * Called by postForm function and passed form data
 * Takes all instances of option key value pairs and converts into a single option 
 * with a value that contains all values found in a string with each value separated by a comma
 */
function processOptions(form) {
    let optArray = [];

    for (let e of form.entries()) {
        if (e[0] === "options") {
            optArray.push(e[1]);
        }
    }

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

/**
 * Called by postForm function and passed returned data
 * Displays data in the modal
 */
function displayErrors(data) {

    const title = document.getElementById("resultsModalTitle");
    title.innerText = `JSHint Results for ${data.file}`;


    if (data.total_errors === 0) {
        results = `<div class="no_errors">no errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    const body = document.getElementById("results-content");
    body.innerHTML = results;

    resultsModal.show();
}