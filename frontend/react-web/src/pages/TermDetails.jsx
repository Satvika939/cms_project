import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import LessonsList from "./LessonsList";
import "./TermDetails.css";

function TermDetails() {
  const { programId, termId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerm();
  }, []);

  const fetchTerm = async () => {
    try {
      const data = await api.get(
        `/cms/programs/${programId}/terms/${termId}`
      );
      setTerm(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load term");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!term) return <p className="error-text">Term not found</p>;

  return (
    <div className="term-details-container">
      {/* Back Navigation */}
      <div className="nav-links">
        <button
          className="back-btn"
          onClick={() => navigate("/programs")}
        >
          ← Back to Programs
        </button>

        <button
          className="back-btn"
          onClick={() => navigate(`/programs/${programId}`)}
        >
          ← Back to Terms
        </button>
      </div>

      {/* Term Info */}
      <div className="term-card">
        <h2 className="term-heading">
          📘 Term {term.term_number}
        </h2>

        <p>
          <span className="label">Title:</span>{" "}
          {term.title || "—"}
        </p>

        <p>
          <span className="label">Created At:</span>{" "}
          {new Date(term.created_at).toLocaleString()}
        </p>

        {(user.role === "admin" || user.role === "editor") && (
          <button
            className="edit-btn"
            onClick={() =>
              navigate(
                `/programs/${programId}/terms/${termId}/edit`
              )
            }
          >
            ✏️ Edit Term
          </button>
        )}
      </div>

      {/* Lessons Section */}
      <div>
        <LessonsList />
      </div>
    </div>
  );
}

export default TermDetails;
