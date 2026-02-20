import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import api from '../../api';
import { BLOG_PAGE_META, BLOG_LETTER, BLOG_LIST } from './blogData';
import './BlogHome.css';

function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/user/blog');
        setPosts(res.data || []);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pagedPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = dateStr.split('T')[0];
    const [y, m, day] = d.split('-');
    return `${y}. ${parseInt(m, 10)}. ${parseInt(day, 10)}.`;
  };

  const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').trim();
  };

  return (
    <>
      <Helmet>
        <title>{BLOG_PAGE_META.title}</title>
        <meta name="description" content={BLOG_PAGE_META.description} />
      </Helmet>
      
      <div className="blog-newsletter-container">
        {/* 편지 형태 헤더 섹션 */}
        <div className="blog-newsletter-header">
          <div className="blog-letter-paper">
            <div className="blog-letter-fold"></div>
            <div className="blog-letter-stamp" aria-hidden>{BLOG_LETTER.stampText}</div>
            <div className="blog-letter-content">
              <p className="blog-letter-greeting">{BLOG_LETTER.greeting}</p>
              <h1 className="blog-letter-title">{BLOG_LETTER.title}</h1>
              <p className="blog-letter-slogan">{BLOG_LETTER.slogan}</p>
              <div className="blog-letter-body">
                {BLOG_LETTER.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <p className="blog-letter-sign">{BLOG_LETTER.sign}</p>
            </div>
          </div>
        </div>

        {/* 지난 뉴스레터 섹션 */}
        <div className="blog-newsletter-list-section">
          <div className="blog-newsletter-list-container">
            <h2 className="blog-newsletter-list-title">{BLOG_LIST.sectionTitle}</h2>
            <div className="blog-newsletter-list">
              {loading ? (
                <p style={{ padding: '20px' }}>{BLOG_LIST.loadingMessage}</p>
              ) : pagedPosts.length === 0 ? (
                <p style={{ padding: '20px' }}>{BLOG_LIST.emptyMessage}</p>
              ) : (
                pagedPosts.map((post) => {
                  const contentPreview = stripHtml(post.content || '');
                  return (
                    <Link
                      key={post.postId}
                      to={`/blog/post/${post.postId}`}
                      className="blog-newsletter-item"
                    >
                      <div className="blog-newsletter-item-dot"></div>
                      <div className="blog-newsletter-item-content">
                        <div className="blog-newsletter-item-header">
                          <span className="blog-newsletter-item-prefix">{BLOG_LIST.itemPrefix}</span>
                          <h3 className="blog-newsletter-item-title">{post.title}</h3>
                        </div>
                        {post.subtitle ? (
                          <p className="blog-newsletter-item-subtitle">{post.subtitle}</p>
                        ) : null}
                      
                        <div className="blog-newsletter-item-date">{formatDate(post.createdAt)}</div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* 페이지네이션 */}
            {!loading && totalPages > 1 && (
              <div className="blog-pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="blog-pagination-button"
                >
                  이전
                </button>

                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`blog-pagination-button ${page === pageNum ? 'active' : ''}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(page + 1)}
                  className="blog-pagination-button"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogHome;
