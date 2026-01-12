import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./EditLesson.css";

function EditLesson() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/cms/programs/${programId}/terms/${termId}/lessons/${lessonId}`,
        {
          lesson_number: lesson.lesson_number,
          title: lesson.title,
          content_type: lesson.content_type,
          duration_ms: lesson.duration_ms,
          is_paid: lesson.is_paid,
          content_language_primary: lesson.content_language_primary,
          content_languages_available: lesson.content_languages_available,
          content_urls_by_language: lesson.content_urls_by_language,
        }
      );

      navigate(`/programs/${programId}/terms/${termId}`);
    } catch {
      alert("Failed to update lesson");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!lesson) return <p className="loading-text">Lesson not found</p>;

  return (
    <div className="edit-lesson-page">
      <button
        className="back-link"
        onClick={() => navigate(`/programs/${programId}/terms/${termId}`)}
      >
        ← Back to Term
      </button>

      <div className="edit-lesson-card">
        <h2 className="page-title">✏️ Edit Lesson</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lesson Number *</label>
            <input
              type="number"
              value={lesson.lesson_number}
              onChange={(e) =>
                setLesson({
                  ...lesson,
                  lesson_number: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              value={lesson.title}
              onChange={(e) =>
                setLesson({ ...lesson, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Content Type</label>
            <select
              value={lesson.content_type}
              onChange={(e) =>
                setLesson({ ...lesson, content_type: e.target.value })
              }
            >
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={lesson.duration_ms / 60000}
              onChange={(e) =>
                setLesson({
                  ...lesson,
                  duration_ms: Number(e.target.value) * 60000,
                })
              }
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={lesson.is_paid}
              onChange={(e) =>
                setLesson({ ...lesson, is_paid: e.target.checked })
              }
            />
            <span>Paid Lesson</span>
          </div>

          <div className="form-group">
            <label>Content URL (English)</label>
            <input
              value={lesson.content_urls_by_language?.en || ""}
              onChange={(e) =>
                setLesson({
                  ...lesson,
                  content_urls_by_language: {
                    ...lesson.content_urls_by_language,
                    en: e.target.value,
                  },
                })
              }
            />
          </div>

          <button type="submit" className="primary-btn">
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditLesson;
