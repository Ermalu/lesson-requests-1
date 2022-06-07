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
// получаем элемент, чтоб в нем отобразит все таски
let list = document.getElementById("list");
// проверяем в консоли, чтоб убедится, что в переменной list сейчас НЕ пусто
console.log(list);
//функция для получения всех тасков т отображения их в div#list
// async await  нужен здесь, чтоб при отравке запроса мы сначала получили данных и только потом записали все в переменную respons, иначе (если мы НЕ дождемся) туда запишетться pending ( состояние промисов, который еще не выполнен )
async function getTodos() {
  let response = await fetch(API) // если не указать метод запроса, то по умолчанию это GET запрос
    .then(res => res.json()) // переводим все в  json формат
    .catch(err => console.log(err)); // отловили ошибку
  console.log(response);
  // очищяем div#list, чтоб список тасков корректно отображался и не хранил там предыдущие  HTML-элементы со стырыми данными
  list.innerHTML = "";
  // перебираем полученный из дб.жсон массив и для каждого объекта из этого массива создаем div и задаем ему содержимое через метов innerHTML, каждый созданный эдемент аппендит в div#list
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.innerHTML = `<span>${item.todo}</span>`;
    list.append(newElem);
  });
}
//   вызываем фунцию, чтоб как только откроеться страница что-то было отображено
getTodos();
