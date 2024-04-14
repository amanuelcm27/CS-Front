import axios from "axios";
import Endpoint from "../../api";
const DeleteQuestion = ({
    choice,
    fetchQuestions,
    deleteOverlay,
    setdeleteOverlay,
    questionToBeDeleted,
  }) => {
    const deleteQuestion = async () => {
      try {
        const response = await axios.delete(
          `${Endpoint()}forum/questions/${questionToBeDeleted.id}/`
        );
        setdeleteOverlay(!deleteOverlay);
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
              setdeleteOverlay(!deleteOverlay);
            }}
            className="fa-solid fa-x"
          ></i>
  
          <div className="event-inputs">
            <div style={{ margin: "30px" }}>
              <h2>Are you sure to delete this Question</h2>
              <p style={{borderRadius:"10px",border:"1px solid silver", padding:"10px", marginTop: "20px", fontSize: "20px" }}>
                {questionToBeDeleted.question}
              </p>
            </div>
  
            <button
              onClick={() => deleteQuestion()}
              type="submit"
              className="create-event-btn"
              style={{ margin: "30px", color:"white" , background:"red"}}

            >
              Delete Question
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default DeleteQuestion;