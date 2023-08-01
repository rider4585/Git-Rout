let rowCounter = 1;

function createInputCell(type, id) {
  const cell = document.createElement("td");
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  cell.appendChild(input);
  return cell;
}

function createTableRow() {
  const row = document.createElement("tr");
  rowCounter++;
  const timeSlotId = `time-${rowCounter}`;
  row.appendChild(createInputCell("time", timeSlotId));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (const element of days) {
    const dayId = `${element}-${rowCounter}`;
    row.appendChild(createInputCell("text", dayId));
  }

  const deleteBtnCell = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = function () {
    deleteRow(this);
  };
  deleteBtnCell.appendChild(deleteBtn);
  row.appendChild(deleteBtnCell);

  return row;
}

function addRow() {
  const tableBody = document.querySelector("tbody");
  const newRow = createTableRow();
  tableBody.appendChild(newRow);
}

function deleteRow(btn) {
  const row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
  updateRowIds();
}

function updateRowIds() {
  const table = document.querySelector("table");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  if (rows.length == 0) {
    rowCounter = 0;
  }

  rows.forEach((row, index) => {
    rowCounter = index + 1;
    const timeSlotInput = row.querySelector('input[type="time"]');
    const daysInputs = Array.from(row.querySelectorAll('input[type="text"]'));

    timeSlotInput.id = `time-${rowCounter}`;
    daysInputs.forEach((input, i) => {
      input.id = `${input.id.slice(0, 3)}-${rowCounter}`;
    });
  });
}

function generateJSON() {
  const table = document.querySelector("table");
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  const jsonData = {};

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  days.forEach((day) => {
    const dayData = [];
    rows.forEach((row) => {
      const time = row.querySelector('input[type="time"]').value;
      const activity = row
        .querySelector(`#${day.slice(0, 3)}-${row.rowIndex}`)
        .value.trim();

      if (time !== "" && activity !== "") {
        dayData.push({
          time,
          activity,
        });
      }
    });
    jsonData[day] = dayData;
  });

  console.log(jsonData);
//   const jsonString = JSON.stringify(jsonData, null, 2);
  // You can do whatever you want with the jsonString here (e.g., display it on the dashboard)
}
