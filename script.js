const url = 'http://localhost:8080/api/v1/tasks';

// Function to update task status
function updateTaskStatus(taskId, data) {
    const updateUrl = `${url}/${taskId}`;

    let fetchData = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    };

    fetch(updateUrl, fetchData)
        .then(function(response) {
            if (response.ok) {
                console.log('Task status updated successfully!');
                
                loadTasks();
            } else {
                console.error('Error updating task status:', response.statusText);
            }
        })
        .catch(function(error) {
            console.error('Error updating task status:', error);
        });
}


// Function to load and display tasks
function loadTasks() {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let tasks = data;
            const table = document.querySelector('#tasks-list tbody');
            
            // Clear the current list
            table.innerHTML = '';

            tasks.forEach(function(task) {
                let tr = document.createElement('tr');
                let title = document.createElement('td');
                let description = document.createElement('td');
                let status = document.createElement('td');
                let actions = document.createElement('td');


                // Create the selector box in the "Status" column
                status.innerHTML = `
                    <select class="task-status" data-task-id="${task.id}">
                        <option value="PENDING" ${task.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                        <option value="COMPLETED" ${task.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                    </select>
                `;

                let select = status.querySelector('.task-status');

                select.addEventListener('change', function () {
                    // When changing the select box, send a PUT request to update the task status
                    const newStatus = select.value;
                    const taskId = select.getAttribute('data-task-id');
                    const taskTitle = title.textContent; // Get the task title
                    const taskDescription = description.textContent; // Get the task description

                    // Create JSON object with all required fields
                    const data = {
                        id: taskId,
                        title: taskTitle,
                        description: taskDescription,
                        status: newStatus,
                    };

                    updateTaskStatus(taskId, data);
                });

                title.innerHTML = `${task.title}`;
                description.innerHTML = `${task.description}`;

                // Add "Edit" and "Delete" buttons in the actions column
                actions.innerHTML = `
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;

                tr.appendChild(title);
                tr.appendChild(description);
                tr.appendChild(status);
                tr.appendChild(actions);

                table.appendChild(tr);
            });
        })
        .catch(function(error) {
            console.log(error);
        });
}

// Form submission event configuration
document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskTitleInput = document.getElementById('task-title').value;
        const taskDescriptionInput = document.getElementById('task-description').value;
        const taskStatusInput = document.getElementById('task-status').value;

        const data = {
            title: taskTitleInput,
            description: taskDescriptionInput,
            status: taskStatusInput,
        };

        let fetchData = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        };

        fetch(url, fetchData)
            .then(function(response) {
                if (response.ok) {
                    console.log('Task created successfully!');
                    
                    // Clear the form
                    document.getElementById('task-title').value = '';
                    document.getElementById('task-description').value = '';

                    loadTasks();
                } else {
                    console.error('Error creating task:', response.statusText);
                }
            })
            .catch(function(error) {
                console.error('Error creating task:', error);
            });
    });

    loadTasks();
});

function deleteTask(taskId) {
    const deleteUrl = `${url}/${taskId}`;

    let fetchData = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    };

    fetch(deleteUrl, fetchData)
        .then(function(response) {
            if (response.ok) {
                console.log('Task deleted successfully!');
                
                loadTasks();
            } else {
                console.error('Error deleting task:', response.statusText);
            }
        })
        .catch(function(error) {
            console.error('Error deleting task:', error);
        });
}


// Redirect user to edit page with task ID in URL
function editTask(taskId) {
    window.location.href = `edit-task.html?id=${taskId}`;
}
