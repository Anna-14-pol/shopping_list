const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

//array to hold state
let items = [];

function handleSubmit(e) {
  e.preventDefault();

  const name = e.target.item.value;
  //if empty- dont submit
  if (!name) return;

  const item = {
    name: name,
    id: Date.now(),
    complete: false,
  };
  //push items into state
  items.push(item);
  console.log(`the state has ${items.length} items`);

  //clear the form
  //   e.target.item.value = "";
  e.target.reset();
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function displayItems() {
  console.log(items);
  const html = items
    .map(
      (item) => `<li class = "shopping-item">
      <input value = "${item.id}" 
      type = "checkbox"
      ${item.complete ? "checked" : ""}>
    <span class = "itemName">${item.name}</span>
    <button aria-label = "Remove${item.name}"
    value = "${item.id}"
    >&times;</button>
    </li>`
    )
    .join("");
  list.innerHTML = html;
}

function mirrorToLocalStorage() {
  console.info("saving items to LS");
  localStorage.setItem("items", JSON.stringify(items));
}

function restoreFromLS() {
  console.info("restoring from Local Storage");
  //pull items from LS
  const lsItems = JSON.parse(localStorage.getItem("items"));
  if (lsItems.length) {
    // lsItems.forEach((element) => {
    //   items.push(element);
    // });
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
  console.log(lsItems);
}

function deleteItem(id) {
  console.log("deleting items", id);
  //update array of items without deleted item
  items = items.filter((item) => item.id !== id);
  console.log(items);
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function markAsComplete(id) {
  console.log("complete", id);
  const itemRef = items.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

shoppingForm.addEventListener("submit", handleSubmit);
list.addEventListener("itemsUpdated", displayItems);

// list.addEventListener("itemsUpdated", (e) => {
//   console.log(e);
// });

list.addEventListener("itemsUpdated", mirrorToLocalStorage);
restoreFromLS();

// event delegation: listen on the click on the list, but delegate it to the button (if clicked)
list.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    deleteItem(parseInt(e.target.value));
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(parseInt(e.target.value));
  }
});
