import React from 'react';
import { Subtask as SubtaskType } from '../context/LearningTasksContext';
import CheckboxSubtask from './CheckboxSubtask';
import TextInputSubtask from './TextInputSubtask';

interface SubtaskProps {
  subtask: SubtaskType;
  taskIndex: number;
  index: number;
}

const Subtask: React.FC<SubtaskProps> = ({ subtask, taskIndex, index }) => {
  if (subtask.type === 'checkbox') {
    return <CheckboxSubtask subtask={subtask} />;
  } else if (subtask.type === 'textInput') {
    return <TextInputSubtask subtask={subtask} taskIndex={taskIndex} subtaskIndex={index} />;
  }

  return null;
};

export default Subtask;
