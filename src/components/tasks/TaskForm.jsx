
import { useState } from 'react';
// import axios from 'axios';
import axiosInstance from '../middleware/axiosInstance';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    assignedTo: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axiosInstance.post('/tasks', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Task created successfully!');
        // Refresh tasks or update state as needed
      } catch (error) {
        console.error('Task creation error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Task Title" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Task Description" required></textarea>
      <input type="text" name="status" value={formData.status} onChange={handleChange} placeholder="Task Status" />
      <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange} placeholder="Assigned To" />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
