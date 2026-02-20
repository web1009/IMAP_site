import { useState, useEffect } from 'react';
import './NewsSection.css';
import { Link } from 'react-router-dom';
import api from '../../../../api';

const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// API 응답 날짜(ISO 또는 "2026. 2. 2.") → FEB, 2, 2026 형식
function formatDate(dateString) {
  if (!dateString) return '';
  // ISO 형식 (2026-02-12 또는 2026-02-12T10:30:00)
  const isoMatch = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const month = parseInt(m, 10) - 1;
    if (month >= 0 && month <= 11) {
      return `${monthNames[month]}, ${parseInt(d, 10)}, ${y}`;
    }
  }
  // "2026. 2. 2." 형식
  const parts = String(dateString).replace(/\./g, '').trim().split(/\s+/);
  if (parts.length === 3) {
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    if (month >= 0 && month <= 11) return `${monthNames[month]}, ${day}, ${year}`;
  }
  return dateString;
}

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

// 메인 뉴스 카드용 고정 이미지 (프론트에서 관리)
const NEWS_CARD_IMAGES = ['/images/main/n1.jpg', '/images/main/n2.jpg', '/images/main/n3.jpg'];

export default function NewsSection() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/user/blog');
        const list = Array.isArray(res.data) ? res.data : [];
        // 최신 3개 (API가 이미 created_at DESC로 정렬된 목록 반환)
        const three = list.slice(0, 3).map((post) => ({
          id: post.postId,
          postId: post.postId,
          title: post.title || '',
          description: post.subtitle || stripHtml(post.content || '').slice(0, 80),
          date: post.createdAt,
        }));
        setLatestPosts(three);
      } catch (e) {
        console.error('블로그 목록 조회 실패:', e);
        setLatestPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="news-section">
      <div className="news-inner">
        <div className="news-heading">
          <span className="news-kicker">IMAP</span>
          <h2 className="news-title">IMAP의 소식을 한눈에</h2>
          <p className="news-subtitle">
            새롭게 진행되는 프로그램과 인사이트 리포트를 최신 뉴스 카드로 확인해 보세요.
          </p>
        </div>

        {loading ? (
          <p className="news-loading">최신 소식을 불러오는 중...</p>
        ) : (
          <div className="news-grid">
            {latestPosts.map((post, index) => {
              const imageUrl = NEWS_CARD_IMAGES[index % NEWS_CARD_IMAGES.length];
              return (
              <article key={post.id ?? post.postId} className="news-card">
                <div className="news-card-visual">
                  <div
                    className="news-card-image"
                    style={{
                      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>

                <div className="news-card-body">
                  <span className="news-card-category">IMAP</span>
                  <h3 className="news-card-heading">{post.title}</h3>
                  {post.description && (
                    <p className="news-card-description">{post.description}</p>
                  )}
                  <p className="news-card-date">{formatDate(post.date)}</p>

                  <div className="news-card-footer">
                    <Link to={`/blog/post/${post.postId}`} className="news-card-link">
                      자세히 보기
                      <i className="bi bi-arrow-right" />
                    </Link>
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        )}

        {!loading && latestPosts.length === 0 && (
          <p className="news-empty">등록된 소식이 없습니다.</p>
        )}
      </div>
    </section>
  );
}
