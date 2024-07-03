import React from 'react';
import { TextInputSubtask as TextInputSubtaskType, useLearningTasksContext } from '../context/LearningTasksContext';
import Hint from './Hint';

interface TextInputSubtaskProps {
  subtask: TextInputSubtaskType;
  taskIndex: number;
  subtaskIndex: number;
}

const TextInputSubtask: React.FC<TextInputSubtaskProps> = ({ subtask, taskIndex, subtaskIndex }) => {
  const { updateUserInput, userInputs } = useLearningTasksContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    updateUserInput(taskIndex, subtaskIndex, input);
  };

  const userInput = userInputs[taskIndex]?.subtasks[subtaskIndex]?.userInput || '';
  const completedByUser = userInputs[taskIndex]?.subtasks[subtaskIndex]?.completed || false;

  return (
    <div className="subtask-container">
      {subtask.instructionText && (
        <div className="instruction" dangerouslySetInnerHTML={{ __html: subtask.instructionText }}></div>
      )}
      <div className="subtask-content">
        <div className="text-input-item">
          <div className="checkbox-content">
            <input
              type="checkbox"
              checked={completedByUser}
              readOnly
            />
            <label>{subtask.textInputLabel}</label>
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter your answer"
          />
        </div>
      </div>
      {completedByUser && (
        <div className="post-complete-text">
          {subtask.completionText}
        </div>
      )}
      {subtask.hints.length > 0 && <Hint hints={subtask.hints} />}
    </div>
  );
};

export default TextInputSubtask;
