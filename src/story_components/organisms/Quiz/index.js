import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Animate from "react-move/Animate";
import { withCaption } from "providers";
import {
  Alert,
  Button,
  FlexContainer,
  Icon,
  NarrowContainer
} from "story_components";
import { choices } from "utils/mathHelpers";
import COLORS from "utils/styles";

const StyledQuizArea = styled.div`
  border-radius: 0.2rem;
  background-color: ${COLORS.LIGHT_GRAY};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex-direction: column;
  min-height: 50vh;
  overflow: hidden;
`;

const StyledAlertP = styled.p`
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

function Quiz({ answerColors, maxQuestions, questionData, title }) {
  const [questions, setQuestions] = useState(
    choices(questionData, maxQuestions)
  );
  const [answers, setAnswer] = useState(null);
  let panel;
  if (answers === null) {
    panel = <QuizStart title={title} handleClick={() => setAnswer([])} />;
  } else if (answers.length === questions.length) {
    panel = (
      <QuizEnd
        answers={answers}
        questions={questions}
        reset={() => {
          setQuestions(choices(questionData, maxQuestions));
          setAnswer(null);
        }}
      />
    );
  } else {
    panel = (
      <QuizQuestion
        answerColors={answerColors}
        currentNum={answers.length + 1}
        handleSubmit={answer => setAnswer([...answers, answer])}
        question={questions[answers.length]}
        totalNum={questions.length}
      />
    );
  }
  return <StyledQuizArea>{panel}</StyledQuizArea>;
}

function QuizStart({ title, handleClick }) {
  return (
    <React.Fragment>
      <h1>{title}</h1>
      <NarrowContainer width="50%" fullWidthAt="small">
        <Button large color={COLORS.ORANGE} onClick={handleClick}>
          Start Quiz!
        </Button>
      </NarrowContainer>
    </React.Fragment>
  );
}

function QuizQuestion({
  answerColors,
  question,
  handleSubmit,
  currentNum,
  totalNum
}) {
  const [answer, setAnswer] = useState(null);
  const { prompt, choices } = question;
  return (
    <React.Fragment>
      <h1>
        Question {currentNum} of {totalNum}:
      </h1>
      <h3>{prompt}</h3>
      <NarrowContainer width="50%" fullWidthAt="small" center>
        {choices.map((choice, i) => (
          <Button
            color={answer === choice ? answerColors[i] : COLORS.GRAY}
            key={choice}
            onClick={() => setAnswer(choice)}
          >
            {choice}
          </Button>
        ))}
        <Button
          color={COLORS.ORANGE}
          disabled={!answer}
          onClick={() => {
            handleSubmit(answer);
            setAnswer(null);
          }}
        >
          {currentNum < totalNum ? "Next Question" : "Show My Results"}
        </Button>
      </NarrowContainer>
    </React.Fragment>
  );
}

function QuizEnd({ answers, questions, reset }) {
  const [idx, setIdx] = useState(0);
  const numCorrect = answers.reduce(
    (total, answer, idx) => total + +(questions[idx].answer === answer),
    0
  );
  const question = questions[idx];
  const answer = answers[idx];
  const leftDisabled = idx === 0;
  const rightDisabled = idx === questions.length - 1;
  return (
    <NarrowContainer width="100%" center>
      <h2>
        You answered {numCorrect} out of {answers.length} questions correctly.
      </h2>
      <h3>Accuracy: {((numCorrect * 100) / answers.length).toFixed(2)}%</h3>
      <p>Answer details:</p>
      <Animate
        show
        start={{ marginLeft: 0 }}
        update={() => {
          console.log("in update");
          return { marginLeft: [idx * 105] };
        }}
      >
        {({ marginLeft }) => (
          <FlexContainer cross="center">
            <Icon
              name="chevron-left"
              disabled={leftDisabled}
              hover={!leftDisabled}
              onClick={() => !leftDisabled && setIdx(idx - 1)}
              opacity={leftDisabled ? 0.4 : 1}
              padding="0 0.25rem 0 0"
              size={2}
            />
            <FlexContainer style={{ overflow: "hidden" }}>
              {questions.map((q, i) => (
                <Alert
                  key={i}
                  center
                  color={q.answer === answers[i] ? COLORS.GREEN : COLORS.RED}
                  style={{
                    flex: "0 0 auto",
                    marginRight: "5%",
                    marginLeft: i === 0 ? `${-marginLeft}%` : 0
                  }}
                >
                  <StyledAlertP>
                    <b>{q.prompt}</b>
                  </StyledAlertP>
                  <StyledAlertP>
                    You chose: <b>{answers[i]}</b>. Correct answer:{" "}
                    <b>{q.answer}</b>.
                  </StyledAlertP>
                </Alert>
              ))}
            </FlexContainer>
            <Icon
              name="chevron-right"
              disabled={rightDisabled}
              hover={!rightDisabled}
              onClick={() => !rightDisabled && setIdx(idx + 1)}
              opacity={rightDisabled ? 0.4 : 1}
              padding="0 0 0 0.25rem"
              size={2}
            />
          </FlexContainer>
        )}
      </Animate>
      <NarrowContainer width="50%" fullWidthAt="small">
        <Button large color={COLORS.ORANGE} onClick={reset}>
          Try Again!
        </Button>
      </NarrowContainer>
    </NarrowContainer>
  );
}

Quiz.propTypes = {
  answerColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxQuestions: PropTypes.number.isRequired,
  questionData: PropTypes.arrayOf(
    PropTypes.shape({
      prompt: PropTypes.string.isRequired,
      choices: PropTypes.arrayOf(PropTypes.string).isRequired,
      answer: PropTypes.string.isRequired
    })
  ),
  title: PropTypes.string.isRequired
};

Quiz.defaultProps = {
  answerColors: [COLORS.ORANGE, COLORS.GREEN, COLORS.BLUE],
  maxQuestions: 4,
  questionData: [
    {
      prompt: "What is the meaning of life, the universe, and everything?",
      choices: ["41", "42", "43"],
      answer: "42"
    }
  ],
  title: "This is a quiz."
};

export default withCaption(Quiz);
