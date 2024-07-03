import React, { useState } from 'react';

interface HintProps {
  hints: string[];
}

const Hint: React.FC<HintProps> = ({ hints }) => {
  const [showHints, setShowHints] = useState(false);
  const [activeHint, setActiveHint] = useState<number | null>(null);

  const toggleHints = () => {
    setShowHints(!showHints);
    if (showHints) {
      setActiveHint(null);
    }
  };

  const toggleHint = (index: number) => {
    setActiveHint(activeHint === index ? null : index);
  };

  if (hints.length === 0) return null;

  return (
    <div className="hints-container">
      <h4 onClick={toggleHints} style={{ cursor: 'pointer' }}>
        {showHints ? 'Hints: (hide)' : 'Show hints'}
      </h4>
      {showHints && (
        <>
          <div className="hints-row">
            {hints.map((_, index) => (
              <button
                key={index}
                className={`hint-circle ${activeHint === index ? 'active' : ''}`}
                onClick={() => toggleHint(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {activeHint !== null && (
            <div className="hint-content" dangerouslySetInnerHTML={{ __html: hints[activeHint] }} />
          )}
        </>
      )}
    </div>
  );
};

export default Hint;
