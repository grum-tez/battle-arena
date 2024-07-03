import React from 'react';

type UserInputSubtask = {
  userInput: string;
  completed: boolean;
};

type UserInputTask = {
  subtasks: (UserInputSubtask | null)[];
};

type CheckboxSubtask = {
  type: 'checkbox';
  instructionText: string | null;
  checkboxLabel: string;
  hints: string[];
  completed: boolean;
  completionText: string | null;
};

type TextInputSubtask = {
  type: 'textInput';
  instructionText: string | null;
  hints: string[];
  correctInput: RegExp;
  completionText: string | null;
  textInputLabel: string;
};

type Subtask = CheckboxSubtask | TextInputSubtask;
interface Task {
  index: number;
  title: string;
  introduction: string;
  subtasks: Subtask[];
}

interface LearningTasksContextProps {
  currentTask: Task;
  isNextDisabled: boolean;
  isPreviousDisabled: boolean;
  handleNextTask: () => void;
  handlePreviousTask: () => void;
  updateUserInput: (taskIndex: number, subtaskIndex: number, input: string) => void;
  userInputs: UserInputTask[];
}

const LearningTasksContext = React.createContext<LearningTasksContextProps>({
  currentTask: { index: 0, title: '', introduction: '', subtasks: [] },
  isNextDisabled: false,
  isPreviousDisabled: false,
  handleNextTask: () => {},
  handlePreviousTask: () => {},
  updateUserInput: () => {},
  userInputs: [],
});

const useLearningTasksContext = () => React.useContext(LearningTasksContext);

export { LearningTasksContext, useLearningTasksContext };
export type { LearningTasksContextProps, CheckboxSubtask, TextInputSubtask, Task, Subtask, UserInputSubtask, UserInputTask
 };
