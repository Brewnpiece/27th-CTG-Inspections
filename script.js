//PAGE SWIPER
let currentPageIndex = 0;
const pages = ["ID", "Uniform", "Bunk", "Locker", "Data", "DataSent"];
let previousPageId = null;
let inspectionResults = {};

function swipePage(direction) {
  // Hide the current page
  document.getElementById(pages[currentPageIndex]).style.display = "none";

  // Update the current page index
  currentPageIndex += direction;

  // Ensure the index stays within bounds
  if (currentPageIndex < 0) currentPageIndex = 0;
  if (currentPageIndex >= pages.length) currentPageIndex = pages.length - 1;

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

//PASS/FAIL FUNCTIONALITY
let currentMainDiv = "Uniform"; // Tracks the current main div
let currentInspectionItem = ""; // Tracks the current inspection item

// Save and Restore Scroll Position
let savedScrollPosition = 0; // Variable to store the scroll position

function saveScrollPosition() {
  const scrollableContainer = document.querySelector("#pages");
  if (scrollableContainer) {
    savedScrollPosition = scrollableContainer.scrollTop;
  } else {
    savedScrollPosition = window.scrollY;
  }
}

function restoreScrollPosition() {
  const scrollableContainer = document.querySelector("#pages");
  setTimeout(() => {
    if (scrollableContainer) {
      scrollableContainer.scrollTop = savedScrollPosition;
    } else {
      window.scrollTo(0, savedScrollPosition);
    }
  }, 0);
}

// Navigate to the shared Pass/Fail page
function goToPassFailPage(itemName) {
  // Store the current inspection item
  currentInspectionItem = itemName;

  // Hide all pages
  const pages = ['ID', 'Uniform', 'Bunk', 'Locker', 'Data'];
  pages.forEach(page => {
    document.getElementById(page).style.display = 'none';
  });

  // Show the PassFailPage
  document.getElementById('PassFailPage').style.display = 'block';
  document.getElementById('inspection-title').innerText = itemName;
}

// Mark as Pass
function markPass() {
  if (currentInspectionItem) {
    // Update the pass-fail container with "Pass"
    const containerId = `pass-fail-${currentInspectionItem}`;
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<span style="color: green;">Pass</span>';
    }

    // Record the result as "Pass"
    inspectionResults[currentInspectionItem] = "Pass";
  }

  // Hide the PassFailPage
  document.getElementById('PassFailPage').style.display = 'none';

  // Show the previous page
  if (previousPageId) {
    document.getElementById(previousPageId).style.display = 'block';
  } else {
    document.getElementById('ID').style.display = 'block';
  }
}

// Mark as Fail Directly
function markFailDirect() {
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
  "Sheet" : ["Bulges", "Wrinkles", "Tuck"]
};

//FORM
const scriptURL = ''
const form = document.forms['submit-to-google-sheet']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => console.log('Success!', response))
    .catch(error => console.error('Error!', error.message))
})

// Function to filter inspection buttons based on the selected inspection type
function filterItemsByInspectionType() {
  const inspectionType = document.getElementById("inspection-type").value; // Get the selected value
  const allButtons = document.querySelectorAll(".inspection-button"); // Get all inspection buttons
  const allPassFailContainers = document.querySelectorAll(".pass-fail-container"); // Get all pass/fail containers

  // Define which buttons and pass/fail boxes should be visible for each inspection type
  const visibilityMap = {
    ABU: ["Cover", "Hair", "Shave/Cosmetics", "Insignia", "Patches/Tapes", "Blouse", "Belt", "Gig Line", "Trousers", "Boot Blousing", "Boots", "Attention", "Sheet", "Cuff", "Blanket", "Hospital Corners", "Pillow", "Mattress", "Canteen", "Footwear", "Luggage", "Bed Frame", "Shelf/Cover", "Hangers", "Towel", "Blouse (Blues)", "Trousers (Blues)", "Shoes (Blues)", "Locker"],
    Blues: ["Cover", "Hair", "Shave/Cosmetics", "Insignia", "Accoutrements", "Blouse", "Belt", "Gig Line", "Trousers", "Shoes", "Attention", "Sheet", "Cuff", "Blanket", "Hospital Corners", "Pillow", "Mattress", "Canteen", "Footwear", "Luggage", "Bed Frame", "Shelf/Cover", "Hangers", "Towel", "Blouse (ABU)", "Trousers (ABU)", "Boots (ABU)", "Locker"],
    PT: ["Cover", "Hair", "Shave/Cosmetics", "Insignia", "Patches/Tapes", "Blouse", "Belt", "Gig Line", "Trousers", "Boot Blousing", "Boots", "Attention", "Pillow", "Sleeping Bag", "Mattress", "Canteen", "Footwear", "Shower Shoes", "Luggage", "Bed Frame", "Shelf/Cover", "Shelf", "Hangers", "PT Shirt", "PT Pants", "PT Shoes", "Locker"],
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

// Fail button logic
document.getElementById('fail-button').onclick = function () {
  if (currentInspectionItem) {
    // Update the pass-fail container with "Fail"
    const containerId = `pass-fail-${currentInspectionItem}`;
    const container = document.getElementById(containerId);
    if (container) {
      const reason = prompt(`Why did "${currentInspectionItem}" fail?`);
      container.innerHTML = `<span style="color: red;">Fail</span>${reason ? `: ${reason}` : ''}`;
    }

    // Record the result as "Fail"
    inspectionResults[currentInspectionItem] = reason ? `Fail: ${reason}` : "Fail";
  }

  // Hide the PassFailPage
  document.getElementById('PassFailPage').style.display = 'none';

  // Show the previous page
  if (previousPageId) {
    document.getElementById(previousPageId).style.display = 'block';
  } else {
    document.getElementById('ID').style.display = 'block';
  }
};
