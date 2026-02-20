import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../api';
import './BlogHome.css';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/user/blog/${id}`);
        setPost(res.data);
      } catch (e) {
        setError(e.response?.status === 404 ? '글이 없거나 비공개입니다.' : '글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = dateStr.split('T')[0];
    const [y, m, day] = d.split('-');
    return `${y}. ${parseInt(m, 10)}. ${parseInt(day, 10)}.`;
  };

  if (loading) {
    return <div className="blog-newsletter-container" style={{ padding: '40px' }}>로딩 중...</div>;
  }
  if (error || !post) {
    return (
      <div className="blog-newsletter-container" style={{ padding: '40px' }}>
        <p>{error || '글이 없습니다.'}</p>
        <Link to="/blog">IMAP 목록으로</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - IMAP</title>
      </Helmet>
      <div className="blog-newsletter-container">
        <article className="blog-post-article">
          <header className="blog-post-header">
            <span className="blog-newsletter-item-prefix">[IMAP]</span>
            <h1 className="blog-post-title">{post.title}</h1>
            {post.subtitle && (
              <p className="blog-post-subtitle">{post.subtitle}</p>
            )}
            <div className="blog-post-meta">
              {formatDate(post.createdAt)}
              {post.views != null && ` · 조회 ${post.views}`}
            </div>
          </header>
          <section className="blog-post-body">
           
            <div
              className="blog-post-content blog-post-content-html"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </section>
          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <Link to="/blog" style={{ color: '#212529' }}>← 지난 뉴스레터 목록</Link>
          </div>
        </article>
      </div>
    </>
  );
}

export default BlogPost;
