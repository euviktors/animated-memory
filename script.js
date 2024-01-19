const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = [];

function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td>${item.date}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const searchBtn = document.getElementById("searchBtn");
const updateBtn = document.getElementById("updateBtn");

searchBtn.onclick = () => {
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return alert("Selecione datas válidas para pesquisa.");
  }

  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });

  renderFilteredItems(filteredItems);
};

updateBtn.onclick = () => {
  startDate.value = "";
  endDate.value = "";
  renderFilteredItems(items);
};

// Adicionando a função para renderizar os itens filtrados
function renderFilteredItems(filteredItems) {
  tbody.innerHTML = "";
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}
const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) || [];
const setItensBD = () => localStorage.setItem("db_items", JSON.stringify(items));

btnNew.onclick = () => {
  if (descItem.value === "" || amount.value === "" || type.value === "" || date.value === "") {
    return alert("Preencha todos os campos!");
  }

  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    date: date.value,
    type: type.value,
  });

  setItensBD();

  loadItens();

  descItem.value = "";
  amount.value = "";
  date.value = "";
};
