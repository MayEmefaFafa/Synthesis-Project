
"use strict";

// ======================================
// 1. SAMPLE TRIP POSTS
// ======================================

let travelPosts = [
    {
        name: "Ama",
        destination: "Kumasi",
        date: "2026-10-10",
        time: "17:00",
        luggage: 2,
        status: "Looking for a buddy",
        message: "I am leaving campus after classes."
    },
    {
        name: "Kojo",
        destination: "Kumasi",
        date: "2026-10-10",
        time: "17:15",
        luggage: 1,
        status: "Has a car and available space",
        message: "I may have space for other students."
    },
    {
        name: "Mavis",
        destination: "Accra",
        date: "2026-10-10",
        time: "16:00",
        luggage: 1,
        status: "Looking for a buddy",
        message: "Looking for someone travelling to Accra."
    }
];


// ======================================
// 2. GET HTML ELEMENTS
// ======================================

const tripForm = document.getElementById("trip-form");
const searchForm = document.getElementById("search-form");
const matchList = document.getElementById("match-list");
const postFeedback = document.getElementById("post-feedback");

const searchTime = document.getElementById("search-time");
const searchTimeContainer =
    document.getElementById("search-time-container");


// ======================================
// 3. CONVERT TIME TO MINUTES
// ======================================

function timeToMinutes(time) {
    const parts = time.split(":");

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    return hours * 60 + minutes;
}


// ======================================
// 4. CHECK WHETHER TWO TRIPS MATCH
// ======================================

function tripsMatch(firstTrip, secondTrip, matchType) {

    const sameDestination =
        firstTrip.destination.trim().toLowerCase() ===
        secondTrip.destination.trim().toLowerCase();

    const sameDate = firstTrip.date === secondTrip.date;

    // Destination and date must always match.
    if (!sameDestination || !sameDate) {
        return false;
    }

    // Location Only does not consider departure time.
    if (matchType === "location") {
        return true;
    }

    // Location + Time requires both trips to have times.
    if (!firstTrip.time || !secondTrip.time) {
        return false;
    }

    const firstTime = timeToMinutes(firstTrip.time);
    const secondTime = timeToMinutes(secondTrip.time);

    const difference = Math.abs(firstTime - secondTime);

    // Account for times close to midnight.
    const timeDifference = Math.min(difference, 1440 - difference);

    return timeDifference <= 30;
}


// ======================================
// 5. DISPLAY MATCH CARDS
// ======================================

function displayMatches(matches) {

    // Clear results from the previous search.
    matchList.innerHTML = "";

    // Display a message when there are no matches.
    if (matches.length === 0) {
        const message = document.createElement("p");

        message.className = "empty-state";
        message.textContent =
            "No potential matches found. You can post your trip instead.";

        const postLink = document.createElement("a");

        postLink.href = "#post-trip";
        postLink.textContent = "Post your trip";

        matchList.appendChild(message);
        matchList.appendChild(postLink);

        return;
    }

    // Create one card for each matching trip.
    matches.forEach(function (post) {

        const card = document.createElement("article");
        card.className = "match-card";

        const heading = document.createElement("h3");
        heading.textContent = post.name;

        const destination = document.createElement("p");
        destination.textContent = "Destination: " + post.destination;

        const date = document.createElement("p");
        date.textContent = "Travel date: " + post.date;

        const time = document.createElement("p");
        time.textContent = "Departure time: " + post.time;

        const luggage = document.createElement("p");
        luggage.textContent = "Luggage items: " + post.luggage;

        const status = document.createElement("p");
        status.textContent = "Travel status: " + post.status;

        const message = document.createElement("p");
        message.textContent = "Message: " + post.message;

        card.appendChild(heading);
        card.appendChild(destination);
        card.appendChild(date);
        card.appendChild(time);
        card.appendChild(luggage);
        card.appendChild(status);
        card.appendChild(message);

        matchList.appendChild(card);
    });
}


// ======================================
// 6. POST A NEW TRIP
// ======================================

tripForm.addEventListener("submit", function (event) {

    // Stop the browser from reloading the page.
    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    const destination =
        document.getElementById("destination").value.trim();

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const luggageInput = document.getElementById("luggage");
    const luggage = Number(luggageInput.value);

    const message =
        document.getElementById("message").value.trim();

    const selectedStatus =
        document.querySelector('input[name="travel-status"]:checked');

    // Check that a travel status has been selected.
    if (!selectedStatus) {
        postFeedback.textContent =
            "Please select your travel situation.";
        return;
    }

    // Validate the required information.
    if (
        !name ||
        !destination ||
        !date ||
        !time ||
        luggageInput.value === "" ||
        !Number.isInteger(luggage) ||
        luggage < 0
    ) {
        postFeedback.textContent =
            "Please enter valid information in all required fields.";
        return;
    }

    let status;

    if (selectedStatus.value === "car") {
        status = "Has a car and available space";
    } else {
        status = "Looking for a buddy";
    }

    // Create an object containing the new trip.
    const newPost = {
        name: name,
        destination: destination,
        date: date,
        time: time,
        luggage: luggage,
        status: status,
        message: message || "No additional message."
    };

    // Find potential matches among existing posts first.
    const potentialMatches = travelPosts.filter(function (post) {
        return tripsMatch(newPost, post, "location-time");
    });

    // Store the new trip in the shared array.
    travelPosts.push(newPost);

    // Show the matches to the student who posted.
    displayMatches(potentialMatches);

    if (potentialMatches.length > 0) {
        postFeedback.textContent =
            "Trip posted successfully! Found " +
            potentialMatches.length +
            " potential match(es).";
    } else {
        postFeedback.textContent =
            "Trip posted successfully! No potential matches yet.";
    }

    // Clear the form after a successful submission.
    tripForm.reset();
});


// ======================================
// 7. FIND A BUDDY
// ======================================

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const destination =
        document.getElementById("search-destination").value.trim();

    const date = document.getElementById("search-date").value;

    const selectedMatchType =
        document.querySelector('input[name="match-type"]:checked');

    if (!destination || !date) {
        displayMatches([]);

        return;
    }

    if (!selectedMatchType) {
        displayMatches([]);

        return;
    }

    const matchType = selectedMatchType.value;
    const preferredTime = searchTime.value;

    // Time is required only for Location + Time.
    if (matchType === "location-time" && !preferredTime) {
        searchTime.setCustomValidity(
            "Please select a departure time for Location + Time matching."
        );

        searchTime.reportValidity();
        return;
    }

    searchTime.setCustomValidity("");

    // Create a temporary object containing the search details.
    const searchTrip = {
        destination: destination,
        date: date,
        time: matchType === "location-time" ? preferredTime : ""
    };

    // Find all posts that satisfy the selected matching rules.
    const matches = travelPosts.filter(function (post) {
        return tripsMatch(searchTrip, post, matchType);
    });

    // Display the matching trips.
    displayMatches(matches);
});


// ======================================
// 8. SHOW OR HIDE THE TIME FIELD
// ======================================

function updateTimeField() {

    const selectedMatchType =
        document.querySelector('input[name="match-type"]:checked');

    const useTime =
        selectedMatchType &&
        selectedMatchType.value === "location-time";

    searchTimeContainer.classList.toggle("hidden", !useTime);

    searchTime.required = Boolean(useTime);

    if (!useTime) {
        searchTime.setCustomValidity("");
    }
}

// Update the time field when the user changes their preference.
document.querySelectorAll('input[name="match-type"]').forEach(
    function (radio) {
        radio.addEventListener("change", updateTimeField);
    }
);

// Set the correct initial appearance.
updateTimeField();