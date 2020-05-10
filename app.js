const itemList = document.getElementById("item-list");
const form = document.getElementById("add-item-form");

const renderList = (doc) => {
  const item = document.createElement("li");
  const name = document.createElement("span");
  const quantity = document.createElement("span");
  const close = document.createElement("button");

  item.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  quantity.textContent = "Qty: " + doc.data().quantity;
  close.textContent = "Remove";

  item.appendChild(name);
  item.appendChild(quantity);
  item.appendChild(close);

  itemList.appendChild(item);

  // deleting data
  close.addEventListener("click", (e) => {
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("items").doc(id).delete();
  });
};

// db.collection("items")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderList(doc);
//     });
//   });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("items").add({
    name: form.name.value,
    quantity: form.quantity.value,
  });
  form.name.value = "";
  form.quantity.value = "";
});

db.collection("items").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    if (change.type == "added") {
      renderList(change.doc);
    } else if (change.type == "removed") {
      let li = itemList.querySelector("[data-id=" + change.doc.id + "]");
      itemList.removeChild(li);
    }
  });
});
