import React, { useContext, useEffect, useRef } from "react";
import "./answer.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Endpoint from "../../api";
import AuthContext from "../../context/AuthContext";
import timeFormater from "../../utils/timeformater";
const DeleteAnswer= ({
    fetchAnswers,
    deleteOverlay,
    setdeleteOverlay,
    answerToBeDeleted,
    question_id
  }) => {
    const deleteanswer = async () => {
      try {
        const response = await axios.delete(
          `${Endpoint()}/forum/questions/${question_id}/answers/${answerToBeDeleted.id}/`
        );
        setdeleteOverlay(!deleteOverlay);
        fetchAnswers();
      } catch (e) {
        console.log(e);
      }
    };
    return (
      <div className="overlay-container">
        <div className="overlay-box">
          <i
            onClick={() => {
              document.body.style.overflowY = "scroll";
              setdeleteOverlay(!deleteOverlay);
            }}
            className="fa-solid fa-x"
          ></i>
  
          <div className="event-inputs">
            <div style={{ margin: "30px" }}>
              <h2>Are you sure to delete this answer</h2>
              <p  style={{borderRadius:"10px",border:"1px solid silver", padding:"10px", marginTop: "20px", fontSize: "20px" }}>
                {answerToBeDeleted.answer}
              </p>
            </div>
  
            <button
              onClick={() => deleteanswer()}
              type="submit"
              className="create-event-btn"
              style={{ margin: "30px", color:"white" , background:"red"}}
            >
              Delete answer
            </button>
          </div>
        </div>
      </div>
    );
  };
const EditAnswer = ({ fetchAnswers, editOverlay, setEditOverlay ,question_id,answerToBeEdited }) => {
  const [NewEditedAnswer, setNewEditedAnswer] = useState(answerToBeEdited.answer)
  const editanswer = async (e) => {
   
      e.preventDefault();
      try {
        const response = await axios.patch(
          `${Endpoint()}/forum/questions/${question_id}/answers/${answerToBeEdited.id}/`,
          {
            answer: NewEditedAnswer,
          }
        );
        fetchAnswers();
        setEditOverlay(!editOverlay);
      } catch (e) {
        console.log(e);
      }

  }
  return (
    <div className="overlay-container">
    <div className="overlay-box">
      <i
        onClick={() => {
          document.body.style.overflowY = "scroll";
          setEditOverlay(!editOverlay);
        }}
        className="fa-solid fa-x"
      ></i>
      <form
        onSubmit={editanswer}
        className="event-form"
        encType="multipart/form-data"
      >
        <div className="event-inputs">
          <h2>Edit your Answer</h2>
          <textarea
            type="text"
            required
            className="event-desc"
            name="question"
            value={NewEditedAnswer}
            onChange={(e) => setNewEditedAnswer(e.target.value)}
            placeholder="write question here ..."
          ></textarea>
        </div>
        <button
          onClick={() => (document.body.style.overflowY = "scroll")}
          type="submit"
          className="create-event-btn"
        >
          Edit Answer
        </button>
      </form>
    </div>
  </div>
  )
};

const Answer = () => {
  const { user } = useContext(AuthContext);
  const { question_id } = useParams();
  const [answerOverlay, setAnswerOverlay] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answerData, setanswerData] = useState({
    answer: "",
    question: question_id,
    user_id: user.user_id,
  });
  const [question, setQuestion] = useState([]);
  const [editOverlay, setEditOverlay] = useState(false);
  const [answerTobeEdited, setAnswerToBeEdited] = useState("");
  const [deleteOverlay, setdeleteOverlay] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setanswerData({ ...answerData, [name]: value });
  };
  const getQuestion = async () => {
    const response = await axios.get(
      `${Endpoint()}forum/questions/${question_id}/`
    );
    setQuestion(response.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${Endpoint()}forum/questions/${question_id}/answers/`,
        answerData
      );
      fetchAnswers();
      setAnswerOverlay(!answerOverlay);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchAnswers = async () => {
    const response = await axios.get(
      `${Endpoint()}forum/questions/${question_id}/answers/`
    );
    setAnswers(response.data);
  };
  useEffect(() => {
    getQuestion();
    fetchAnswers();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="answer-container">
      {editOverlay && <EditAnswer fetchAnswers={fetchAnswers} editOverlay={editOverlay} setEditOverlay={setEditOverlay } question_id={question_id} answerToBeEdited={answerTobeEdited} />}
   { deleteOverlay &&  <DeleteAnswer setdeleteOverlay={setdeleteOverlay} deleteOverlay={deleteOverlay} fetchAnswers={fetchAnswers} answerToBeDeleted={answerTobeEdited} question_id={question_id}/>}
      <i onClick={() => navigate(-1)} className="fas fa-arrow-left"></i>
      <div className="question-box">
        {question.author && (
          <div className="q-head">
            <img src={question.author.profile_pic} className="q-creator" />
            <span>
              {question.author.name}
              <br />
              {timeFormater(question.created_date)}
            </span>
          </div>
        )}
        <div style={{ margin: "20px", marginTop: "0", padding: "10px" }}>
          <span className="question">{question.question}</span>
        </div>
        <div>
          <button
            onClick={() => setAnswerOverlay(!answerOverlay)}
            className="ans-btn"
          >
            <i className="fas fa-pen"></i> answer
          </button>
        </div>
      </div>
      {answerOverlay && (
        <div className="overlay-container">
          <div className="overlay-box">
            <i
              onClick={() => {
                document.body.style.overflowY = "scroll";
                setAnswerOverlay(!answerOverlay);
              }}
              className="fa-solid fa-x"
            ></i>
            <form
              onSubmit={handleSubmit}
              className="event-form"
              encType="multipart/form-data"
            >
              <div className="event-inputs">
                <h3 style={{padding:"10px"}}>{question.question}</h3>
                <textarea
                  onChange={handleChange}
                  type="text"
                  className="event-desc"
                  name="answer"
                  placeholder="your answer ..."
                ></textarea>
              </div>
              <button
                onClick={() => (document.body.style.overflowY = "scroll")}
                type="submit"
                className="create-event-btn"
              >
                Answer
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="answer-box">
        <div className="answer-header">
          <span style={{ padding: "20px" }}>Answers</span>
          <span style={{ padding: "20px", marginLeft: "auto" }}>Recent </span>
        </div>
        {answers.length > 0 ? (
          answers.reverse().map((answer) => (
            <div
              key={answer.id}
              style={{ margin: "20px", boxShadow: "none" }}
              className="answer-card"
            >
              <div className="q-head">
                <img src={answer.user.profile_pic} className="a-creator" />
                <span>
                  {answer.user.name}
                  <br /> <small>feb 22,2222</small>
                </span>
              </div>

              <div className="a-content">
                <div className="answer">{answer.answer}</div>

                <button className="edit-btns" style={{ marginLeft: "auto" }}>
                  {user.user_id === answer.user.id ? (
                    <>
                      <i onClick={()=>{setAnswerToBeEdited(answer), setEditOverlay(!editOverlay)}} className="fa-regular fa-pen-to-square"></i>
                      <i onClick={()=> {setAnswerToBeEdited(answer) , setdeleteOverlay(!deleteOverlay)}} className="fa-solid fa-trash"></i>
                    </>
                  ) : (
                    ""
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ margin: "20px", boxShadow: "none" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "20px" }}>
                No answers yet be the first to{" "}
                <button
                  onClick={() => setAnswerOverlay(!answerOverlay)}
                  style={{
                    padding: "10px",
                    borderRadius: "25px",
                    border: "none",
                    background: "purple",
                    color: "white",
                  }}
                >
                  answer
                </button>
              </span>
              <div className="answer">
                <img src="/empty.gif" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Answer;
