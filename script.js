// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  nextId++;
  localStorage.setItem('nextId', JSON.stringify(nextId));
  return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  console.log(task);
  const taskCard = $('<div>').addClass('task-card draggable').attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('header h3').text(task.taskTitle);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.taskDescription);
  const cardDueDate = $('<p>').addClass('card-text').text(task.taskDueDate);
  const cardDeleteBtn = $('<button>').addClass('btn-danger').text('Delete').attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // If else statement to check the status of the task and assign the background color according to the due date
  if (task.dueDate && task.Status !== 'done') {
    const now = dayjs();
    const taskduedate = dayjs(task.dueDate, 'DD/MM/YYYY');

    if (now.isSame(taskduedate, 'day')) {
      taskCard.addClass('bg-warning');
    } else if (now.isAfter(taskduedate)) {
      taskCard.addClass('bg-danger');
      cardDeleteBtn.addClass('bg-white');
    }
  }
  console.log(cardBody);

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  console.log('task card created')

  return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  // Initialize taskList if it's falsy
  taskList = taskList || [];

  // Get references to the list containers
  const $todoList = $('#todo-cards');
  const $inProgressList = $('#in-progress-cards');
  const $doneList = $('#done-cards');


  $todoList.empty();
  $inProgressList.empty();
  $doneList.empty();
}

console.log(taskList);
// looping through tasks with a forEach loop
taskList.forEach(task => {
  const taskCard = createTaskCard(task);
  const targetListId = getTargetListId(task.status);
  const targetList = $(`#${targetListId}-cards`);
  console.log('Appending task card to', targetListId, 'list:', taskCard);
  targetList.append(taskCard);
});

function getTargetListId(status) {
  switch (status) {
    case 'to-do':
      return 'todo-cards';
    case 'in-progress':
      return 'in-progress-cards';
    case 'done':
      return 'done-cards';
  }
}

// Make the cards draggable using the jQuery UI helper option
$('.draggable').draggable({
  helper: function (event) {
    const $target = $(event.target);
    const $draggable = $target.hasClass('ui-draggable') ? $target : $target.closest('.ui-draggable');
    const $helper = $draggable.clone();

    $helper.css('maxWidth', $draggable.outerWidth());

    return $helper;
  }
});

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  console.log($(event.currentTarget));
  console.log($('#taskdescription').val());
  const task = {
    id: generateTaskId(),
    title: $('#tasktitle').val(),
    description: $('#taskdescription').val(),
    dueDate: $('#taskduedate').val(),
    status: 'to-do',
  };

  // Add new task to the task list  
  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  // Render the task list 
  renderTaskList();
  $('#tasktitle').val('');
  $('#taskdescription').val('');
  $('#taskduedate').val('');

  console.log('task added');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault();

  // Get the task ID from the clicked button
  const taskId = parseInt($(this).data('task-id'));

  // Find the index of the task in the taskList
  const taskIndex = taskList.findIndex(task => task.id === taskId);

  // If the task is found, remove it from the taskList
  if (taskIndex !== -1) {
    taskList.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // const taskId = parseInt(ui.draggable.data('task-id'));
  const newStatus = event.target.id;
  // get the task id from the button clicked
  const taskId = $(this).attr('data-task-id');
  // Find the task in the taskList and update its status
  const taskIndex = taskList.findIndex(task => task.id === taskId);
  console.log(taskIndex);
  if (taskIndex >= 0) {
    taskList[taskIndex].status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  console.log('document.ready');
  console.log('Initializing datepicker on #taskduedate');
  // render task list
  renderTaskList();
  // add event listener
  $('#taskform').on('submit', handleAddTask);
  // make lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
  // make a date picker
  $('#taskduedate').datepicker({
    // autosize: true,
    changeMonth: true,
    changeYear: true,
  });
});

