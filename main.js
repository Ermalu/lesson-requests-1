/*
Виды запросов
POST - добавление данных
PUT - полная замена данных
PATCH - частичная замены данных
DELETE - удаление
GET - получение данных
*/

/*
команды для запуска json-server
json-server -w db.json -p 8000   //!
*/

/* CRUD -Create(POST) Read(GET) Update(PUT & Patch) Delete(Delete)
 */
const API = "http://localhost:8000/todos";

//! Create

//? получаем нужные для добавления элементы

let inpAdd = document.getElementById("inp-add");
let btnAdd = document.getElementById("btn-add");
// console.log(inpAdd, btnAdd);

// навесили событие на кнопку "сохранить"
btnAdd.addEventListener("click", async function () {
  // собираем объект для дб.жсон
  let newTodo = {
    todo: inpAdd.value,
  };
  // console.log(newTodo);
  // проверка на заполненость импута и останавливаем код с помощью  return, чтоб пост-запрос не выполнился
  if (newTodo.todo.trim() === "") {
    alert("заполните поля!!");
    return;
  }
  await fetch(API, {
    method: "POST", // указываем метод
    body: JSON.stringify(newTodo), // указываем что именно нужно запостить
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, // кодировка
  });
  inpAdd.value = "";
  // чтобы добавленный такс сразу отобразился в листе вызываем функцию которая выполняет отоброжение
  getTodos();
});

//! Read
//! Search
let inpSearch = document.getElementById("inp-search");
// console.log(inpSearch);

inpSearch.addEventListener("input", function () {
  // console.log("input!");
  getTodos();
});
//! pagination
let pagination = document.getElementById("pagination");
let page = 1;
// получаем элемент, чтоб в нем отобразит все таски
let list = document.getElementById("list");
// проверяем в консоли, чтоб убедится, что в переменной list сейчас НЕ пусто
// console.log(list);
//функция для получения всех тасков т отображения их в div#list
// async await  нужен здесь, чтоб при отравке запроса мы сначала получили данных и только потом записали все в переменную respons, иначе (если мы НЕ дождемся) туда запишетться pending ( состояние промисов, который еще не выполнен )
async function getTodos() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=2`
  ) // если не указать метод запроса, то по умолчанию это GET запрос
    .then(res => res.json()) // переводим все в  json форматs
    .catch(err => console.log(err)); // отловили ошибку
  // console.log(response);

  // allTodos - все элементы из дб.жсон
  let allTodos = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err));
  // console.log(allTodos.length / 2);

  // посчитали какой будет последняя страница
  let lastPage = Math.ceil(allTodos.length / 2);
  // очищяем div#list, чтоб список тасков корректно отображался и не хранил там предыдущие  HTML-элементы со стырыми данными
  list.innerHTML = "";
  // перебираем полученный из дб.жсон массив и для каждого объекта из этого массива создаем div и задаем ему содержимое через метов innerHTML, каждый созданный эдемент аппендит в div#list
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `
    <span>${item.todo}</span>
    <button class="btn-delete">Delete</button>
    <button ${
      page === lastPage ? "disabled" : ""
    } class="btn-edit">Edit</button>
    `;
    list.append(newElem);
  });

  // добавляем пагинацию
  pagination.innerHTML = `
  <button id="btn-prev" ${page === 1 ? "disabled" : ""}>Prev</button>
  <span>${page}</span>
  <button id="btn-next">Next</button>
  `;
}
//   вызываем фунцию, чтоб как только откроеться страница что-то было отображено
getTodos();

// элементы из модалки для редактирования
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditTodo = document.getElementById("inp-edit-todo");
let inpEditId = document.getElementById("inp-edit-id");
let btnSaveEdit = document.getElementById("btn-save-edit");
// console.log(inpEditTodo, inpEditId, btnSaveEdit);

// фунция чтоб закрыть модалку
modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});

// фунция для сохранения изменения при редактировании
btnSaveEdit.addEventListener("click", async function () {
  // объем с отредактированным данными
  let editedTodo = {
    todo: inpEditTodo.value,
  };
  let id = inpEditId.value;
  // запрос для изменения данных
  await fetch(`${API}/${id}`, {
    method: "PATCH", // указываем метод
    body: JSON.stringify(editedTodo), // указываем что именно нужно запостить
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, // кодировка
  });
  modalEdit.style.display = "none";
  getTodos();
});

document.addEventListener("click", async function (e) {
  //! delete
  if (e.target.className === "btn-delete") {
    // запрос для удаления
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getTodos();
  }

  //! update(edit)
  if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    // запрос для получения данных чтоб мы могли отобразить все в модалке для редактирования
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    // получения данных отоброжаем в интутах в html
    inpEditTodo.value = response.todo;
    inpEditId.value = response.id;
  }
  // console.log(e.target.parentNode.id);
  //! pagination
  if (e.target.id === "btn-next") {
    page++;
    getTodos();
  }
  if (e.target.id === "btn-prev") {
    page--;
    getTodos();
  }
});
