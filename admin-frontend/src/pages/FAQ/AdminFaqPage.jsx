import React, { useState, useEffect } from "react";
import api from "../../api";

function AdminFaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [category, setCategory] = useState("이용안내");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [visibleFilter, setVisibleFilter] = useState(null); // null: 전체, true: 노출, false: 숨김
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoryList = ["이용안내", "결제/환불", "시설이용", "기타"];

  // FAQ 목록 조회
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
      };
      if (keyword) params.keyword = keyword;
      if (visibleFilter !== null) params.visible = visibleFilter;

      const response = await api.get("/admin/faq", { params });
      
      if (response.data && response.data.list) {
        setFaqs(response.data.list);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error("FAQ 목록 조회 실패:", error);
      alert("FAQ 목록을 불러오는 중 오류가 발생했습니다.");
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [currentPage, keyword, visibleFilter]);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      alert("질문과 답변을 모두 입력해주세요.");
      return;
    }

    try {
      const faqData = {
        category,
        title: question,
        content: answer,
        isVisible: true,
      };

      if (editingId) {
        // 수정
        await api.put(`/admin/faq/${editingId}`, faqData);
        alert("FAQ가 수정되었습니다.");
      } else {
        // 등록
        await api.post("/admin/faq", faqData);
        alert("FAQ가 등록되었습니다.");
      }

      // 폼 초기화
      setCategory("이용안내");
      setQuestion("");
      setAnswer("");
      setEditingId(null);

      // 목록 새로고침
      fetchFAQs();
    } catch (error) {
      console.error("FAQ 저장 실패:", error);
      const errorMsg = error.response?.data?.message || "FAQ 저장 중 오류가 발생했습니다.";
      alert(errorMsg);
    }
  };

  const editFaq = (faq) => {
    setEditingId(faq.postId);
    setCategory(faq.category || "이용안내");
    setQuestion(faq.title || "");
    setAnswer(faq.content || "");
    setOpenId(null);
  };

  const deleteFaq = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/faq/${postId}`);
      alert("FAQ가 삭제되었습니다.");
      fetchFAQs();
    } catch (error) {
      console.error("FAQ 삭제 실패:", error);
      alert("FAQ 삭제 중 오류가 발생했습니다.");
    }
  };

  const toggleVisible = async (postId, currentVisible) => {
    try {
      await api.put(`/admin/faq/${postId}/visible?visible=${!currentVisible}`);
      alert(`FAQ가 ${!currentVisible ? "노출" : "숨김"} 처리되었습니다.`);
      fetchFAQs();
    } catch (error) {
      console.error("FAQ 노출 상태 변경 실패:", error);
      alert("노출 상태 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <h1>FAQ 관리</h1>

      {/* 검색 및 필터 */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: "6px", width: "200px" }}
        />
        <select
          value={visibleFilter === null ? "all" : visibleFilter ? "visible" : "hidden"}
          onChange={(e) => {
            const value = e.target.value;
            setVisibleFilter(value === "all" ? null : value === "visible");
            setCurrentPage(1);
          }}
          style={{ padding: "6px" }}
        >
          <option value="all">전체</option>
          <option value="visible">노출</option>
          <option value="hidden">숨김</option>
        </select>
      </div>

      {/* FAQ 목록 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>로딩 중...</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>카테고리</th>
                <th>질문</th>
                <th>노출 여부</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                    등록된 FAQ가 없습니다.
                  </td>
                </tr>
              ) : (
                faqs.map((f) => (
                  <React.Fragment key={f.postId}>
                    <tr>
                      <td>{f.postId}</td>
                      <td>{f.category}</td>
                      <td
                        onClick={() => toggleOpen(f.postId)}
                        style={{ cursor: "pointer", fontWeight: "600" }}
                      >
                        {f.title}
                      </td>
                      <td>{f.isVisible ? "노출" : "숨김"}</td>
                      <td>
                        <button onClick={() => editFaq(f)}>수정</button>
                        <button onClick={() => toggleVisible(f.postId, f.isVisible)}>
                          {f.isVisible ? "숨기기" : "보이기"}
                        </button>
                        <button onClick={() => deleteFaq(f.postId)} style={{ color: "red" }}>
                          삭제
                        </button>
                      </td>
                    </tr>

                    {/* 펼침 답변 */}
                    {openId === f.postId && (
                      <tr>
                        <td colSpan="5" style={{ background: "#f8f8f8", padding: "15px" }}>
                          <strong>답변:</strong>
                          <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>{f.content}</div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                이전
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {/* 등록/수정 폼 */}
      <h2 style={{ marginTop: "30px" }}>
        {editingId ? "FAQ 수정" : "FAQ 등록"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#fafafa",
          borderRadius: "8px",
          width: "650px"
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "200px", padding: "6px" }}
          >
            {categoryList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            질문
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{
              width: "500px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            답변
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{
              width: "500px",
              height: "180px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#333",
              color: "white",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {editingId ? "수정완료" : "등록하기"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setCategory("이용안내");
                setQuestion("");
                setAnswer("");
              }}
              style={{
                padding: "10px 20px",
                background: "#6c757d",
                color: "white",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer"
              }}
            >
              취소
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default AdminFaqPage;
