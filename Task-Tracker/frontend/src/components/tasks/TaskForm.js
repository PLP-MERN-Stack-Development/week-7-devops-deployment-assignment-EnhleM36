// frontend/src/components/tasks/TaskForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import FileUpload from './FileUpload';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      priority: 'medium',
      dueDate: '',
      isCompleted: false
    }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        try {
          const res = await axios.get(`/api/v1/tasks/${id}`);
          const task = res.data.data;
          
          setValue('title', task.title);
          setValue('description', task.description);
          setValue('tags', task.tags);
          setValue('priority', task.priority);
          setValue('dueDate', format(new Date(task.dueDate), 'yyyy-MM-dd'));
          setValue('isCompleted', task.isCompleted);
          
          setAttachments(task.attachments || []);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Error fetching task');
          navigate('/tasks');
        }
      };
      
      fetchTask();
    }
  }, [id, isEdit, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      const taskData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null
      };
      
      if (isEdit) {
        await axios.put(`/api/v1/tasks/${id}`, taskData);
        toast.success('Task updated successfully');
      } else {
        await axios.post('/api/v1/tasks', taskData);
        toast.success('Task created successfully');
      }
      
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving task');
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await axios.put(`/api/v1/tasks/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAttachments([...attachments, res.data.data]);
      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await axios.delete(`/api/v1/tasks/${id}/upload/${fileId}`);
      setAttachments(attachments.filter(file => file._id !== fileId));
      toast.success('File deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting file');
    }
  };

  const tagOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Task' : 'Create New Task'}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Title is required' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              errors.title ? 'border-red-500' : 'border'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'Description is required' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              errors.description ? 'border-red-500' : 'border'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags *</label>
          <div className="mt-2 space-y-2">
            {tagOptions.map((tag) => (
              <label key={tag.value} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value={tag.value}
                  {...register('tags', { required: 'At least one tag is required' })}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span className="ml-2">{tag.label}</span>
              </label>
            ))}
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              {...register('dueDate')}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
        
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register('isCompleted')}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Mark as completed</span>
              </label>
            </div>
          </div>
        )}
        
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <FileUpload 
              onUpload={handleFileUpload} 
              uploading={uploading} 
            />
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file) => (
                  <div key={file._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800"
                      >
                        {file.filename}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileDelete(file._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;