import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { button } from '@storybook/addon-knobs'

const Categories = () => {
  const [allCategories, setAllCategories] = useState([])
  const [delCategory, setDelCategory] = useState(false)
  const [editCategoryName, setEditCategoryName] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  useEffect(() => {
    axios('/api/v1/categories').then(({ data }) => setAllCategories(data))
  })
  const deleteCategory = (category) => {
    axios.delete(`/api/v1/tasks/${category}`)
  }
  const changeCategoryName = (oneCategory, categoryChangedName) => {
    axios.patch(`/api/v1/tasks/${oneCategory}`, { categoryChangedName })
  }
  return (
    <div className="px-2">
      <h2 className="text-center text-5xl mb-1">Categories:</h2>
      {allCategories.map((oneCategory, idx) => {
        return (
          <div
            key={oneCategory}
            className=" text-center border-2 border-solid border-black mb-5 flex justify-between p-2 items-center"
          >
            <div className="flex items-center">
              {editCategoryName === false && (
                <button
                  type="button"
                  className="m-3 bg-green-500 p-1 rounded-md pl-2 pr-2 hover:bg-green-400 transition duration-500 ease-in-out focus:outline-none"
                  onClick={() => {
                    setCategoryName(oneCategory)
                    setEditCategoryName(true)
                  }}
                >
                  Edit
                </button>
              )}
              {editCategoryName ? (
                <>
                  <input
                    type="text"
                    className="border-1 border-solid border-black bg-gray-300 rounded outline-none mr-3 p-2"
                    onChange={(e) => {
                      setCategoryName(e.target.value)
                    }}
                    value={categoryName}
                  />
                  <button
                    type="button"
                    className="m-3 bg-yellow-500 p-1 rounded-md pl-2 pr-2 hover:bg-yellow-400 transition duration-500 ease-in-out focus:outline-none"
                    onClick={() => {
                      changeCategoryName(oneCategory, categoryName)
                      setEditCategoryName(false)
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <Link to={`/${oneCategory}`}>
                  <h2 className="text-3xl hover:text-purple-500 transition duration-500 ease-in-out">
                    {`${idx + 1}. ${oneCategory}`}
                  </h2>
                </Link>
              )}
            </div>
            {delCategory ? (
              <div className="flex flex-col">
                <p className="text-red-900 text-base">Are you sure?</p>
                <div className="flex justify-evenly">
                  <button
                    type="button"
                    className="px-1 py-1 rounded-md text-sm font-medium text-white bg-red-700 focus:outline-none hover:bg-red-600 transition duration-500 ease-in-out"
                    onClick={() => {
                      setDelCategory(false)
                      deleteCategory(oneCategory)
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="px-1 py-1 rounded-md text-sm font-medium text-white bg-green-700 focus:outline-none hover:bg-green-600 transition duration-500 ease-in-out"
                    onClick={() => {
                      setDelCategory(false)
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 focus:outline-none hover:bg-red-400 transition duration-500 ease-in-out"
                onClick={() => {
                  setDelCategory(true)
                }}
              >
                Delete
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Categories
