// frontend/src/components/tasks/TaskList.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import TaskFilter from './TaskFilter';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    isCompleted: '',
    priority: '',
    tags: '',
    sort: '-createdAt'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let query = '';
        const queryParams = [];
        
        if (filter.isCompleted) {
          queryParams.push(`isCompleted=${filter.isCompleted}`);
        }
        if (filter.priority) {
          queryParams.push(`priority=${filter.priority}`);
        }
        if (filter.tags) {
          queryParams.push(`tags=${filter.tags}`);
        }
        if (filter.sort) {
          queryParams.push(`sort=${filter.sort}`);
        }
        if (searchTerm) {
          queryParams.push(`title[regex]=${searchTerm}&options=i`);
        }
        
        if (queryParams.length > 0) {
          query = `?${queryParams.join('&')}`;
        }
        
        const res = await axios.get(`/api/v1/tasks${query}`);
        setTasks(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/v1/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting task');
      }
    }
  };

  const toggleComplete = async (id, isCompleted) => {
    try {
      await axios.put(`/api/v1/tasks/${id}`, { isCompleted: !isCompleted });
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, isCompleted: !isCompleted } : task
      ));
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating task');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Link
          to="/tasks/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> New Task
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TaskFilter filter={filter} setFilter={setFilter} />
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.isCompleted ? 'task-completed' : ''} ${
                task.priority === 'high' ? 'task-high-priority' :
                task.priority === 'medium' ? 'task-medium-priority' :
                'task-low-priority'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => toggleComplete(task._id, task.isCompleted)}
                      className="h-5 w-5 text-primary-500 rounded focus:ring-primary-500 mr-3"
                    />
                    <Link
                      to={`/tasks/${task._id}`}
                      className={`text-lg font-medium hover:text-primary-500 ${
                        task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </Link>
                  </div>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {task.dueDate && (
                    <p className="text-sm text-gray-500 mt-2">
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/tasks/edit/${task._id}`}
                    className="text-secondary-500 hover:text-secondary-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;