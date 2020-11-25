import React from 'react'
import AddNewTask from './addNewTask'
import TaskTitle from './taskTitle'

const TaskList = ({ taskList, category }) => {
  return (
    <>
      {category && <AddNewTask category={category} />}
      {taskList.map((task) => {
        return <TaskTitle key={task.taskId} category={category} task={task} />
      })}
    </>
  )
}

export default TaskList
