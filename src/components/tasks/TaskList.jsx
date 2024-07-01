import PropTypes from 'prop-types';

const TaskList = ({ tasks, onEditTask, onDeleteTask, onCompleteTask }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className="flex justify-between items-center bg-white p-4 rounded-md shadow-md mb-2">
          <div>
            <h4 className="font-bold">{task.title}</h4>
            <p>{task.description}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onEditTask(task)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md"
            >
              Delete
            </button>
            <button
              onClick={() => onCompleteTask(task.id)}
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-md"
            >
              Complete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      assignedUserId: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onCompleteTask: PropTypes.func.isRequired,
};

export default TaskList;
