import React from 'react';
import { CheckboxSubtask as CheckboxSubtaskType } from '../context/LearningTasksContext';
import Hint from './Hint';

interface CheckboxSubtaskProps {
  subtask: CheckboxSubtaskType;
}

const CheckboxSubtask: React.FC<CheckboxSubtaskProps> = ({ subtask }) => {
  return (
    <div className="subtask-container">
      {subtask.instructionText && (
        <div className="instruction" dangerouslySetInnerHTML={{ __html: subtask.instructionText }}></div>
      )}
      <div className="subtask-content">
        <div className="checkbox-item">
          <div className="checkbox-content">
            <input
              type="checkbox"
              checked={subtask.completed}
              readOnly
            />
            <label dangerouslySetInnerHTML={{ __html: subtask.checkboxLabel }}></label>
          </div>
        </div>
      </div>
      {subtask.completed && (
        <div className="post-complete-text">
          {subtask.completionText}
        </div>
      )}
      {subtask.hints.length > 0 && <Hint hints={subtask.hints} />}
    </div>
  );
};

export default CheckboxSubtask;
