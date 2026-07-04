import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

function CreateQuiz() {
  const n = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [timeLimit, setTimeLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token =  localStorage.getItem("token");
      const response =
        await api.post(
          "/create-quiz",
          {
            title,
            description,
            total_questions:Number(totalQuestions),
            time_limit: Number(timeLimit)
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
      const quizId =response.data.quiz_id;
      toast.success("Quiz added successfully");
      n(`/add-questions/${quizId}`);
    }catch (error) {
      toast.error( error.response?.data?.message || "Failed to create quiz");
    }finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6">
          Create Quiz
        </h1>

        <form
          onSubmit={handleCreateQuiz}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full border rounded-lg p-3"
            required
          />
          <textarea
            placeholder="Quiz Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows="4"
            className="w-full border rounded-lg p-3"
          />
          <input type="number" min="1" placeholder="Number of Questions" value={totalQuestions} onChange={(e) =>setTotalQuestions(e.target.value)}
              className=" w-full border rounded-lg p-3 " required
          />
          <input type="number" placeholder="Time Limit (minutes)"  value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="w-full border rounded-lg p-3"
  required/>
          <button
            type="submit"
            className="
            w-full
            bg-blue-600
            text-white
            p-3
            rounded-lg
            hover:bg-blue-700
            "
          >
            {
              loading
              ? "Creating..."
              : "Create Quiz"
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;