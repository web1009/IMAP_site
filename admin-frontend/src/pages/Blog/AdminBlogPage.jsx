import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import api from "../../api";

function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [resetCounter, setResetCounter] = useState(0);
  const [initialEditorContent, setInitialEditorContent] = useState("");
  const editorWrapperRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Quill: wrapper를 비운 뒤 그 안에 div 하나 만들고 Quill 1개만 생성 → 툴바 중복 방지
  useEffect(() => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper || !document.body.contains(wrapper)) return;

    wrapper.innerHTML = "";
    const container = document.createElement("div");
    container.style.minHeight = "280px";
    wrapper.appendChild(container);

    const quill = new Quill(container, {
      theme: "snow",
      placeholder: "내용을 입력하세요.",
      modules: {
        toolbar: {
          container: [
            ["bold", "underline"],
            [{ color: [] }],
            ["image"],
          ],
          handlers: {
            image: function () {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await api.post("/admin/upload/image", formData);
                  const url = res.data?.url;
                  if (url) {
                    const range = quill.getSelection(true) || { index: 0 };
                    quill.insertEmbed(range.index, "image", url);
                    quill.setSelection(range.index + 1);
                  }
                } catch (err) {
                  console.error("이미지 업로드 실패", err);
                  const msg = err.response?.data?.message || err.response?.status === 413 ? "파일 용량이 너무 큽니다.(10MB 이하)" : "이미지 업로드에 실패했습니다.";
                  alert(msg);
                }
              };
              input.click();
            },
          },
        },
      },
    });

    const initialHtml = initialEditorContent === "" ? "<p><br></p>" : initialEditorContent;
    quill.root.innerHTML = initialHtml;
    quillRef.current = quill;

    return () => {
      if (wrapper && wrapper.parentNode) wrapper.innerHTML = "";
      quillRef.current = null;
    };
  }, [resetCounter, editingId, initialEditorContent]);

  const fetchPosts = async () => {
    const res = await api.get("/admin/blog");
    const converted = res.data.map((n) => ({
      id: n.postId,
      title: n.title,
      subtitle: n.subtitle ?? "",
      content: n.content,
      visible: n.isVisible,
      createdAt: n.createdAt?.split("T")[0],
      rawDisplayEnd: n.displayEnd,
    }));
    setPosts(converted);
  };

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const editPost = (n) => {
    setEditingId(n.id);
    setTitle(n.title);
    setSubtitle(n.subtitle ?? "");
    const raw = n.content ?? "";
    setInitialEditorContent(raw === "" || raw === "<p><br></p>" ? "" : raw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let contentToSend = "";
    if (quillRef.current && quillRef.current.root) {
      contentToSend = quillRef.current.root.innerHTML || "";
    }
    const payload = {
      title,
      subtitle: (subtitle != null && String(subtitle).trim() !== "") ? String(subtitle).trim() : null,
      content: contentToSend,
      branchId: null,
      displayEnd: null,
    };

    if (editingId) {
      await api.put(`/admin/blog/${editingId}`, payload);
    } else {
      await api.post("/admin/blog", payload);
    }

    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setInitialEditorContent("");
    setResetCounter((c) => c + 1);
    fetchPosts();
  };

  const deletePost = async (id) => {
    if (!window.confirm("IMAP 글을 삭제하시겠습니까?")) return;
    await api.delete(`/admin/blog/${id}`);
    fetchPosts();
  };

  const toggleVisible = async (n) => {
    if (!window.confirm("노출 상태를 변경하시겠습니까?")) return;
    await api.put(`/admin/blog/${n.id}/visible`, null, {
      params: { visible: !n.visible },
    });
    fetchPosts();
  };

  const filteredPosts = posts.filter((n) => n.title.includes(searchKeyword));
  const sortedPosts = [...filteredPosts].sort((a, b) => b.id - a.id);

  return (
    <>
      <h1>IMAP 관리</h1>

      <input
        type="text"
        placeholder="제목 검색"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ width: "250px", padding: "6px", marginBottom: "20px" }}
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>대제목</th>
            <th>중제목</th>
            <th>작성일</th>
            <th>노출</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {sortedPosts.map((n) => (
            <React.Fragment key={n.id}>
              <tr
                style={{
                  background: !n.visible ? "#f1f1f1" : "white",
                  color: !n.visible ? "#999" : "#000",
                  opacity: !n.visible ? 0.5 : 1,
                }}
              >
                <td>{n.id}</td>
                <td
                  onClick={() => n.visible && toggleOpen(n.id)}
                  style={{ cursor: "pointer", fontWeight: "600" }}
                >
                  {n.title}
                </td>
                <td
                  onClick={() => n.visible && toggleOpen(n.id)}
                  style={{ cursor: "pointer" }}
                >
                  {n.subtitle || "-"}
                </td>
                <td>{n.createdAt}</td>
                <td>{n.visible ? "노출" : "숨김"}</td>
                <td>
                  <button onClick={() => editPost(n)}>수정</button>
                  <button onClick={() => toggleVisible(n)}>
                    {n.visible ? "숨기기" : "보이기"}
                  </button>
                  <button
                    onClick={() => deletePost(n.id)}
                    style={{ color: "red" }}
                  >
                    삭제
                  </button>
                </td>
              </tr>

              {openId === n.id && (
                <tr>
                  <td
                    colSpan="6"
                    style={{ background: "#fafafa", padding: "15px" }}
                  >
                    {n.subtitle && (
                      <div style={{ marginBottom: "8px", color: "#555" }}>
                        <strong>중제목</strong> {n.subtitle}
                      </div>
                    )}
                    <strong>내용</strong>
                    <div
                      style={{ marginTop: "10px" }}
                      className="blog-content-preview"
                      dangerouslySetInnerHTML={{ __html: n.content || "" }}
                    />
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      작성일: {n.createdAt}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>
        {editingId ? "IMAP 수정" : "IMAP 등록"}
      </h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label>대제목</label>
          <br />
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "500px", padding: "8px" }}
            placeholder="메인 제목"
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>중제목</label>
          <br />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            style={{ width: "500px", padding: "8px" }}
            placeholder="부제목 (선택)"
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>내용</label>
          <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 8px 0" }}>
            글을 드래그로 선택한 뒤 툴바에서 굵게 · 밑줄 · 글자색을 적용할 수 있습니다. 이미지는 툴바 이미지 버튼으로 삽입합니다.
          </p>
          <div
            ref={editorWrapperRef}
            className="admin-blog-editor-wrap"
            style={{ background: "white", minHeight: "280px" }}
          />
        </div>
        <button type="submit" style={{ marginTop: "15px" }}>
          {editingId ? "수정 완료" : "등록"}
        </button>
      </form>
    </>
  );
}

export default AdminBlogPage;
