function hideAdditionalInfo() {
  const x = document.getElementById("additionalInfo");
  x.hidden = !x.hidden;

  const y = document.getElementById("hideAdditionalInfoButton");
  if (y.classList.contains("info-hidden")) {
    y.innerText = "Hide additional information about courses and study program";
    y.classList.replace("info-hidden", "info-shown");
  } else {
    y.innerText = "Show additional information about courses and study program";
    y.classList.replace("info-shown", "info-hidden");
  }
}

function showOneSemester() {
  const semesterSwitch = document.getElementById("semesterSwitch");
  semesterSwitch.innerText =
    semesterSwitch.innerText.toLowerCase() == "letní semestr"
      ? "Zimní semestr"
      : "Letní semestr";
  const tables = document.getElementsByClassName("classTable");
  console.log(tables);
  for (let i = 0; i < tables.length; i++) {
    tables[i].hidden = !tables[i].hidden;
  }
}

let staticTableID = 0;
function createTable(origoTable) {
  const table = document.createElement("TABLE");
  const tableBody = document.createElement("TBODY");
  table.id = "table" + staticTableID;
  table.className = "table table-bordered table-middle classTable";
  if (
    origoTable
      .getElementsByTagName("TR")[1]
      .innerText.toLowerCase()
      .includes("letní semestr")
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

function splitTables(origoTable) {
  while (origoTable.getElementsByTagName("TD").length > 2) {
    const table = createTable(origoTable);
    const tableBody = table.getElementsByTagName("TBODY")[0];

    origoTable.before(table);

    const origoTableChildren =
      origoTable.getElementsByTagName("TBODY")[0].children;

    let trClass = "";
    while (true) {
      let nextChild = origoTableChildren[1];
      if (table.className.includes("summer")) {
        nextChild = origoTableChildren[2];
      }
      if (!nextChild || (trClass != "" && trClass != nextChild.className)) {
        break;
      }

      tableBody.append(nextChild);

      trClass = nextChild.className;
    }
  }
  origoTable.remove();
}

function sortTable(tableID, asc, column) {}

function hideInfo() {
  const mainContentChildNodes =
    document.getElementsByClassName("main-content")[0].childNodes;

  const hideAdditionalInfoButton = document.createElement("BUTTON");
  hideAdditionalInfoButton.id = "hideAdditionalInfoButton";
  hideAdditionalInfoButton.innerText =
    "Show additional information about courses and study program";
  hideAdditionalInfoButton.className = "btn btn-primary info-hidden";
  hideAdditionalInfoButton.onclick = hideAdditionalInfo;
  mainContentChildNodes[0].after(hideAdditionalInfoButton);

  const additionalInfoDiv = document.createElement("DIV");
  additionalInfoDiv.id = "additionalInfo";
  additionalInfoDiv.hidden = "true";

  mainContentChildNodes[2].before(additionalInfoDiv);

  while (true) {
    const x = mainContentChildNodes[4];
    if (x.tagName == "FORM") {
      break;
    }
    additionalInfoDiv.append(x);
  }
}

hideInfo();

const origoTable = document.getElementsByClassName("table")[0];

const semesterSwitch = document.createElement("H1");
semesterSwitch.id = "semesterSwitch";
semesterSwitch.innerText = "Zimní semestr";
semesterSwitch.onclick = showOneSemester;

origoTable.before(semesterSwitch);

splitTables(origoTable);
