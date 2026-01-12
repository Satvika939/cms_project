import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./LessonsList.css";
import { useAuth } from "../auth/AuthContext";

function LessonsList() {
  const { user } = useAuth();
  const { programId, termId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const data = await api.get(
        `/cms/programs/${programId}/terms/${termId}/lessons`
      );
      setLessons(data || []);
    } catch {
      alert("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const hasActions = (status) => {
    return status !== "archived";
  };

  if (loading) return <p className="loading-text">Loading lessons...</p>;

  return (
    <div className="lessons-section">
      <div className="lessons-header">
        <h3>📚 Lessons</h3>
        <button
          className="primary-btn"
          onClick={() =>
            navigate(`/programs/${programId}/terms/${termId}/lessons/new`)
          }
        >
          ➕ Add Lesson
        </button>
      </div>

      {lessons.length === 0 ? (
        <p className="empty-text">No lessons added yet.</p>
      ) : (
        <div className="lessons-list">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-left">
                <h4>
                  Lesson {lesson.lesson_number}: {lesson.title}
                </h4>

                <div className="lesson-meta">
                  <span>{lesson.content_type}</span>
                  <span>{lesson.duration_ms / 60000} min</span>
                </div>
              </div>

              <div className="lesson-right">
                {/* STATUS */}
                <span className={`status-badge status-${lesson.status}`}>
                  {lesson.status}
                </span>

                <div className="lesson-actions">
                  {/* View – allowed for everyone */}
                  <button
                    className="action-pill"
                    onClick={() =>
                      navigate(
                        `/programs/${programId}/terms/${termId}/lessons/${lesson.id}`
                      )
                    }
                  >
                    View
                  </button>

                  {/* Edit – admin & editor only */}
                  {(user.role === "admin" || user.role === "editor") && (
                    <button
                      className="action-pill"
                      onClick={() =>
                        navigate(
                          `/programs/${programId}/terms/${termId}/lessons/${lesson.id}/edit`
                        )
                      }
                    >
                      Edit
                    </button>
                  )}

                  {/* Actions – admin & editor only */}
                  {(user.role === "admin" || user.role === "editor") &&
                    hasActions(lesson.status) && (
                      <button
                        className="action-pill"
                        onClick={() =>
                          navigate(
                            `/programs/${programId}/terms/${termId}/lessons/${lesson.id}/actions`
                          )
                        }
                      >
                        ⚙ Actions
                      </button>
                    )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LessonsList;
