const database = firebase.firestore();
const addButton = document.getElementById("addButton");
const globalContainer = document.getElementById("globalContainer");

const addTaks = () => {
  let taskName = document.getElementById("taskName").value;
  let taskDesc = document.getElementById("taskDesc").value;
  let select = document.getElementById("select").value;

  if (!taskName || !taskDesc || !select) {
    alert("Rellene todos los campos");
  } else if (taskName.length > 20) {
    alert("El nombre de la tarea no puede ser tan largo, no te pases");
  } else {
    database
      .collection("tasks")
      .add({
        taskName,
        taskDesc,
        select,
      })
      .then(() => {
        reloadWindow();
      })
      .catch((err) => console.log(err));
  }
};

(() => {
  database.collection("tasks").onSnapshot((data) => {
    data.forEach((task) => {
      const { taskName, taskDesc, select } = task.data();
      const newDiv = document.createElement("div");

      newDiv.innerHTML = /*html*/ `
        <div class="col">
          <div class="card bg-light my-4 text-center" style="width: 20rem; min-height: 10rem">
            <div class="card-header ${color(select)} text-left">
              ${taskName}
              <button class="btn-del btn btn-dark" id="delButton" onclick="deleteTask('${
                task.id
              }')">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </div>
            <div class="card-body">${taskDesc}</div>
          </div>
        </div>`;

      globalContainer.appendChild(newDiv);
    });
  });
})();

const color = (priority) => {
  let clase = "";
  if (priority == "low") {
    clase = "bg-success";
  } else if (priority == "medium") {
    clase = "bg-warning";
  } else if (priority == "high") {
    clase = "bg-danger";
  }
  return clase;
};

const deleteTask = (taskId) => {
  database
    .collection("tasks")
    .doc(taskId)
    .delete()
    .then(() => reloadWindow())
    .catch((err) => console.log(err));
};

const reloadWindow = () => {
  window.location.reload();
};

addButton.addEventListener("click", addTaks);
