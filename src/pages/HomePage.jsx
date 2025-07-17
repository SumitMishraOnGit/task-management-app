import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/Tasks/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import FloatingActionButton from '../components/FloatingActionButton';

export default function HomePage() {
  // Dummy task data as initial state for the hook
  const initialTasks = [
    {
      id: '1',
      title: 'Design Homepage Layout',
      description: 'Create wireframes and mockups for the new website homepage. This includes developing initial concepts, sketching out layouts, and refining designs based on feedback. The goal is to create an intuitive and visually appealing user experience that aligns with the brand guidelines. This is a very important task that requires significant attention to detail and creative thinking to ensure the final product is impactful and effective in engaging users. It will involve multiple iterations and close collaboration with the marketing and development teams to ensure all aspects are covered and integrated seamlessly into the overall project plan.',
      dueDate: '2025-07-15',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Develop User Authentication',
      description: 'Implement user registration, login, and password reset functionalities. This involves setting up secure API endpoints, integrating with a database for user data storage, and ensuring robust error handling. Special attention should be paid to password hashing, session management, and protecting against common security vulnerabilities like XSS and CSRF. Unit and integration tests must be written to ensure the reliability and security of the authentication system. This is a critical component for the entire application.',
      dueDate: '2025-07-20',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Write API Documentation',
      description: 'Document all REST API endpoints with examples and error codes. Ensure the documentation is clear, concise, and easy to understand for developers integrating with our services. Include request and response examples for all major operations, detailed explanations of parameters, and a comprehensive list of possible error codes with their meanings. Use a tool like Swagger or Postman to generate interactive documentation if possible. This task is crucial for external and internal teams to efficiently utilize the API.',
      dueDate: '2025-07-10',
      status: 'completed',
      completedDate: '2025-07-09' // Added for sorting completed tasks
    },
    {
      id: '4',
      title: 'Prepare Marketing Presentation',
      description: 'Create slides and talking points for the Q3 marketing review. The presentation should highlight key achievements, upcoming campaigns, market analysis, and strategic recommendations. Ensure all data is accurate and visually represented effectively. Practice the presentation to ensure a smooth delivery and be prepared to answer questions from stakeholders. This presentation will be shared with senior management.',
      dueDate: '2025-07-25',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Fix Bug in Payment Gateway',
      description: 'Investigate and resolve the issue with failed transactions. This requires debugging the payment processing flow, checking logs for errors, and collaborating with the payment gateway provider if necessary. Implement thorough testing to ensure the fix is robust and does not introduce new issues. Document the root cause and the solution for future reference. This is a high-priority bug affecting user experience.',
      dueDate: '2025-07-12',
      status: 'completed',
      completedDate: '2025-07-11' // Added for sorting completed tasks
    },
    {
      id: '6',
      title: 'Review Code for Module A',
      description: 'Perform a thorough code review for the newly developed Module A. Focus on code quality, adherence to coding standards, performance implications, and potential security vulnerabilities. Provide constructive feedback to the developer and ensure all identified issues are addressed before merging the code. This is an essential step to maintain code integrity.',
      dueDate: '2025-07-18',
      status: 'pending',
    },
    {
      id: '7',
      title: 'Plan Next Sprint Features',
      description: 'Outline features and user stories for the upcoming sprint. This involves gathering requirements from product owners, prioritizing tasks, and estimating effort. Break down large features into smaller, manageable user stories that can be completed within a single sprint. Ensure clear acceptance criteria for each story. This planning session will set the direction for the next development cycle.',
      dueDate: '2025-07-22',
      status: 'completed',
      completedDate: '2025-07-10' // Added for sorting completed tasks
    },
  ];

  const { sortedTasks, addTask, toggleTaskStatus, updateTask, deleteTask } = useTasks(initialTasks);

  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const [isTaskDetailsPopupOpen, setIsTaskDetailsPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setIsTaskDetailsPopupOpen(true);
  };

  const closeTaskDetails = () => {
    setIsTaskDetailsPopupOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-neutral-900/50 text-neutral-100 font-sans flex items-stretch justify-center relative" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="w-screen dashboard-card rounded-xl shadow-lg p-6 md:p-8 flex flex-col min-h-screen m-4">
        <div className="flex-1 overflow-auto">
          <TaskList
            sortedTasks={sortedTasks}
            toggleTaskStatus={toggleTaskStatus}
            openTaskDetails={openTaskDetails}
            deleteTask={deleteTask}
          />
        </div>
      </div>

      <FloatingActionButton onClick={() => setIsAddTaskPopupOpen(true)} />

      {isAddTaskPopupOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskPopupOpen(false)}
          onAddTask={addTask}
        />
      )}

      {isTaskDetailsPopupOpen && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={closeTaskDetails}
          onSave={updateTask}
        />
      )}
    </div>
  );
}