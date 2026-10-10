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

```
{
    name: "Mavis",
    destination: "Accra",
    date: "2026-10-10",
    time: "16:00",
    luggage: 1,
    status: "Looking for a buddy",
    message: "Looking for someone travelling to Accra."
},

{
    name: "Kojo",
    destination: "Kumasi",
    date: "2026-10-10",
    time: "17:15",
    luggage: 1,
    status: "Has a car and available space",
    message: "I may have space for other students."
}
```

];

let findButton = document.getElementById("find-button");
let destinationInput = document.getElementById("search-destination");
let searchTime = document.getElementById("search-time");
let matchList = document.getElementById("match-list");

findButton.addEventListener("click", function() {

```
let destination = destinationInput.value.toLowerCase();
let selectedMatchType = document.querySelector(
    'input[name="match-type"]:checked'
).value;

matchList.textContent = "";

let foundMatch = false;

for (let i = 0; i < travelPosts.length; i++) {

    let post = travelPosts[i];

    if (post.destination.toLowerCase() === destination) {

        if (selectedMatchType === "location") {

            displayMatch(post);
            foundMatch = true;

        } else if (selectedMatchType === "location-time") {

            if (post.time === searchTime.value) {

                displayMatch(post);
                foundMatch = true;
            }
        }
    }
}

if (foundMatch === false) {

    matchList.textContent =
        "No matching travel buddy found. You can post your trip instead.";
}
```

});

function displayMatch(post) {

```
let card = document.createElement("div");

card.className = "match-card";

card.textContent =
    "Name: " + post.name +
    " | Destination: " + post.destination +
    " | Time: " + post.time +
    " | Bags: " + post.luggage +
    " | Status: " + post.status +
    " | Message: " + post.message;

matchList.appendChild(card);
```

}
