import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Header = ({ category }) => {
  const [addCategory, setAddCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const saveCategory = (name) => {
    axios.post(`/api/v1/tasks/${name}`, { name })
  }
  return (
    <div>
      <div>
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {category && (
                <>
                  <div className="hidden md:block">
                    <div className="flex items-baseline space-x-4">
                      <Link
                        to={`/${category}`}
                        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-500 ease-in-out"
                      >
                        All Tasks
                      </Link>

                      <Link
                        to={`/${category}/month`}
                        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-500 ease-in-out"
                      >
                        Month Tasks
                      </Link>

                      <Link
                        to={`/${category}/week`}
                        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-500 ease-in-out"
                      >
                        Week Tasks
                      </Link>

                      <Link
                        to={`/${category}/day`}
                        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-500 ease-in-out"
                      >
                        Day Tasks
                      </Link>
                    </div>
                  </div>
                </>
              )}
              {!category &&
                (!addCategory ? (
                  <>
                    <button
                      type="button"
                      className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-500 ease-in-out focus:outline-none"
                      onClick={() => {
                        setAddCategory(true)
                      }}
                    >
                      Add Category
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="border-1 border-solid border-black bg-gray-300 rounded outline-none mr-3 pl-1 pt-1 pb-1"
                      placeholder="Type Name"
                      onChange={(e) => {
                        setCategoryName(e.target.value)
                      }}
                      value={categoryName}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-500 ease-in-out focus:outline-none"
                      onClick={() => {
                        saveCategory(categoryName)
                        setAddCategory(false)
                      }}
                    >
                      Save
                    </button>
                  </div>
                ))}
              <div>
                <Link
                  to="/tasks/categories"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-500 ease-in-out focus:outline-none"
                >
                  All Categories
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <header>
        <div className="categoryName border-b-2 border-black-900 mb-6">
          <h1 className="text-4xl m-6 text-bold">{category || 'Главная'}</h1>
        </div>
      </header>
    </div>
  )
}

export default Header
