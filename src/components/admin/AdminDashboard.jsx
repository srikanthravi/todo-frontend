import { useState, useEffect } from 'react';
// import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskList from '../tasks/TaskList';
import axiosInstance from '../middleware/axiosInstance';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedUserId: '', // Assuming you have user IDs for assignment
  });
  const [editingTask, setEditingTask] = useState(null);
 

  useEffect(() => {
    fetchTasks();
    fetchUserRole();
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

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/tasks', newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', assignedUserId: '' }); // Clear form after successful addition
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedTaskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTaskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? response.data : task
      );
      setTasks(updatedTasks);
      setEditingTask(null); // Clear editing state after successful update
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      assignedUserId: task.assignedUserId,
    });
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`/tasks/${taskId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="min-h-screen flex overflow-y-hidden flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-[90%]">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard - Todo Operations</h2>
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-200 p-4 w-100 rounded-lg">
            <h3 className="text-lg font-medium">Task List</h3>
            <TaskList
              tasks={tasks}
              onEditTask={handleEditTask} // Pass handleEditTask to TaskList
              onDeleteTask={handleDeleteTask}
              onCompleteTask={handleCompleteTask} // Pass handleCompleteTask to TaskList
            />
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium">{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
            <form onSubmit={editingTask ? (e) => { e.preventDefault(); handleUpdateTask(editingTask.id, newTask); } : handleAddTask} className="space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Assigned User ID"
                value={newTask.assignedUserId}
                onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
    