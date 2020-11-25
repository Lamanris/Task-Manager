import React, { useState } from 'react'
import axios from 'axios'

const AddNewTask = ({ category }) => {
  const addNewTask = (title) => {
    axios.post(`/api/v1/tasks/${category}`, { title })
  }
  const [newTask, setNewTask] = useState('')
  return (
    <div className="block my-3 mx-auto text-center">
      <input
        className="border-1 border-solid border-black bg-gray-300 rounded outline-none p-1 "
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Type..."
      />
      <button
        className="mx-2 bg-blue-400 shadow-md rounded-md p-1 pr-2 pl-2 hover:bg-blue-300 transition duration-500 ease-in-out focus:outline-none"
        type="button"
        onClick={() => {
          addNewTask(newTask)
        }}
      >
        Add Task
      </button>
    </div>
  )
}

export default AddNewTask
