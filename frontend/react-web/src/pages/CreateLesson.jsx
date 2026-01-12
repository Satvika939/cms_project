import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./CreateLesson.css";

function CreateLesson() {
  const { programId, termId } = useParams();
  const navigate = useNavigate();

  const [lessonNumber, setLessonNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("video");
  const [duration, setDuration] = useState(10);
  const [isPaid, setIsPaid] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        `/cms/programs/${programId}/terms/${termId}/lessons`,
        {
          lesson_number: lessonNumber,
          title,
          content_type: contentType,
          duration_ms: duration * 60 * 1000,
          is_paid: isPaid,
          content_language_primary: "en",
          content_languages_available: ["en"],
          content_urls_by_language: {
            en: videoUrl,
          },
        }
      );

      navigate(-1);
    } catch (err) {
      alert(err.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lesson-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back to Term
      </button>

      <div className="create-lesson-card">
        <h2 className="page-title">➕ Create Lesson</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lesson Number *</label>
            <input
              type="number"
              value={lessonNumber}
              onChange={(e) => setLessonNumber(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Lesson Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
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
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            <span>Paid Lesson</span>
          </div>

          <div className="form-group">
            <label>Content URL (English) *</label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Lesson"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateLesson;
