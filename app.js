const itemList = document.getElementById("item-list");
const form = document.getElementById("add-item-form");

const renderItem = (doc) => {
  const item = document.createElement("li");
  const name = document.createElement("span");
  const quantity = document.createElement("span");
  const remove = document.createElement("button");

  item.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  quantity.textContent = "Qty: " + doc.data().quantity;
  remove.textContent = "Remove";

  item.appendChild(name);
  item.appendChild(quantity);
  item.appendChild(remove);

  itemList.appendChild(item);

  remove.addEventListener("click", (e) => {
    const id = e.target.parentElement.getAttribute("data-id");
    db.collection("items").doc(id).delete();
  });
};

// db.collection("items")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderItem(doc);
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

db.collection("items").onSnapshot(snapshot => {
  const changes = snapshot.docChanges();

  changes.forEach(change => {
    if (change.type === "added") {
      renderItem(change.doc);
    } else if (change.type === "removed") {
      const item = itemList.querySelector("[data-id=" + change.doc.id + "]");
      itemList.removeChild(item);
    }
  })
})
