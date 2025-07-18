// frontend/src/pages/TasksPage.jsx
import { useState } from 'react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/common/Button';
import useTasks from '../hooks/useTasks';

const TasksPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { tasks, loading, error, createTask } = useTasks();

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
    setShowForm(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Task'}
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-8">
          <TaskForm onSubmit={handleCreateTask} />
        </div>
      )}
      
      <TaskList tasks={tasks} />
    </div>
  );
};

export default TasksPage;