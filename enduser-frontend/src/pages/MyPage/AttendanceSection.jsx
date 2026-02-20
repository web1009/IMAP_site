import React, { useState, useEffect } from 'react';
import api from '../../api';

// 예약 목록 조회 API
const getMyReservations = async () => {
  try {
    const response = await api.get('/reservations/myReservations');

    if (response.data.resultCode === 'SUCCESS') {
      // 빈 배열도 유효한 응답이므로 Array.isArray로 체크
      return Array.isArray(response.data.data) ? response.data.data : [];
    } else {
      throw new Error(response.data.message || '예약 목록 조회 실패');
    }
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    // 에러 발생 시 빈 배열 반환하여 화면에 "예약 내역이 없습니다" 표시
    return [];
  }
};

function AttendanceSection({ isVisible = false }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 월의 첫 날과 마지막 날
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 예약 목록 가져오기 - isVisible이 true일 때만 데이터 가져오기
  useEffect(() => {
    if (!isVisible) return;

    const fetchReservations = async () => {
      setLoading(true);
      try {
        const data = await getMyReservations();

        const transformedReservations = (data || []).map((reservation) => {
          // 날짜 포맷 YYYY-MM-DD (문자열이면 그대로, 배열이면 조합, 그 외 Date 변환)
          let dateStr = reservation.rsvDt;
          if (typeof dateStr === 'string') {
            dateStr = dateStr.substring(0, 10);
          } else if (Array.isArray(dateStr) && dateStr.length >= 3) {
            const [y, m, d] = dateStr;
            dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          } else {
            try {
              dateStr = new Date(dateStr).toISOString().split('T')[0];
            } catch {
              dateStr = '';
            }
          }

          // 시간 포맷 HH:mm
          let timeStr = reservation.rsvTime;
          if (typeof timeStr !== 'string') {
            if (Array.isArray(timeStr) && timeStr.length >= 2) {
              timeStr = `${String(timeStr[0]).padStart(2, '0')}:${String(timeStr[1]).padStart(2, '0')}`;
            } else {
              timeStr = '';
            }
          } else {
            timeStr = timeStr.substring(0, 5);
          }

          // attendanceStatus → boolean/null 변환
          let attendance = null;
          if (reservation.attendanceStatus === 'ATTENDED') attendance = true;
          else if (reservation.attendanceStatus === 'ABSENT') attendance = false;
          else attendance = null;

          return {
            id: reservation.reservationId,
            reservationId: reservation.reservationId,
            date: dateStr,
            time: timeStr,
            sportName: reservation.sportName || '프로그램',
            branchName: reservation.brchNm || '지점',
            trainerName: reservation.trainerName || '',
            attendance,
          };
        });

        setReservations(transformedReservations);
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isVisible]);

  const getReservationsByDate = (dateStr) =>
    reservations.filter((res) => res.date === dateStr);

  // 예약 목록 정렬 (날짜·시간 오름차순)
  const sortedReservations = [...reservations].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.time || '').localeCompare(b.time || '');
  });

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(year, month, day));
      const dayReservations = getReservationsByDate(dateStr);
      const hasReservations = dayReservations.length > 0;
      const isToday = dateStr === formatDate(new Date());

      // 출석 상태 확인
      let attendanceStatus = null;
      if (hasReservations) {
        const attended = dayReservations.some((r) => r.attendance === true);
        const absent = dayReservations.some((r) => r.attendance === false);

        if (attended) attendanceStatus = 'attended';
        else if (absent) attendanceStatus = 'absent';
      }

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasReservations ? 'has-reservation' : ''} ${isToday ? 'today' : ''}`}
        >
          <div className="calendar-day-number">{day}</div>

          {hasReservations && (
            <>
              <div className="calendar-day-indicator">
                {attendanceStatus === 'attended' && <div className="attendance-check attended">✓</div>}
                {attendanceStatus === 'absent' && <div className="attendance-check absent">✗</div>}
                {attendanceStatus === null && <div className="attendance-dot"></div>}
              </div>

              <div className="calendar-day-reservations">
                {dayReservations.slice(0, 3).map((r) => (
                  <div key={r.id} className="calendar-reservation-item">
                    <span className="calendar-reservation-time">{r.time}</span>
                    <span className="calendar-reservation-title">
                      {r.sportName}
                      {r.trainerName ? ` · ${r.trainerName}` : ''}
                    </span>
                    {r.attendance === true && <span className="calendar-reservation-status attended">✓</span>}
                    {r.attendance === false && <span className="calendar-reservation-status absent">✗</span>}
                    {r.attendance === null && <span className="calendar-reservation-status pending">·</span>}
                  </div>
                ))}
                {dayReservations.length > 3 && (
                  <div className="calendar-reservation-more">+{dayReservations.length - 3}건 더보기</div>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <section className="mypage-content-section attendance-section">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mypage-content-section attendance-section">
      <h2 className="content-title">출석현황</h2>

      <div className="attendance-layout">
        {/* 왼쪽: 캘린더 */}
        <div className="attendance-calendar-block">
          <div className="calendar-header">
            <button className="calendar-nav-button" onClick={handlePrevMonth}>
              ‹
            </button>
            <h3 className="calendar-month-title">
              {year}년 {month + 1}월
            </h3>
            <button className="calendar-nav-button" onClick={handleNextMonth}>
              ›
            </button>
          </div>

          <div className="calendar-container">
            <div className="calendar-weekdays">
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <div key={d} className="calendar-weekday">
                  {d}
                </div>
              ))}
            </div>
            <div className="calendar-days">{renderCalendarDays()}</div>
          </div>

          <div className="attendance-legend">
            <div className="legend-item">
              <div className="attendance-check attended">✓</div>
              <span>출석</span>
            </div>
            <div className="legend-item">
              <div className="attendance-check absent">✗</div>
              <span>미출석</span>
            </div>
            <div className="legend-item">
              <div className="attendance-dot"></div>
              <span>미확정</span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 예약 목록 게시판 */}
        <div className="attendance-reservation-board">
          <h3 className="reservation-board-title">예약 목록</h3>
          <div className="reservation-board-table-wrap">
            <table className="reservation-board-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>날짜</th>
                  <th>시간</th>
                  <th>프로그램</th>
                  <th>지점</th>
                  <th>출석</th>
                </tr>
              </thead>
              <tbody>
                {sortedReservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="reservation-board-empty">
                      예약 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  sortedReservations.map((r, index) => (
                    <tr key={r.id}>
                      <td>{index + 1}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>{r.sportName}{r.trainerName ? ` · ${r.trainerName}` : ''}</td>
                      <td>{r.branchName}</td>
                      <td>
                        {r.attendance === true && <span className="board-status attended">출석</span>}
                        {r.attendance === false && <span className="board-status absent">미출석</span>}
                        {r.attendance === null && <span className="board-status pending">미확정</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AttendanceSection;
