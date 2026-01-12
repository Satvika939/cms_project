import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./LessonActions.css";
import ScheduleLesson from "./ScheduleLesson";

function LessonActions() {
  const { programId, termId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    const data = await api.get(
      `/cms/programs/${programId}/terms/${termId}/lessons/${lessonId}`
    );
    setLesson(data);
  };

  const performAction = async (action) => {
    try {
      await api.post(
        `/cms/programs/${programId}/terms/${termId}/lessons/${lessonId}/${action}`
      );
      navigate(`/programs/${programId}/terms/${termId}`);
    } catch {
      alert("Action failed");
    }
  };

  if (!lesson) return <p>Loading...</p>;

  return (
    <div className="lesson-actions-page">
      <button
        className="back-link"
        onClick={() =>
          navigate(`/programs/${programId}/terms/${termId}`)
        }
      >
        ← Back to Lessons
      </button>

      <div className="lesson-actions-card">
        <h2>⚙ Lesson Actions</h2>

        <p>
          <b>Lesson:</b> {lesson.title}
        </p>
        <p>
          <b>Status:</b>{" "}
          <span className={`status-badge status-${lesson.status}`}>
            {lesson.status}
          </span>
        </p>

        <div className="actions-list">
        {/* Draft */}
        {lesson.status === "draft" && (
            <>
            <ScheduleLesson />

            <button
                className="action-btn publish-btn"
                onClick={() => performAction("publish")}
            >
                🚀 Publish Lesson
            </button>

            <button
                className="action-btn archive-btn"
                onClick={() => performAction("archive")}
            >
                🗄 Archive Lesson
            </button>
            </>
        )}

        {/* Scheduled */}
        {lesson.status === "scheduled" && (
            <button
            className="action-btn publish-btn"
            onClick={() => performAction("publish")}
            >
            🚀 Publish Lesson
            </button>
        )}

        {/* Published */}
        {lesson.status === "published" && (
            <button
            className="action-btn archive-btn"
            onClick={() => performAction("archive")}
            >
            🗄 Archive Lesson
            </button>
        )}
        </div>
      </div>
    </div>
  );
}

export default LessonActions;
