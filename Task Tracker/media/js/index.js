// JavaScript code for navigation item click functionality
let taskList = {};
let ideaList = {};

if (localStorage.getItem('taskList')) {
  taskList = JSON.parse(localStorage.getItem('taskList'));
}

if (localStorage.getItem('ideaList')) {
  ideaList = JSON.parse(localStorage.getItem('ideaList'));
}

let loadData = {
  'taskList': '{"first-task":{"taskName":"First Task","taskDescription":"nfseofishefoi","toDoList":{"0":"hello","1":"dfbfb","2":"hfdtgngn","3":"fnggf"}},"second-task":{"taskName":"Second Task","taskDescription":"dlkcinvsdoibvs","toDoList":{"0":"drgdreged","1":"ergreger"}},"third-task":{"taskName":"Third Task","taskDescription":"dkuisfgedfi","toDoList":{"0":"kbfiosdrughfe","1":"hrthdytjdtyj"}}}',
  'ideaList': '{"first-idea":{"ideaName":"First Idea","ideaDescription":"lsdkvnsoihvssienlsdrblsir"},"second-idea":{"ideaName":"Second Idea","ideaDescription":"skdiughewi8gwu"}}'
}

// if (loadData) {
//   if (loadData['taskList']) {
//     taskList = JSON.parse(loadData['taskList']);
//   }
//   if (loadData['ideaList']) {
//     ideaList = JSON.parse(loadData['ideaList']);
//   }
// }
const taskModal = document.querySelector('.task-modal');
const ideaModal = document.querySelector('.idea-modal');
const taskDeleteModal = document.querySelector('.task-delete.delete-modal');
const ideaDeleteModal = document.querySelector('.idea-delete.delete-modal');
const navItems = document.querySelectorAll('.nav-item');
const activeNavItem = document.querySelector('.nav-item.active');
const tasksNavItem = document.querySelector('.nav-item[href="#tasks"]');
const tasksSection = document.querySelector('#tasks');
const ideasNavItem = document.querySelector('.nav-item[href="#ideas"]');
const ideasSection = document.querySelector('#ideas');
const sections = document.querySelectorAll('section');
const emptyTaskListView = document.querySelector('.empty-task-list');
const emptyIdeaListView = document.querySelector('.empty-idea-list');
const taskListContainer = document.querySelector('.task-list');
const ideaListContainer = document.querySelector('.idea-list');
const taskInfoForm = document.querySelector('.task-form');
const ideaInfoForm = document.querySelector('.idea-form');
const taskNameInput = document.querySelector('#task-name');
const ideaNameInput = document.querySelector('#idea-name');
const taskDescriptionInput = document.querySelector('#task-description');
const ideaDescriptionInput = document.querySelector('#idea-description');
const oneToDoItem = document.querySelector('.subTask');
const firstToDoItem = document.querySelector('#subTasks');
const toDoListContainer = document.querySelector('#sub-tasks-container');
const footer = document.querySelector('footer');
const deleteTaskBtn = document.querySelector('.delete-task-btn');
const deleteIdeaBtn = document.querySelector('.delete-idea-btn');
const updateTaskBtn = document.querySelector('.update-task-btn');
const updateIdeaBtn = document.querySelector('.update-idea-btn');
const saveIdeaBtn = document.querySelector('.save-idea-btn');
const saveTaskBtn = document.querySelector('.save-task-btn');


navItems.forEach(item => {
  item.addEventListener('click', handleNavItemClick);
});

function handleNavItemClick(event) {
  event.preventDefault();

  const clickedNavItem = event.currentTarget;

  for (const element of navItems) {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  }

  clickedNavItem.classList.add('active');
  scrollToSection(clickedNavItem.getAttribute('href'));
}

// JavaScript code for smooth scrolling to sections
function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);
  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

document.addEventListener('DOMContentLoaded', function () {
  tasksSection.setAttribute('style', `height: calc(100dvh - (${footer.clientHeight}px + 40px))`);
  ideasSection.setAttribute('style', `height: calc(100dvh - (${footer.clientHeight}px + 40px))`);
  isThereIsNoTask(taskList);
  isThereIsNoIdea(ideaList);
  generateTaskListView(taskList);
  generateIdeaListView(ideaList);

})


let subTasksCount = 1;

function isThereIsNoTask(taskList) {
  if (Object.keys(taskList).length !== 0) {
    emptyTaskListView.classList.add('hide');
    taskListContainer.classList.remove('hide')
  } else {
    emptyTaskListView.classList.remove('hide');
    taskListContainer.classList.add('hide');
  }
}

function isThereIsNoIdea(ideaList) {
  if (Object.keys(ideaList).length !== 0) {
    emptyIdeaListView.classList.add('hide');
    ideaListContainer.classList.remove('hide')
  } else {
    emptyIdeaListView.classList.remove('hide');
    ideaListContainer.classList.add('hide');
  }
}

function addNewTask() {
  taskModal.classList.remove('hide');

  if (saveTaskBtn.classList.contains('hide')) {
    saveTaskBtn.classList.remove('hide');
  }

  if (!updateTaskBtn.classList.contains('hide')) {
    updateTaskBtn.classList.add('hide');
  }
}

function addNewIdea() {
  ideaModal.classList.remove('hide');

  if (saveIdeaBtn.classList.contains('hide')) {
    saveIdeaBtn.classList.remove('hide');
  }
  if (!updateIdeaBtn.classList.contains('hide')) {
    updateIdeaBtn.classList.add('hide');
  }
}

function closePopup(popupName) {
  if (popupName == 'task-modal') {
    resetAddTaskPopup();
    taskModal.classList.add('hide');
  } else if (popupName == 'task-delete') {
    taskDeleteModal.classList.add('hide');
  } else if (popupName == 'idea-modal') {
    resetAddIdeaPopup();
    ideaModal.classList.add('hide');
  } else if (popupName == 'idea-delete') {
    ideaDeleteModal.classList.add('hide');
  }
}

function addSubTask() {
  const subTasksContainer = toDoListContainer;

  const subTaskInput = document.createElement('input');
  subTaskInput.type = 'text';
  subTaskInput.name = `subTask${subTasksCount}`;
  subTaskInput.className = 'subTask removeSubTask';

  subTasksContainer.appendChild(subTaskInput, subTasksContainer.lastElementChild);

  subTasksContainer.lastChild.focus();
  taskInfoForm.scrollBy(0, taskInfoForm.scrollHeight);

  subTasksCount++;
}

function getToDoList() {
  let subTaskObject = {};
  let allToDoItems = document.querySelectorAll('.subTask');
  let SubTaskInputs = allToDoItems;
  for (let index = 0; index < SubTaskInputs.length; index++) {
    if (SubTaskInputs[index].value !== "") {
      subTaskObject[index] = SubTaskInputs[index].value;
    }
  }
  return subTaskObject;
}

function saveNewTask() {
  let taskName = taskNameInput.value;
  let taskDescription = taskDescriptionInput.value;
  if (taskName) {
    let taskId = generateUniqueId(taskName);
    taskList[taskId] = {};
    taskList[taskId]['taskName'] = taskName;
    taskList[taskId]['taskDescription'] = taskDescription;
    taskList[taskId]['toDoList'] = getToDoList();
    generateTaskListView(taskList);
  }
  isThereIsNoTask(taskList);
  localStorage.setItem('taskList', JSON.stringify(taskList));

  resetAddTaskPopup();

  taskModal.classList.add('hide');
}

function saveNewIdea() {
  let ideaName = ideaNameInput.value;
  let ideaDescription = ideaDescriptionInput.value;
  if (ideaName) {
    let ideaId = generateUniqueId(ideaName);
    ideaList[ideaId] = {};
    ideaList[ideaId]['ideaName'] = ideaName;
    ideaList[ideaId]['ideaDescription'] = ideaDescription;
    generateIdeaListView(ideaList);
  }
  isThereIsNoIdea(ideaList);
  localStorage.setItem('ideaList', JSON.stringify(ideaList));

  resetAddIdeaPopup();

  ideaModal.classList.add('hide');
}

function generateUniqueId(name) {
  let uniqueId = name.trim();
  uniqueId = uniqueId.replace(/\s+/g, '-');
  uniqueId = uniqueId.toLowerCase();
  return uniqueId;
}

function generateTaskListView(taskList) {
  let taskContainer = taskListContainer;
  taskContainer.innerHTML = "";

  // Logic to create views here
  for (const task in taskList) {
    let taskName = taskList[task]['taskName'];

    let taskCardTemplate = document.createElement('details');
    taskCardTemplate.className = task;

    const taskCardTitle = document.createElement('summary');
    taskCardTitle.innerHTML = `${taskName}<div class="edit-icons">
    <i class="fas fa-edit" onclick="editTask('${task}')"></i>
    <i class="fas fa-trash" onclick="deleteTask('${task}')"></i>
    </div>`;

    const taskDescription = document.createElement('p');
    taskDescription.textContent = taskList[task]['taskDescription'];

    const toDoList = document.createElement('ol');

    for (const toDo in taskList[task]['toDoList']) {
      if (Object.hasOwnProperty.call(taskList[task]['toDoList'], toDo)) {
        const taskItem = document.createElement('li');
        taskItem.innerText = taskList[task]['toDoList'][toDo];
        toDoList.appendChild(taskItem);
      }
    }

    taskCardTemplate.appendChild(taskCardTitle);
    taskCardTemplate.appendChild(taskDescription);
    taskCardTemplate.appendChild(toDoList);
    taskContainer.appendChild(taskCardTemplate);
  }
}

function generateIdeaListView(ideaList) {
  let ideaContainer = ideaListContainer;
  ideaContainer.innerHTML = "";

  // Logic to create views here
  for (const idea in ideaList) {
    let ideaName = ideaList[idea]['ideaName'];

    let ideaCardTemplate = document.createElement('details');
    ideaCardTemplate.className = idea;

    const ideaCardTitle = document.createElement('summary');
    ideaCardTitle.innerHTML = `${ideaName}<div class="edit-icons">
    <i class="fas fa-edit" onclick="editIdea('${idea}')"></i>
    <i class="fas fa-trash" onclick="deleteIdea('${idea}')"></i>
    </div>`;

    const ideaDescription = document.createElement('p');
    ideaDescription.textContent = ideaList[idea]['ideaDescription'];


    ideaCardTemplate.appendChild(ideaCardTitle);
    ideaCardTemplate.appendChild(ideaDescription);
    ideaContainer.appendChild(ideaCardTemplate);
  }
}

function resetAddTaskPopup() {
  let removeToDoItems = document.querySelectorAll('.removeSubTask');
  taskNameInput.value = "";
  taskDescriptionInput.value = "";
  oneToDoItem.value = "";
  let allSubTasks = removeToDoItems;
  if (allSubTasks) {
    allSubTasks.forEach(element => {
      element.remove();
    });
  }
  subTasksCount = 1;
}

function resetAddIdeaPopup() {
  ideaNameInput.value = "";
  ideaDescriptionInput.value = "";
}

function deleteTask(taskName) {
  taskDeleteModal.classList.remove('hide');
  deleteTaskBtn.setAttribute('data-content', taskName);
}

function deleteIdea(ideaName) {
  ideaDeleteModal.classList.remove('hide');
  deleteIdeaBtn.setAttribute('data-content', ideaName);
}

function confirmDeleteTask(e) {
  let taskToDelete = e.target.getAttribute('data-content');
  delete taskList[taskToDelete];

  localStorage.setItem('taskList', JSON.stringify(taskList));

  closeDeletePopup('task-delete');
  generateTaskListView(taskList);
  isThereIsNoTask(taskList);
}

function confirmDeleteIdea(e) {
  let ideaToDelete = e.target.getAttribute('data-content');
  delete ideaList[ideaToDelete];

  localStorage.setItem('ideaList', JSON.stringify(ideaList));

  closeDeletePopup('idea-delete');
  generateIdeaListView(ideaList);
  isThereIsNoIdea(ideaList);
}

function closeDeletePopup(popupName) {
  closePopup(popupName);
}

function editTask(taskName) {

  taskModal.classList.remove('hide');

  if (!saveTaskBtn.classList.contains('hide')) {
    saveTaskBtn.classList.add('hide');
  }
  if (updateTaskBtn.classList.contains('hide')) {
    updateTaskBtn.classList.remove('hide')
  }

  fillTaskData(taskName);

}

function editIdea(ideaName) {

  ideaModal.classList.remove('hide');

  if (!saveIdeaBtn.classList.contains('hide')) {
    saveIdeaBtn.classList.add('hide');
  }
  if (updateIdeaBtn.classList.contains('hide')) {
    updateIdeaBtn.classList.remove('hide')
  }

  fillIdeaData(ideaName);

}

function fillTaskData(taskId) {
  taskNameInput.value = taskList[taskId]['taskName'];

  if (taskList[taskId]['taskDescription']) {
    taskDescriptionInput.value = taskList[taskId]['taskDescription'];
  }

  if (Object.keys(taskList[taskId]['toDoList']).length !== 0) {
    let numberOfToDoItems = Object.keys(taskList[taskId]['toDoList']).length - 1;
    for (let index = 0; index < numberOfToDoItems; index++) {
      addSubTask();
    }

    let allToDoItems = document.querySelectorAll('.subTask');

    for (let index = 0; index < allToDoItems.length; index++) {
      allToDoItems[index].value = taskList[taskId]['toDoList'][index];
    }
  }
  updateTaskBtn.setAttribute('data-content', taskId);
  taskInfoForm.scrollTop = 0;
}

function fillIdeaData(ideaId) {
  ideaNameInput.value = ideaList[ideaId]['ideaName'];

  if (ideaList[ideaId]['ideaDescription']) {
    ideaDescriptionInput.value = ideaList[ideaId]['ideaDescription'];
  }

  updateIdeaBtn.setAttribute('data-content', ideaId);
  ideaInfoForm.scrollTop = 0;
}

function updateTask(e) {
  let taskToUpdate = e.target.getAttribute('data-content');

  if (taskNameInput.value) {
    taskList[taskToUpdate]['taskName'] = taskNameInput.value;
    taskList[taskToUpdate]['taskDescription'] = taskDescriptionInput.value;
    taskList[taskToUpdate]['toDoList'] = getToDoList();
    localStorage.setItem('taskList', JSON.stringify(taskList));
    generateTaskListView(taskList);
  }
  resetAddTaskPopup();
  taskModal.classList.add('hide');
}

function updateIdea(e) {
  let ideasToUpdate = e.target.getAttribute('data-content');

  if (ideaNameInput.value) {
    ideaList[ideasToUpdate]['ideaName'] = ideaNameInput.value;
    ideaList[ideasToUpdate]['ideaDescription'] = ideaDescriptionInput.value;
    localStorage.setItem('ideaList', JSON.stringify(ideaList));
    generateIdeaListView(ideaList);
  }
  resetAddIdeaPopup();
  ideaModal.classList.add('hide');
}