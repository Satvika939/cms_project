import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "./CreateProgram.css";

const CreateProgram = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    language_primary: "",
    languages_available: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let languagesArray = form.languages_available
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    if (
      form.language_primary &&
      !languagesArray.includes(form.language_primary)
    ) {
      languagesArray.unshift(form.language_primary);
    }

    const payload = {
      title: form.title,
      description: form.description,
      language_primary: form.language_primary,
      languages_available: languagesArray,
    };

    try {
      await api.post("/cms/programs", payload);
      navigate("/programs");
    } catch (err) {
      console.error(err);
      alert("Failed to create program");
    }
  };

  return (
    <div className="create-program-page">
      {/* Back */}
      <button
        className="back-link"
        onClick={() => navigate("/programs")}
      >
        ← Back to Programs
      </button>

      <h2 className="page-title">➕ Create Program</h2>

      <form className="program-form" onSubmit={handleSubmit}>
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
          <label>Languages Available</label>
          <input
            name="languages_available"
            value={form.languages_available}
            onChange={handleChange}
            placeholder="en, hi, te"
          />
          <small className="hint-text">
            Separate languages with commas
          </small>
        </div>

        <button type="submit" className="primary-btn">
          Create Program
        </button>
      </form>
    </div>
  );
};

export default CreateProgram;
