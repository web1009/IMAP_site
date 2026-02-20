import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { Link, useLocation } from 'react-router-dom';
import './ScheduleListPage.css';
import Calendar from 'react-calendar'; // 캘린더 추가
import 'react-calendar/dist/Calendar.css';

const ScheduleListPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sportId = queryParams.get('sportId');
    const brchId = queryParams.get('brchId');
    const type = queryParams.get('type');   // "sport" 또는 "branch"
    const categoryName = queryParams.get('name'); // 상단에 표시할 종목명/지점명

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [inputVal, setInputVal] = useState('');

    // 페이지네이션을 위한 상태 추가 (현재 페이지, 총 페이지 수)
    const [currentPage, setCurrentPage] = useState(0); // Spring Data JPA는 페이지를 0부터 시작
    const [totalPages, setTotalPages] = useState(0);

    const [selectedFilterDate, setSelectedFilterDate] = useState(null); // 선택한 날짜

    useEffect(() => {
        const fetchSchedulesBySportId = async () => {
            // 날짜가 선택되지 않았다면 시간 목록을 비우고 API 호출을 하지 않습니다.
            if (!selectedFilterDate) {
                setSchedules([]);
                setTotalPages(0);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // API 응답 전체를 저장할 변수 (페이지 정보 포함)
            let apiResponsePage = null;

            try {
                if (sportId) {
                    const response = await api.get(`/schedules/getSchedulesBySportIdForR/${sportId}`,
                        {
                            params: {
                                searchKeyword: searchTerm,
                                page: currentPage,
                                size: 10,
                                selectedDate: selectedFilterDate.toLocaleDateString('sv-SE')
                            }
                        }
                    );
                    apiResponsePage = response.data.data;
                } else if (brchId) {
                    const response = await api.get(`/schedules/getSchedulesByBrchIdForR/${brchId}`,
                        {
                            params: {
                                searchKeyword: searchTerm,
                                page: currentPage,
                                size: 10,
                                selectedDate: selectedFilterDate.toLocaleDateString('sv-SE')
                            }
                        }
                    );
                    apiResponsePage = response.data.data;
                } else {
                    setError('유효한 ID가 전달되지 않았습니다.');
                    console.warn('Neither sportId nor brchId is present in query parameters.');
                    setLoading(false);
                    return;
                }
            } catch (err) {
                setError('스케줄 데이터를 불러오는 데 실패했습니다.');
                console.error('Error fetching schedule data:', err);
                setLoading(false);
                return;
            }

            // Page 객체의 'content' 필드에서 실제 데이터 배열을 추출
            if (apiResponsePage && apiResponsePage.content) {
                setSchedules(apiResponsePage.content);
                setTotalPages(apiResponsePage.totalPages);
            } else {
                setSchedules([]);                
                setTotalPages(0);
            }
            setLoading(false);
        };

        fetchSchedulesBySportId();
    }, [sportId, brchId, searchTerm, currentPage, location.search, selectedFilterDate])

    const handleInputChange = (e) => {
        setInputVal(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        setSearchTerm(inputVal);
    };

    // 페이지 번호 클릭 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 시간 포맷팅 함수: "18:00:00" -> "오후 6시" 또는 "18:00"
    const formatTime = (timeString) => {
        if (!timeString) return "";

        // "18:00:00"에서 시, 분만 추출
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);

        // 방법 1: "오후 6시" 형식 (추천)
        const ampm = h >= 12 ? '오후' : '오전';
        const h12 = h % 12 || 12; // 0시는 12시로 표시
        const minuteStr = m > 0 ? ` ${m}분` : ''; // 분이 0이면 생략

        return `${ampm} ${h12}시${minuteStr}`;

        // 방법 2: 만약 "18:00" 형식을 원하신다면 아래 코드를 사용하세요.
        // return `${hours}:${minutes}`;
    };

    // 날짜 포맷팅 함수: "2025-12-31" -> "12월 31일"
    const formatDate = (dateString) => {
        if (!dateString) return "";

        // "-" 기준으로 잘라서 [년, 월, 일] 추출
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString; // 형식이 다르면 그대로 반환

        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        return `${month}월 ${day}일`;
    };
    return (
        <div className='schedule-list-page-container'>

            {/* 1. 타이틀 영역: state 대신 URL 파라미터(categoryName) 사용 */}
            <p className='schedule-header-info'>
                {type === "sport" ? (
                    `종목별 예약 / ${categoryName}`
                ) : (
                    `지점별 예약 / ${categoryName}`
                )}
            </p>

            {/* 검색 영역 */}
            <div className="filter-wrapper">
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="search"
                        placeholder="프로그램명 또는 강사명을 검색하세요"
                        value={inputVal}
                        onChange={handleInputChange}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <span role="img" aria-label="search">🔍</span>
                    </button>
                </form>
            </div>

            {/* 달력 영역 - 항상 노출 */}
            <div className="calendar-inline-wrapper">
                <div className="calendar-inline-header">
                    <span className="calendar-title">예약 날짜 선택</span>
                    {selectedFilterDate && (
                        <button
                            className="reset-date-btn"
                            onClick={() => {
                                setSelectedFilterDate(null);
                                setCurrentPage(0);
                            }}
                        >
                            날짜 초기화
                        </button>
                    )}
                </div>
                <Calendar
                    onChange={(date) => {
                        setSelectedFilterDate(date);
                        setCurrentPage(0); // 날짜 변경 시 첫 페이지로
                    }}
                    value={selectedFilterDate || new Date()}
                    locale="ko-KR"
                    calendarType="gregory"
                    formatDay={(locale, date) => date.getDate()}
                    minDate={new Date()}
                />
            </div>

            <div className="time-list-section">
                <h3 className="time-list-title">
                    {selectedFilterDate
                        ? `${formatDate(selectedFilterDate.toLocaleDateString('sv-SE'))} 예약 가능한 시간`
                        : '날짜를 먼저 선택해 주세요'}
                </h3>

                {!selectedFilterDate ? (
                    <p className="time-list-helper">
                        위 달력에서 지점 또는 종목의 예약을 원하는 날짜를 선택하면,
                        예약 가능한 시간이 아래에 표시됩니다.
                    </p>
                ) : (
                    <div className='schedules-list'>
                        {loading ? (
                            <div className='loading-message'>스케줄 데이터를 불러오는 중 입니다.</div>
                        ) : (
                            error ? (
                                <div className='error-message'>{error}</div>
                            ) : (
                                schedules.length > 0 ? (
                                    schedules.map((schedule, index) => (
                                        <div key={`${schedule.progId}-${schedule.strtTm}-${index}`} className='schedule-item-wrapper'>
                                            <Link
                                                to={`/program-detail?progId=${schedule.progId}&userName=${encodeURIComponent(schedule.userName)}&brchNm=${encodeURIComponent(schedule.brchNm)}&strtDt=${schedule.groupedStrtDt}&endDt=${schedule.groupedEndDt}&strtTm=${schedule.strtTm}&endTm=${schedule.endTm}&userId=${schedule.userId}`}
                                                state={{ sessions: schedule.sessions }}
                                                className='schedule-item-link'
                                            >
                                                <div className="item-top-section">
                                                    <div className="item-left-header">
                                                        <p className="item-user-name">강사: {schedule.userName}</p>
                                                        <p className="item-prog-name">{schedule.progNm}</p>
                                                    </div>
                                                    <p className="item-brch-name">{schedule.brchNm}</p>
                                                </div>
                                                <div className="item-footer">
                                                    <p className="item-date">{
                                                        schedule.groupedStrtDt === schedule.groupedEndDt
                                                            ? formatDate(schedule.groupedStrtDt)
                                                            : `${formatDate(schedule.groupedStrtDt)} ~ ${formatDate(schedule.groupedEndDt)}`
                                                    }</p>
                                                    <p className="item-time">시간: {formatTime(schedule.strtTm)} ~ {formatTime(schedule.endTm)}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className='no-data-message'>선택한 날짜에 예약 가능한 시간이 없습니다.</div>
                                )
                            )
                        )}
                    </div>
                )}
            </div>

            {/* 페이지네이션 UI */}
            {totalPages > 1 && (
                <div className='pagination'>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className='pagination-button'
                    >
                        {`<<`}
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index)}
                            className={`pagination-button ${currentPage === index ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className='pagination-button'
                    >
                        {`>>`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ScheduleListPage;