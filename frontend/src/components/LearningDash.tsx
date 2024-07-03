import React from 'react';
import '../styles/LearningDash.css';
import { useLearningTasksContext } from '../context/LearningTasksContext';
import Subtask from './Subtask';

const LearningDash: React.FC = () => {
  const {
    currentTask,
    isNextDisabled,
    isPreviousDisabled,
    handleNextTask,
    handlePreviousTask,
  } = useLearningTasksContext();

  if (!currentTask) {
    console.log('Current Task is undefined or null');
    return <div>Loading...</div>;
  }

  return (
    <div className="learning-dash">
      <h2>{currentTask.title}</h2>
      <p dangerouslySetInnerHTML={{ __html: currentTask.introduction }}></p>
      <div className="subtasks">
        {currentTask.subtasks.map((subtask, index) => (
          <React.Fragment key={index}>
            <Subtask
              subtask={subtask}
              taskIndex={currentTask.index}
              index={index}
            />
            {index < currentTask.subtasks.length - 1 && <hr className="subtask-divider" />}
          </React.Fragment>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePreviousTask} disabled={isPreviousDisabled}>Previous</button>
        <button onClick={handleNextTask} disabled={isNextDisabled}>Next</button>
      </div>
    </div>
  );
};

export default LearningDash;
