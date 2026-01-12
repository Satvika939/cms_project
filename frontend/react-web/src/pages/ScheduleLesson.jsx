import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./ScheduleLesson.css";

function ScheduleLesson() {
  const { lessonId, programId, termId } = useParams();
  const navigate = useNavigate();

  const [publishAt, setPublishAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        `/cms/programs/${programId}/terms/${termId}/lessons/${lessonId}/schedule`,
        {
          publish_at: publishAt,
        }
      );

      navigate(`/programs/${programId}/terms/${termId}`);
    } catch {
      alert("Failed to schedule lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-lesson-page">
      
      <div className="schedule-card">
        <h2 className="page-title">⏰ Schedule Lesson</h2>

        <form onSubmit={handleSchedule}>
          <div className="form-group">
            <label>Publish Date & Time</label>
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Scheduling..." : "Schedule Lesson"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleLesson;
