//PAGE SWIPER
let currentPageIndex = 0;
const pages = ["ID", "Uniform", "Bunk", "Locker", "Data", "DataSent"];
//PASS/FAIL FUNCTIONALITY
let currentMainDiv = "Uniform"; // Tracks the current main div
let currentInspectionItem = ""; // Tracks the current inspection item

// Save and Restore Scroll Position
let savedScrollPosition = 0; // Variable to store the scroll position

function swipePage(direction) {
  // Hide the current page
  document.getElementById(pages[currentPageIndex]).style.display = "none";

  // Update the current page index
  currentPageIndex += direction;

  // Ensure the index stays within bounds
  if (currentPageIndex < 0) currentPageIndex = 0;
  if (currentPageIndex >= pages.length) currentPageIndex = pages.length - 1;

  // Update the currentMainDiv to the new page
  currentMainDiv = pages[currentPageIndex];
  console.log(`Swiped to page: ${currentMainDiv}`); // Debug log

  // Show the new page
  document.getElementById(pages[currentPageIndex]).style.display = "block";

  // Reset the scroll position to the top of the new page
  const scrollableContainer = document.querySelector("#pages");
  if (scrollableContainer) {
    scrollableContainer.scrollTop = 0;
  } else {
    window.scrollTo(0, 0);
  }
}



function saveScrollPosition() {
  const scrollableContainer = document.querySelector("#pages");
  if (scrollableContainer) {
    savedScrollPosition = scrollableContainer.scrollTop;
  } else {
    savedScrollPosition = window.scrollY;
  }
  console.log(`Saved scroll position: ${savedScrollPosition}`); // Debug log
}

function restoreScrollPosition() {
  const scrollableContainer = document.querySelector("#pages");
  setTimeout(() => {
    if (scrollableContainer) {
      scrollableContainer.scrollTop = savedScrollPosition;
    } else {
      window.scrollTo(0, savedScrollPosition);
    }
    console.log(`Restored scroll position: ${savedScrollPosition}`); // Debug log
  }, 0);
}

// Navigate to the shared Pass/Fail page
function goToPassFailPage(item, skipReasons = false) {
  currentInspectionItem = item;

  // Save the current main div (the page where the button was clicked)
  const activeButton = document.querySelector(`button[onclick="goToPassFailPage('${item}', ${skipReasons})"]`);
  if (activeButton) {
    const parentDiv = activeButton.closest("div[id]");
    if (parentDiv) {
      currentMainDiv = parentDiv.id; // Update the currentMainDiv to the parent div's ID
    }
  }

  console.log(`Navigating to PassFailPage for: ${item}`);
  console.log(`Current main div: ${currentMainDiv}`);

  // Hide all main divs
  const mainDivs = document.querySelectorAll("#pages > div");
  mainDivs.forEach((div) => {
    div.style.display = "none";
  });

  // Show the Pass/Fail page
  document.getElementById("PassFailPage").style.display = "block";
  document.getElementById("inspection-title").innerText = `Inspecting: ${item}`;

  // If skipReasons is true, update the "Fail" button to directly mark fail
  const failButton = document.getElementById("fail-button");
  if (skipReasons) {
    failButton.onclick = () => markFailDirect();
  } else {
    failButton.onclick = () => goToFailReasonsPage();
  }
}

// Mark as Pass
function markPass() {
  console.log(`Marking PASS for: ${currentInspectionItem}`);
  console.log(`Returning to main div: ${currentMainDiv}`);

  // Hide the Pass/Fail page
  document.getElementById("PassFailPage").style.display = "none";

  // Show the main div
  document.getElementById(currentMainDiv).style.display = "block";

  // Restore the scroll position
  restoreScrollPosition();

  // Add green "PASS" text to the pass-fail container
  const passFailContainer = document.getElementById(`pass-fail-${currentInspectionItem}`);
  if (passFailContainer) {
    passFailContainer.innerText = "PASS";
    passFailContainer.style.color = "green";
  }
}

// Mark as Fail Directly
function markFailDirect() {
  console.log(`Marking FAIL for: ${currentInspectionItem}`);
  console.log(`Returning to main div: ${currentMainDiv}`);

  // Hide the Pass/Fail page
  document.getElementById("PassFailPage").style.display = "none";

  // Show the main div
  document.getElementById(currentMainDiv).style.display = "block";

  // Restore the scroll position
  restoreScrollPosition();

  // Add red "FAIL" text to the pass-fail container
  const passFailContainer = document.getElementById(`pass-fail-${currentInspectionItem}`);
  if (passFailContainer) {
    passFailContainer.innerText = "FAIL";
    passFailContainer.style.color = "red";
  }
}

// Fail Reasons Page
function goToFailReasonsPage() {
  // Hide the Pass/Fail page
  document.getElementById("PassFailPage").style.display = "none";

  // Show the Fail Reasons page
  const failReasonsPage = document.getElementById("FailReasonsPage");
  failReasonsPage.style.display = "block";

  // Clear existing fail reasons
  failReasonsPage.innerHTML = "<h1>Fail Reasons</h1>";

  // Get the fail reasons for the current inspection item
  const reasons = failReasons[currentInspectionItem] || ["No reasons available"];

  // Dynamically create buttons for each fail reason
  reasons.forEach((reason) => {
    const button = document.createElement("button");
    button.className = "reason-button";
    button.innerText = reason;
    button.type="button";
    button.onclick = () => markFail(reason); // Pass the reason to the markFail function
    failReasonsPage.appendChild(button);
  });
}

// Mark as Fail with a Reason
function markFail(reason) {
  // Hide the Fail Reasons page
  document.getElementById("FailReasonsPage").style.display = "none";

  // Show the main div
  document.getElementById(currentMainDiv).style.display = "block";

  // Restore the scroll position
  restoreScrollPosition();

  // Add red "FAIL: (reason)" text to the pass-fail container
  const passFailContainer = document.getElementById(`pass-fail-${currentInspectionItem}`);
  if (passFailContainer) {
    passFailContainer.innerText = `FAIL: (${reason})`;
    passFailContainer.style.color = "red";
  }
}

// 
const failReasons = {
  "Cover": ["Strings, Not Parallel"],
  "Hair": ["Touches Ears", "Touches Collar", "Loose/Flyaways"],
  "Shave/Cosmetics": ["Shaving", "Cosmetics"],
  "Insignia": ["Not Parallel", "Not Centered", "Distance"],
  "Patches/Tapes": ["Distance", "Not Present"],
  "Blouse": ["Iron", "Strings", "Pockets"],
  "Belt" : ["Not Present", "Not Centered"],
  "Trousers": ["Iron", "Strings", "Pockets"],
  "Boots": ["Shine", "Laces"],
  "Attention" : ["Eyes", "Hands", "Grounded/Heels"],
  "Pillow" : ["Centered", "Flush", "Tight"],
  "Luggage" : ["Grounded", "Centered", "Straps"],
  "Shelf" : ["Items", "Door"],
  "PT Shoes" : ["Laces", "Centered", "Flush"],
   "Sleeping Bag" : ["Zipped", "Centered", "Bulges"]
};

//FORM
const scriptURL = 'https://script.google.com/macros/s/AKfycbwebNi6Rq2LmMma45YuqhcXKfeGs4CvSoATZ6zwJgpcICcafibavLoJb5LSM8TCy5YZ/exec'
const form = document.forms['submit-to-google-sheet']

form.addEventListener('submit', e => {
  e.preventDefault();

  // Prepare the form data
  prepareFormData();

  // Log the FormData being sent
  const formData = new FormData(form);
  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} = ${value}`);
  }

  // Submit the form using fetch
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => response.json())
    .then(data => console.log('Success!', data))
    .catch(error => console.error('Error!', error.message));
});

// Function to filter inspection buttons based on the selected inspection type
function filterItemsByInspectionType() {
  const inspectionType = document.getElementById("inspection-type").value; // Get the selected value
  const allButtons = document.querySelectorAll(".inspection-button"); // Get all inspection buttons
  const allPassFailContainers = document.querySelectorAll(".pass-fail-container"); // Get all pass/fail containers

  // Define which buttons and pass/fail boxes should be visible for each inspection type
  const visibilityMap = {
    ABU: ["Cover", "Hair", "Shave/Cosmetics", "Insignia", "Patches/Tapes", "Blouse", "Belt", "Gig Line", "Trousers", "Boot Blousing", "Boots", "Attention", "Sheet", "Cuff", "Blanket", "Hospital Corners", "Pillow", "Mattress", "Canteen", "Footwear", "Luggage", "Bed Frame", "Shelf/Cover", "Hangers", "Towel", "Blouse (Blues)", "Trousers (Blues)", "Shoes (Blues)", "Locker"],
    Blues: ["Cover", "Hair", "Shave/Cosmetics", "Insignia", "Accoutrements", "Blouse", "Belt", "Gig Line", "Trousers", "Shoes", "Attention", "Sheet", "Cuff", "Blanket", "Hospital Corners", "Pillow", "Mattress", "Canteen", "Footwear", "Luggage", "Bed Frame", "Shelf/Cover", "Hangers", "Towel", "Blouse (ABU)", "Trousers (ABU)", "Boots (ABU)", "Locker"],
    PT: ["Cover", "Hair", "Shave/Cosmetics", "Insignia", "Patches/Tapes", "Blouse", "Belt", "Gig Line", "Trousers", "Boot Blousing", "Boots", "Attention", "Pillow", "Sleeping Bag", "Mattress", "Canteen", "Footwear", "Shower Shoes", "Luggage", "Bed Frame", "Shelf", "Hangers", "PT Shirt", "PT Pants", "PT Shoes", "Locker"],
  };

  // Hide all buttons and pass/fail containers initially
  allButtons.forEach((button) => {
    button.style.display = "none";
  });
  allPassFailContainers.forEach((container) => {
    container.style.display = "none";
  });

  // Show buttons and their corresponding pass/fail containers based on the selected inspection type
  const visibleItems = visibilityMap[inspectionType] || [];
  visibleItems.forEach((item) => {
    const button = document.querySelector(`button[onclick*="goToPassFailPage('${item}'"]`);
    const container = document.getElementById(`pass-fail-${item}`);
    if (button) {
      button.style.display = "block";
    }
    if (container) {
      container.style.display = "block";
    }
  });
}

// Call filterItemsByInspectionType on page load to set ABU as the default
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("inspection-type").value = "ABU"; // Set ABU as the default value
  filterItemsByInspectionType(); // Apply the filter immediately
});

function prepareFormData() {
  const form = document.forms['submit-to-google-sheet'];

  // Remove any existing hidden inputs for pass-fail data
  const existingInputs = form.querySelectorAll('.pass-fail-input');
  existingInputs.forEach(input => input.remove());

  // Find all pass-fail-container elements
  const passFailContainers = document.querySelectorAll('.pass-fail-container');

  passFailContainers.forEach(container => {
    const id = container.id.replace('pass-fail-', ''); // Remove the "pass-fail-" prefix
    const value = container.textContent.trim(); // Get the text content

    if (value) {
      // Create a hidden input
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = id; // Use the cleaned ID as the input name
      input.value = value;
      input.classList.add('pass-fail-input'); // Add a class for easy removal later

      // Append the hidden input to the form
      form.appendChild(input);

      // Log the created input for debugging
      console.log(`Created hidden input: name=${input.name}, value=${input.value}`);
    }
  });
}
