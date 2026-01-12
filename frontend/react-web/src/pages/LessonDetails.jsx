import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./LessonDetails.css";

function LessonDetails() {
  const { programId, termId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const data = await api.get(
        `/cms/programs/${programId}/terms/${termId}/lessons/${lessonId}`
      );
      setLesson(data);
    } catch {
      alert("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!lesson) return <p className="loading-text">Lesson not found</p>;

  return (
    <div className="lesson-details-page">
      <button
        className="back-link"
        onClick={() => navigate(`/programs/${programId}/terms/${termId}`)}
      >
        ← Back to Term
      </button>

      <div className="lesson-details-card">
        <div className="details-header">
          <h2>📘 Lesson {lesson.lesson_number}</h2>
          <button
            className="secondary-btn"
            onClick={() =>
              navigate(
                `/programs/${programId}/terms/${termId}/lessons/${lessonId}/edit`
              )
            }
          >
            ✏️ Edit
          </button>
        </div>

        <div className="details-row">
          <span>Title</span>
          <p>{lesson.title}</p>
        </div>

        <div className="details-row">
          <span>Content Type</span>
          <p>{lesson.content_type}</p>
        </div>

        <div className="details-row">
          <span>Duration</span>
          <p>{lesson.duration_ms / 60000} minutes</p>
        </div>

        <div className="details-row">
          <span>Access</span>
          <p>{lesson.is_paid ? "Paid" : "Free"}</p>
        </div>

        <div className="details-row">
          <span>Content URL (EN)</span>
          <a
            href={lesson.content_urls_by_language?.en}
            target="_blank"
            rel="noreferrer"
          >
            Open Content
          </a>
        </div>
      </div>
    </div>
  );
}

export default LessonDetails;
