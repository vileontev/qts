const tableBody = document.querySelector("#carTable tbody");
const thArr = document.querySelectorAll("tr th");
const radios = Array.from(document.querySelectorAll("input[name='col']"));
const numberVar = document.getElementById("numberVar");

let isDescend = true;
let lastSortedColumn = null; // предыдущий отсортированный столбец

async function loadCars() {
  const response = await fetch("./data.json");
  const cars = await response.json(); // парсинг
  return cars;
}

loadCars().then((cars) => {
  cars.forEach((car) => {
    const row = document.createElement("tr");

    // ячейчки с данными
    Object.values(car).forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
});

function moreThanX(e) {
  e.preventDefault();

  let choose;
  radios.forEach((radio) => {
    if (radio.checked) {
      choose = radio;
    }
  });

  const colNum = Number(choose.getAttribute("attr-index"));
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  const x = Number(numberVar.value || numberVar.textContent);

  rows.forEach((row) => {
    let tdNum = Number(row.cells[colNum - 1].textContent);

    row.style.display = !isNaN(tdNum) && tdNum > x ? "" : "none";
  });
}

function resetFilter() {
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  rows.forEach((row) => {
    row.style.display = "";
  });
}

function hideColumn(e) {
  const colNum = Number(e.getAttribute("attr-index"));

  const tdArr = Array.from(
    tableBody.querySelectorAll(`tr td:nth-of-type(${colNum})`)
  );

  if (e.checked) {
    thArr[colNum - 1].classList.add("hidden");

    tdArr.forEach((td) => {
      td.classList.add("hidden");
    });
  } else {
    thArr[colNum - 1].classList.remove("hidden");

    tdArr.forEach((td) => {
      td.classList.remove("hidden");
    });
  }
}

function sortColumn(e) {
  const spanElement = e.querySelector("th span.sort");
  const columnIndex = Number(e.getAttribute("attr-index"));
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  const isNumeric = !isNaN(rows[0].cells[columnIndex - 1].textContent);

  thArr.forEach((th) => {
    const span = th.querySelector("span.sort");
    if (span && th !== e) {
      span.style.display = "none";
      span.textContent = "▾";
    }
  });

  spanElement.style.display = "inline-block";

  if (lastSortedColumn === columnIndex) {
    isDescend = !isDescend;
    spanElement.textContent = isDescend ? "▾" : "▴";
  } else {
    isDescend = true;
    spanElement.textContent = "▾";
  }

  rows.sort((a, b) => {
    let aText = a.cells[columnIndex - 1].textContent;
    let bText = b.cells[columnIndex - 1].textContent;

    return isNumeric
      ? isDescend
        ? Number(bText) - Number(aText)
        : Number(aText) - Number(bText)
      : isDescend
      ? aText.localeCompare(bText)
      : bText.localeCompare(aText);
  });

  rows.forEach((row) => tableBody.appendChild(row));

  lastSortedColumn = columnIndex;
}
