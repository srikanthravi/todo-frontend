import { useState, useEffect } from 'react';
// import axios from 'axios';
import axiosInstance from '../middleware/axiosInstance';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">User Dashboard - Task List</h2>
        <div className="flex flex-col space-y-4">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className="bg-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-600">Assigned to: {task.assignedUserId}</p>
              </div>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
