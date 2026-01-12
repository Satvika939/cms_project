import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import "./CatalogProgramDetail.css";

function CatalogProgramDetail() {
  const { programId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    const res = await api.get(`/catalog/programs/${programId}`);
    setData(res);
  };

  if (!data) return <p className="loading-text">Loading program...</p>;

  return (
    <div className="catalog-detail-page">
      {/* Program Info */}
      <h2>{data.program.title}</h2>
      <p className="detail-desc">{data.program.description}</p>

      {/* Lessons */}
      <div className="lesson-list">
        {data.lessons.length === 0 ? (
          <p>No lessons available</p>
        ) : (
          data.lessons.map((l) => (
            <div key={l.id} className="lesson-row">
              <div className="lesson-thumb">▶</div>

              <div className="lesson-info">
                <h4>
                  Lesson {l.lesson_number}: {l.title}
                </h4>

                <div className="lesson-meta">
                  <span>{Math.round(l.duration_ms / 60000)} min</span>

                  {l.is_paid && (
                    <span className="paid-badge">PAID</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CatalogProgramDetail;
