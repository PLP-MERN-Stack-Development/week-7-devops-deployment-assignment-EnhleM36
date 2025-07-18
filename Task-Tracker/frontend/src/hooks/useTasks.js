// frontend/src/hooks/useTasks.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks', { params: filters });
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [filters]);

  const createTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    setTasks([...tasks, data]);
    return data;
  };

  return { tasks, loading, error, createTask };
};

export default useTasks;