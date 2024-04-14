import { useContext, useEffect, useState } from "react";
import "./discussion.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Endpoint from "../../api";
import AuthContext from "../../context/AuthContext";
import EditQuestion from "./Edit";
import DeleteQuestion from "./Delete";
import timeFormater from "../../utils/timeformater";

const Discussion = () => {
  const { user } = useContext(AuthContext);
  const [isQuestionOverlay, setQuestionOverlay] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editOverlay, setEditOverlay] = useState(false);
  const [deleteOverlay, setdeleteOverlay] = useState(false);
  const [questionToBeDeleted, setquestionToBeDeleted] = useState("");
  const [questionTobeEdited, setQuestionToBeEdited] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [questionData, setQuestionData] = useState({
    question: "",
    author_id: user?.user_id,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };
  const shareLink = (link) => {
    navigator.clipboard.writeText(link);
    alert(`${link}"Link copied to clipboard!"`);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(questionData);
    try {
      const response = await axios.post(
        `${Endpoint()}forum/questions/`,
        questionData
      );
      setQuestionOverlay(!isQuestionOverlay);
      fetchQuestions();
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleUpvote = async (questionID, userId) => {
    try {
      let form_data = new FormData();
      form_data.append("user_id", [userId]);
      await axios.post(`${Endpoint()}forum/${questionID}/upvote/`, form_data);
      fetchQuestions();
    } catch (error) {
      console.error("Error upvoting the question:", error);
    }
  };

  const handleDownvote = async (questionID, userId) => {
    try {
      let form_data = new FormData();
      form_data.append("user_id", [userId]);
      await axios.post(`${Endpoint()}forum/${questionID}/downvote/`, form_data);
      fetchQuestions();
    } catch (error) {
      console.error("Error downvoting the question:", error);
    }
  };

  const handleSearch = async () => {
    const response = await axios.get(
      `${Endpoint()}/forum/questions?search=${searchTerm}`
    );
    setQuestions(response.data);
  };
  const fetchQuestions = async () => {
    const response = await axios.get(`${Endpoint()}forum/questions`);
    setQuestions(response.data);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    });
    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((element) => observer.observe(element));
    fetchQuestions();
  }, []);

  return (
    <div className="discussion-container">
      <div className="discussion-grid">
        {editOverlay && (
          <EditQuestion
            choice="edit-question"
            editOverlay={editOverlay}
            setEditOverlay={setEditOverlay}
            questionTobeEdited={questionTobeEdited}
            fetchQuestions={fetchQuestions}
          />
        )}
        {deleteOverlay && (
          <DeleteQuestion
            deleteOverlay={deleteOverlay}
            setdeleteOverlay={setdeleteOverlay}
            questionToBeDeleted={questionToBeDeleted}
            fetchQuestions={fetchQuestions}
          />
        )}
           <div className="grid-column">
          <form
            onSubmit={(e) => {
              e.preventDefault(), handleSearch();
            }}
            className="search-form"
          >
            <input
              type="text"
              className="search-input"
              placeholder="search for questions ..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <button className="search-btn">Search</button>
          </form>

          <div>
            {isQuestionOverlay && (
              <div className="overlay-container">
                <div className="overlay-box">
                  <i
                    onClick={() => {
                      document.body.style.overflowY = "scroll";
                      setQuestionOverlay(!isQuestionOverlay);
                    }}
                    className="fa-solid fa-x"
                  ></i>
                  <form
                    onSubmit={handleSubmit}
                    className="event-form"
                    encType="multipart/form-data"
                  >
                    <div className="event-inputs">
                      <h2>Your Question</h2>
                      <textarea
                        onChange={handleChange}
                        type="text"
                        required
                        className="event-desc"
                        name="question"
                        placeholder="write question here ..."
                      ></textarea>
                    </div>
                    <button
                      onClick={() => (document.body.style.overflowY = "scroll")}
                      type="submit"
                      className="create-event-btn"
                    >
                      Start Discussion
                    </button>
                  </form>
                </div>
              </div>
            )}

            {questions.length > 0 ? (
              questions.map((question) => (
                <div key={question.id} className=" question-card">
                  <div className="q-head">
                    <img
                      src={question.author?.profile_pic}
                      className="q-creator"
                    />

                    <span>
                      <Link to={`/profile/${question.author?.id}`}>
                        {question.author?.name}{" "}
                        <small style={{ color: "gray" }}>asked</small>
                        <br />{" "}
                        <small>{timeFormater(question.created_date)}</small>
                      </Link>
                    </span>
                  </div>

                  <div className="q-content">
                    <div className="question">
                      <Link id="q-answers" to={`/answers/${question.id}`}>
                        {question.question}
                      </Link>
                    </div>
                    <div style={{ display: "flex" }}>
                      <button className="answer-btn">
                        <Link id="q-answers" to={`/answers/${question.id}`}>
                          <i className="fas fa-pen"></i> Answer
                        </Link>
                      </button>
                      <button
                        onClick={() => handleUpvote(question.id, user.user_id)}
                        className="answer-btn"
                      >
                        <i className="fa-solid fa-circle-up"></i>
                        {question.upvotes}
                      </button>
                      <button
                        onClick={() =>
                          handleDownvote(question.id, user.user_id)
                        }
                        className="answer-btn"
                      >
                        <i class="fa-solid fa-circle-down"></i>
                        {question.downvotes}
                      </button>
                      <button className="share-btn">
                        {user?.user_id === question.author?.id ? (
                          <>
                            <i
                              onClick={() => {
                                setQuestionToBeEdited(question),
                                  setEditOverlay(!editOverlay);
                              }}
                              title="edit"
                              class="fa-regular fa-pen-to-square"
                            ></i>
                            <i
                              onClick={() => {
                                setquestionToBeDeleted(question),
                                  setdeleteOverlay(!deleteOverlay);
                              }}
                              title="delete"
                              class="fa-solid fa-trash"
                            ></i>
                          </>
                        ) : (
                          ""
                        )}
                        <i
                          title="share"
                          onClick={() =>
                            shareLink(
                              `${window.location.origin}/answers/${question.id}/`
                            )
                          }
                          className="fas fa-share"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ margin: "10px auto", textAlign: "center" }}>
                <span style={{ fontSize: "20px" }}>
                 No Question called  <span style={{color:"blue"}}>{searchTerm}</span> was found
                </span>
                <div className="answer">
                  <img style={{ width: "60%" }} src="/nofollow.gif" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="grid-column left"
          style={{ position: "sticky", top: 0 }}
        >
          <span>Start a discussion </span>
          <button
            onClick={() => setQuestionOverlay(!isQuestionOverlay)}
            className="add-question"
            
          >
            <i className="fa fa-plus"></i>
          </button>

        </div>
     
      </div>
    </div>
  );
};
export default Discussion;
