import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./EditTerm.css";

function EditTerm() {
  const { programId, termId } = useParams();
  const navigate = useNavigate();

  const [termNumber, setTermNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerm();
  }, []);

  const fetchTerm = async () => {
    try {
      const data = await api.get(
        `/cms/programs/${programId}/terms/${termId}`
      );
      setTermNumber(data.term_number);
      setTitle(data.title || "");
      setDescription(data.description || "");
    } catch {
      alert("Failed to load term");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/cms/programs/${programId}/terms/${termId}`,
        {
          term_number: Number(termNumber),
          title,
          description,
        }
      );
      navigate(`/programs/${programId}`);
    } catch {
      alert("Failed to update term");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="edit-term-page">
      <button
        className="back-link"
        onClick={() =>
          navigate(`/programs/${programId}/terms/${termId}`)
        }
      >
        ← Back to Term
      </button>

      <div className="edit-term-card">
        <h2 className="page-title">✏️ Edit Term</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Term Number *</label>
            <input
              type="number"
              value={termNumber}
              onChange={(e) => setTermNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default EditTerm;
