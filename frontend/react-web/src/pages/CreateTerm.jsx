import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./CreateTerm.css";

function CreateTerm() {
  const { programId } = useParams();
  const navigate = useNavigate();

  const [termNumber, setTermNumber] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termNumber) {
      alert("Term number is required");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/cms/programs/${programId}/terms`, {
        term_number: Number(termNumber),
        title: title || null,
      });

      navigate(`/programs/${programId}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create term");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="term-container">
      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate(`/programs/${programId}`)}
      >
        ← Back to Program
      </button>

      <h2 className="term-title">➕ Create Term</h2>

      <form className="term-form" onSubmit={handleSubmit}>
        {/* Term Number */}
        <div className="form-group">
          <label>Term Number *</label>
          <input
            type="number"
            value={termNumber}
            onChange={(e) => setTermNumber(e.target.value)}
            required
          />
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Basics of Programming"
          />
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Term"}
        </button>
      </form>
    </div>
  );
}

export default CreateTerm;
