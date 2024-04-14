import { useState } from "react";
import Endpoint from "../../api";
import axios from "axios";
const EditQuestion = ({
    fetchQuestions,
    editOverlay,
    setEditOverlay,
    questionTobeEdited,
  }) => {
    const [NewEditedQuestion, setNewEditedQuestion] = useState(
      questionTobeEdited.question
    );
    const editquestion = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.patch(
          `${Endpoint()}forum/questions/${questionTobeEdited.id}/`,
          {
            question: NewEditedQuestion,
          }
        );
        console.log("edited", response);
        setEditOverlay(!editOverlay);
        fetchQuestions();
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
              setEditOverlay(!editOverlay);
            }}
            className="fa-solid fa-x"
          ></i>
          <form
            onSubmit={editquestion}
            className="event-form"
            encType="multipart/form-data"
          >
            <div className="event-inputs">
              <h2 style={{padding:"10px"}}>Edit your Question</h2>
              <textarea
                type="text"
                required
                className="event-desc"
                name="question"
                value={NewEditedQuestion}
                onChange={(e) => setNewEditedQuestion(e.target.value)}
                placeholder="write question here ..."
              ></textarea>
            </div>
            <button
              onClick={() => (document.body.style.overflowY = "scroll")}
              type="submit"
              className="create-event-btn"
            >
              Edit Question
            </button>
          </form>
        </div>
      </div>
    );
  };
  export default EditQuestion;