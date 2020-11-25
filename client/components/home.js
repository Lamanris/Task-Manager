import React, { useState, useEffect } from 'react'
import { Route, useParams } from 'react-router-dom'
import axios from 'axios'
import TaskList from './taskList'
import Header from './header'
import Categories from './categories'

const Home = () => {
  const [taskList, setTaskList] = useState([])
  const [time, setTime] = useState([])
  const { category, timespan } = useParams()
  useEffect(() => {
    if (category) {
      axios(`/api/v1/tasks/${category}`).then(({ data }) => setTaskList(data))
      axios(`/api/v1/tasks/${category}/${timespan}`).then(({ data }) => setTime(data))
    }
  }, [category, timespan])
  return (
    <div>
      <Header category={category} />
      <Route
        exact
        path="/:category"
        component={() => <TaskList taskList={taskList} category={category} />}
      />
      <Route
        exact
        path="/tasks/categories"
        component={() => <Categories />}
      />
      <Route
        exact
        path="/:category/:timespan"
        component={() => <TaskList taskList={time} category={category} />}
      />
    </div>
  )
}

Home.propTypes = {}

export default Home
