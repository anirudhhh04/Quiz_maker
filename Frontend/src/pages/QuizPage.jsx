import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

function QuizPage() {

  const { id } = useParams();
  const n = useNavigate();
  const [questions, setQuestions] =useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted,setSubmitted]=useState(false);
  useEffect(() => {
    const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz/${id}`);
      setQuestions(response.data);
      if (response.data.length > 0) {
          setQuizTitle(response.data[0].title);
          setQuizDescription(response.data[0].description);
          setTimeLeft(response.data[0].time_limit * 60);
        }
    } catch (error) {
         console.log(error);
    } 
    finally {
      setLoading(false);}
    };
    fetchQuiz();
    }, [id]);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
}, [timeLeft]);

  useEffect(() => {
      if (timeLeft === 0 && questions.length > 0) {
        toast("Time's Up!,Submitting your quiz...");
        submitQuiz();
      }
  }, [timeLeft]);

 const handleAnswer = (questionId,answer) => {setAnswers( {...answers,[questionId]: answer});};
 const submitQuiz = async () => {
  if (submitted) return;
  setSubmitted(true);
  try {
    const token = localStorage.getItem("token");
    const formattedAnswers = Object.keys(answers).map((questionId) => ({question_id: Number(questionId), answer:answers[questionId] }) );
    const response =await api.post("/submit-quiz",
        {
          quiz_id: Number(id),
          answers:
            formattedAnswers
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );
    toast.success("Quiz completed successfully");
    n("/result",{state: response.data});
  } catch (error) {
    console.log(error);
    setSubmitted(false);
  }
 };
 const minutes = Math.floor(timeLeft / 60);
 const seconds = timeLeft % 60;
 if (loading) {

  return (
    <h1 className="text-center mt-10">
      Loading...
    </h1>
  );
}
return (

  <div className="min-h-screen bg-slate-100 p-6">

    <div className="max-w-4xl mx-auto">

      <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2"> {quizTitle}</h1>
          <p className="text-gray-500 text-lg">  {quizDescription}</p>

      </div>
      <div className={`
              w-fit
              ml-auto
              mb-6
              text-center
              px-6
              py-4
              rounded-2xl
              shadow-lg
              font-bold
              text-3xl
              transition-all
              duration-300
              ${
              timeLeft <= 60
              ? "bg-red-600 text-white animate-pulse"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              }
              `}>
        <p className="text-sm opacity-80">
          Time Left
        </p>

        {minutes}:{seconds.toString().padStart(2,"0")}

    </div>
    {questions.map((q) => (

        <div
          key={q.id}
          className=" bg-white
                        rounded-3xl
                        border
                      border-slate-200
                        shadow-md
                        p-6
                        mb-6
                        hover:shadow-lg
                        transition"
        >

          <h2 className="text-xl font-semibold mb-4">
            {q.question}
          </h2>

          {["A","B","C","D"].map(
            (option) => (

            <label
              key={option}
              className="
              flex
              items-center
              gap-3
              mb-3
              cursor-pointer
              "
            >

              <input
                type="radio"
                name={`question-${q.id}`}
                value={option}
                onChange={() =>
                  handleAnswer(
                    q.id,
                    option
                  )
                }
              />

              {
                q[
                  `option_${option.toLowerCase()}`
                ]
              }

            </label>

          ))}

        </div>

      ))}

      <button
        onClick={submitQuiz}
        disabled={submitted}
        className="
        w-full
        bg-green-600
        text-white
        py-4
        rounded-xl
        font-semibold
        hover:bg-green-700
        "
      >
        {submitted ? "Submitting..." : "Submit Quiz"}
      </button>

    </div>

  </div>
);
}

export default QuizPage;