import React, { useState } from 'react'
import axios from 'axios'
import { button } from '@storybook/addon-knobs'

const TaskTitle = ({ category, task }) => {
  const [editTask, setEditTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState(task.title)
  const saveTitle = (id, title) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { title })
  }
  const updateStatus = (id, status) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { status })
  }
  const deleteTask = (id) => {
    axios.delete(`/api/v1/tasks/${category}/${id}`)
  }
  return (
    <div>
      <div
        key={task.taskId}
        className="flex justify-center items-center m-2 border-1 border-solid border-green"
      >
        {editTask === false && (
          <button
            type="button"
            className="m-3 bg-green-500 p-1 rounded-md pl-2 pr-2 hover:bg-green-400 transition duration-500 ease-in-out focus:outline-none"
            onClick={() => {
              setTaskTitle(task.title)
              setEditTask(true)
            }}
          >
            Edit
          </button>
        )}
        {editTask ? (
          <>
            <button
              type="button"
              className="m-3 bg-yellow-500 p-1 rounded-md pl-2 pr-2 hover:bg-yellow-400 transition duration-500 ease-in-out focus:outline-none"
              onClick={() => {
                saveTitle(task.taskId, taskTitle)
                setEditTask(false)
              }}
            >
              Save
            </button>
            <input
              type="text"
              className="bg-gray-300 rounded outline-none p-1 text-2xl"
              onChange={(e) => setTaskTitle(e.target.value)}
              value={taskTitle}
            />
          </>
        ) : (
          <h4 className="text-2xl">{taskTitle}</h4>
        )}

        {task.status === 'new' && (
          <button
            type="button"
            className="ml-3 bg-purple-500 p-1 rounded-md pl-2 pr-2 hover:bg-purple-400 transition duration-500 ease-in-out focus:outline-none"
            onClick={() => {
              updateStatus(task.taskId, 'in progress')
            }}
          >
            In progress
          </button>
        )}
        {task.status === 'in progress' && (
          <>
            <button
              type="button"
              className="ml-3 ml-3 bg-red-500 p-1 rounded-md pl-2 pr-2 hover:bg-red-400 transition duration-500 ease-in-out focus:outline-none"
              onClick={() => {
                updateStatus(task.taskId, 'blocked')
              }}
            >
              Blocked
            </button>
            <button
              type="button"
              className="ml-3 ml-3 bg-yellow-500 p-1 rounded-md pl-2 pr-2 hover:bg-yellow-400 transition duration-500 ease-in-out focus:outline-none"
              onClick={() => {
                updateStatus(task.taskId, 'done')
              }}
            >
              Done
            </button>
          </>
        )}
        {task.status === 'blocked' && (
          <button
            type="button"
            className="ml-3 bg-purple-500 p-1 rounded-md pl-2 pr-2 hover:bg-purple-400 transition duration-500 ease-in-out focus:outline-none"
            onClick={() => {
              updateStatus(task.taskId, 'in progress')
            }}
          >
            Unblock
          </button>
        )}
        <button
          type="button"
          className="ml-3 bg-red-600 p-1 rounded-md pl-2 pr-2 hover:bg-red-500 transition duration-500 ease-in-out focus:outline-none"
          onClick={() => {
            deleteTask(task.taskId)
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskTitle
