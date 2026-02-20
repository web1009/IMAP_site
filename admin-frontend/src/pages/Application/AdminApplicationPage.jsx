import React, { useState, useEffect } from "react";
import api from "../../api";

const STATUS_LABEL = {
  PENDING: "대기",
  PROCESSING: "처리중",
  COMPLETED: "완료",
  REJECTED: "거절",
};

function AdminApplicationPage() {
  const [applications, setApplications] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/application");
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "신청 목록을 불러오는데 실패했습니다.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const formatDate = (str) => {
    if (!str) return "-";
    const d = str.split("T")[0];
    const t = str.includes("T") ? str.split("T")[1]?.slice(0, 8) : "";
    return t ? `${d} ${t}` : d;
  };

  const filtered = applications.filter((a) => {
    const name = (a.name || "").toLowerCase();
    const phone = (a.phone || "").replace(/\s/g, "");
    const program = (a.program || "").toLowerCase();
    const kw = searchKeyword.toLowerCase().replace(/\s/g, "");
    return (
      name.includes(kw) ||
      phone.includes(kw) ||
      program.includes(kw)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const idA = a.applicationId ?? a.application_id ?? 0;
    const idB = b.applicationId ?? b.application_id ?? 0;
    return Number(idB) - Number(idA);
  });

  return (
    <>
      <h1>프로그램 신청 관리</h1>

      <input
        type="text"
        placeholder="이름, 전화번호, 프로그램 검색"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ width: "280px", padding: "8px", marginBottom: "16px" }}
      />

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>프로그램</th>
              <th>상태</th>
              <th>신청일시</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a) => {
              const id = a.applicationId ?? a.application_id;
              return (
                <React.Fragment key={id}>
                  <tr>
                    <td>{id}</td>
                    <td>{a.name || "-"}</td>
                    <td>{a.phone || "-"}</td>
                    <td>{a.program || "-"}</td>
                    <td>{STATUS_LABEL[a.status] ?? a.status ?? "-"}</td>
                    <td>{formatDate(a.regDt ?? a.reg_dt)}</td>
                    <td>
                      <button onClick={() => toggleOpen(id)}>
                        {openId === id ? "접기" : "상세"}
                      </button>
                    </td>
                  </tr>
                  {openId === id && (
                    <tr>
                      <td colSpan="7" style={{ background: "#f8f9fa", padding: "16px" }}>
                        <strong>신청 동기</strong>
                        <div style={{ marginTop: "8px", whiteSpace: "pre-line" }}>
                          {a.motivation || "(없음)"}
                        </div>
                        <div style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
                          신청일: {formatDate(a.regDt ?? a.reg_dt)}
                          {a.updDt || a.upd_dt ? ` · 수정일: ${formatDate(a.updDt ?? a.upd_dt)}` : ""}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {!loading && !error && sorted.length === 0 && (
        <p style={{ color: "#888", marginTop: "20px" }}>등록된 신청이 없습니다.</p>
      )}
    </>
  );
}

export default AdminApplicationPage;
