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
    const taskCard = $('<div>').addClass('task-card draggable').attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('header h3').text(task.taskTitle);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.taskDescription);
    const cardDue = $('<p>').addClass('card-text').text(task.taskDueDate);
    const deleteBtn = $('<button>').addClass('btn-danger').text('Delete').attr('data-task-id', task.id);
    deleteBtn.on('click', handleDeleteTask);

    // If else statement to check the status of the task and assign the background color according to the due date
    if (task.dueDate && task.Status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger');
        }
    }

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
  

    $todoList.html('');
    $inProgressList.html('');
    $doneList.html('');
  }
  

// looping through tasks with a forEach loop
taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    const targetListId = getTargetListId(task.status);
    const targetList = $(`#${targetListId}`);
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
        helper: function(event) {
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
  
    // Get input values
    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const dueDate = $('#taskDueDate').val();
  
    // Create a new task object
    const newTask = {
      id: generateTaskId(),
      title,
      description,
      dueDate,
      status: 'to-do',
    };
  
    // Add new task to taskList and update localStorage
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
  
    // Clear input fields
    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#taskDueDate').val('');
  
    // Render the updated task list
    renderTaskList();
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  const taskIndex = taskList.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    taskList.splice(taskIndex, 1);
    const taskCard = document.getElementById(taskId);
    if (taskCard) {
      taskCard.remove();
    }

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  event.preventDefault();
  const taskId = ui.draggable.attr('id');
  const newStatus = $(this).attr('id').replace('-cards', '');

  if (taskId) {
    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      taskList[taskIndex].status = newStatus;
      localStorage.setItem("tasks", JSON.stringify(taskList));
      renderTaskList();
    }
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
  // render the task list
  renderTaskList();
  // event listener 
  $('#taskform').on('submit', handleAddTask);
  // make date field a datepicker
  $('#taskduedate').datepicker();
});

    
