// Toggle the visibility of information about the program
function hideAdditionalInfo() {
  // Hide info if shown. Show if hidden
  const x = document.getElementById("additionalInfo");
  x.hidden = !x.hidden;

  // Change text on button (show <-> hide)
  const y = document.getElementById("hideAdditionalInfoButton");
  if (y.classList.contains("info-hidden")) {
    y.innerText = "Hide additional information about courses and study program";
    y.classList.replace("info-hidden", "info-shown");
  } else {
    y.innerText = "Show additional information about courses and study program";
    y.classList.replace("info-shown", "info-hidden");
  }
}

function hideInfo() {
  const mainContentChildNodes =
    document.getElementsByClassName("main-content")[0].childNodes;

  // Button for hiding course information
  const hideAdditionalInfoButton = document.createElement("BUTTON");
  hideAdditionalInfoButton.id = "hideAdditionalInfoButton";
  hideAdditionalInfoButton.innerText =
    "Show additional information about courses and study program";
  hideAdditionalInfoButton.className = "btn btn-primary info-hidden";
  hideAdditionalInfoButton.onclick = hideAdditionalInfo;
  mainContentChildNodes[0].after(hideAdditionalInfoButton);

  // Wrap the information inside a div that can be `hidden="true"`
  const additionalInfoDiv = document.createElement("DIV");
  additionalInfoDiv.id = "additionalInfo";
  additionalInfoDiv.hidden = "true";

  mainContentChildNodes[2].before(additionalInfoDiv);

  // Fill the div with elements with the information
  while (true) {
    const x = mainContentChildNodes[4];
    if (x.tagName == "FORM") {
      break;
    }
    additionalInfoDiv.append(x);
  }
}

// Toggle the visibility of winter and summer semesters
function switchSemesters() {
  const semesterSwitch = document.getElementById("semesterSwitch");
  const semesterSwitchButton = document.getElementById("semesterSwitchButton");

  // Change text on button and title (winter <-> summer)
  if (semesterSwitch.innerText.toLowerCase() == "summer semester") {
    semesterSwitch.innerText = "Winter semester";
    semesterSwitchButton.innerText = "Switch to summer semester";
  } else {
    semesterSwitch.innerText = "Summer semester";
    semesterSwitchButton.innerText = "Switch to winter semester";
  }

  // Hide the shown semester, show the hidden one
  const tables = document.getElementsByClassName("classTable");
  for (const table of tables) {
    table.hidden = !table.hidden;
  }
}

// To make each new table have a unique ID
let staticTableID = 0;

// Create a table and populate it with one type of course (Ex. Compulsory in winter)
function createTable(origoTable) {
  const table = document.createElement("TABLE");
  const tableBody = document.createElement("TBODY");

  table.id = "table" + staticTableID;
  table.className = "table table-bordered table-middle classTable";

  const origoTableText = origoTable
    .getElementsByTagName("TR")[1]
    .innerText.toLowerCase();

  if (
    origoTableText.includes("letní semestr") ||
    origoTableText.includes("summer semester")
  ) {
    table.className += " summer";
    table.hidden = "true";
  } else {
    table.className += " winter";
  }
  table.append(tableBody);

  staticTableID += 1;

  return table;
}

// Cut up original big table into multiple smaller ones with relevent courses in each
function splitTables(origoTable) {
  // While there are courses to fill new tables with
  while (origoTable.getElementsByTagName("TD").length > 2) {
    const table = createTable(origoTable);
    const tableBody = table.getElementsByTagName("TBODY")[0];

    origoTable.before(table);

    const origoTableChildren =
      origoTable.getElementsByTagName("TBODY")[0].children;

    // Go until class changes, which happens at the end of one type of course
    let trClass = "";
    while (true) {
      // Skip first or second child, since it is a semester title
      let nextChild = origoTableChildren[1];
      if (table.className.includes("summer")) {
        nextChild = origoTableChildren[2];
      }

      // Break if next course type has been reached
      if (!nextChild || (trClass != "" && trClass != nextChild.className)) {
        break;
      }

      // Switch order of table description
      // Simply my preference, but since I have the power to do this, why not :)
      const nextNextChild = nextChild.nextElementSibling;
      if (
        nextChild.getElementsByTagName("TH").length > 1 &&
        nextNextChild &&
        nextNextChild.className == ""
      ) {
        nextChild = nextNextChild;
      }

      tableBody.append(nextChild);

      trClass = nextChild.className;
    }
  }
  origoTable.remove();
}

// Sort a table `tableID` based on column `column` with that column's header `th`
function sortTable(th, tableID, column) {
  // Get sort order
  let order = "asc";
  if (th.classList.contains("orderAsc")) {
    th.classList.replace("orderAsc", "orderDesc");
    order = "desc";
  } else if (th.classList.contains("orderDesc")) {
    th.classList.replace("orderDesc", "orderAsc");
  } else {
    th.className += " orderAsc";
  }

  const rows = document.getElementById(tableID).getElementsByTagName("TR");

  let switching = true;
  while (switching) {
    switching = false;

    let courses = false;
    for (let i = 0; i < rows.length - 1; i++) {
      if (courses == false) {
        if (rows[i].contains(th)) {
          courses = true;
        }
        continue;
      }

      if (
        order == "asc" &&
        rows[i].getElementsByTagName("TD")[column].innerText >
          rows[i + 1].getElementsByTagName("TD")[column].innerText
      ) {
        rows[i].before(rows[i + 1]);
        switching = true;
      } else if (
        order == "desc" &&
        rows[i].getElementsByTagName("TD")[column].innerText <
          rows[i + 1].getElementsByTagName("TD")[column].innerText
      ) {
        rows[i + 1].after(rows[i]);
        switching = true;
      }
    }
  }
}

// Wrap table headers in <a> tags with function to sort based on that column
function addTableSorters() {
  const tables = document.getElementsByClassName("classTable");
  for (let i = 0; i < tables.length; i++) {
    const ths = tables[i].getElementsByTagName("TH");
    for (let ii = 0; ii < ths.length; ii++) {
      const a = document.createElement("A");
      a.onclick = () => {
        sortTable(ths[ii], "table" + i, ii);
      };
      ths[ii].append(a);
      a.append(ths[ii].getElementsByTagName("SPAN")[0]);
    }
  }
}

function filterCourses() {
  const filterString = document
    .getElementById("filterInput")
    .value.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const trs = document.getElementsByTagName("TR");

  for (const tr of trs) {
    if (!tr.parentElement.parentElement.classList.contains("classTable")) {
      continue;
    }
    if (tr.className == "") {
      continue;
    }

    if (
      tr.innerText
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(filterString)
    ) {
      if (!tr.classList.contains("fullHidden")) {
        tr.hidden = false;
      }
      tr.classList.remove("filtered");
    } else {
      if (!tr.classList.contains("fullHidden")) {
        tr.hidden = true;
      }
      tr.classList.add("filtered");
    }
  }
}

let fullHidden = false;

function hideFull() {
  const trs = document.getElementsByTagName("TR");

  for (const tr of trs) {
    if (
      tr.innerHTML.includes("Předmět má naplněnou kapacitu") ||
      tr.innerHTML.includes("The course capacity is full")
    ) {
      if (fullHidden) {
        if (!tr.classList.contains("filtered")) {
          tr.hidden = false;
        }
        tr.classList.remove("fullHidden");
      } else {
        if (!tr.classList.contains("filtered")) {
          tr.hidden = true;
        }
        tr.classList.add("fullHidden");
      }
    }
  }
  fullHidden = !fullHidden;
}

// Button to switch the current visible semester
function createSwitchAndFilter() {
  //
  //    div
  //                                 div2                              div3
  //    button                       label      checkbox               label2  input
  //    Switch semester              Hide full: |_|                    Filter: _______________
  //
  const div = document.createElement("DIV");
  const div2 = document.createElement("DIV");
  const div3 = document.createElement("DIV");
  const label = document.createElement("LABEL");
  const checkbox = document.createElement("INPUT");
  const input = document.createElement("INPUT");
  const label2 = document.createElement("LABEL");
  const button = document.createElement("BUTTON");

  div.style = "display: flex";

  div2.align = "center";
  div2.style = "width: 100%";

  div3.align = "right";
  div3.style = "width: 100%";

  button.id = "semesterSwitchButton";
  button.className = "btn btn-secondary";
  button.innerText = "Switch to summer semester";
  button.type = "button";
  button.onclick = switchSemesters;

  label.innerText = "Hide full courses: ";

  checkbox.type = "checkbox";
  checkbox.onclick = () => {
    hideFull();
  };

  label2.innerText = "Filter: ";

  input.id = "filterInput";
  input.placeholder = "Filter courses";
  input.style = "min-width: 250px";
  input.oninput = () => {
    filterCourses();
  };

  div2.append(label);
  div2.append(" ");
  div2.append(checkbox);

  div3.append(label2);
  div3.append(" ");
  div3.append(input);

  div.append(button);
  div.append(div2);
  div.append(div3);

  return div;
}

hideInfo();

const origoTable = document.getElementsByClassName("table")[0];

// Title with the current semester (Summer/Winter)
const semesterSwitch = document.createElement("H1");
semesterSwitch.id = "semesterSwitch";
semesterSwitch.innerText = "Winter semester";
origoTable.before(semesterSwitch);

semesterSwitch.after(createSwitchAndFilter());

splitTables(origoTable);
addTableSorters();
