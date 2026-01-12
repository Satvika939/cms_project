import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./EditPrograms.css";

function EditProgram() {
  const { programId } = useParams();
  // console.log(programId);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    language_primary: "",
    languages_available: "", // STRING for input
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgram();
    // eslint-disable-next-line
  }, []);

  const loadProgram = async () => {
    try {
      const data = await api.get(`/cms/programs/${programId}`);

      setForm({
        title: data.title || "",
        description: data.description || "",
        language_primary: data.language_primary || "",
        languages_available: Array.isArray(data.languages_available)
          ? data.languages_available.join(", ")
          : "",
      });
    } catch {
      alert("Failed to load program");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      language_primary: form.language_primary,
      languages_available: form.languages_available
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    };

    try {
      await api.put(`/cms/programs/${programId}`, payload);
      navigate(`/programs`);
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="edit-program-page">
      <button className="back-link" onClick={() => navigate("/programs")}>
        ← Back to Programs
      </button>

      <div className="edit-program-card">
        <h2 className="page-title">✏️ Edit Program</h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* Primary Language */}
          <div className="form-group">
            <label>Primary Language *</label>
            <select
              name="language_primary"
              value={form.language_primary}
              onChange={handleChange}
              required
            >
              <option value="">Select language</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
            </select>
          </div>

          {/* Languages Available */}
          <div className="form-group">
            <label>Languages Available (comma separated)</label>
            <input
              name="languages_available"
              value={form.languages_available}
              onChange={handleChange}
              placeholder="en, hi, te"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProgram;
