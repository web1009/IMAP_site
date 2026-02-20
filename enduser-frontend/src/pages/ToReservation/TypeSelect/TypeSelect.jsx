import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TypeSelect.css';
import BranchSearchModal from '../BranchSearchModal/BranchSearchModal';

const TypeSelect = () => {
    const [sports, setSports] = useState([]);
    const [sportLoading, setSportLoading] = useState(true);
    const [sportError, setSportError] = useState(null);

    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [branchloading, setBranchLoading] = useState(true);
    const [branchError, setBranchError] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // --- 모달 / 탭 상태 관리 ---
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('branch'); // 'branch' | 'sport'
    
    // --- 종목별 예약 아코디언 및 달력 상태 관리 ---
    const [expandedGroups, setExpandedGroups] = useState({}); // 펼쳐진 그룹 관리
    const [selectedSport, setSelectedSport] = useState(null); // 선택된 종목
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
    const [schedules, setSchedules] = useState([]); // 스케줄 목록
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const navigate = useNavigate();

    // 종목 데이터 호출
    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await api.get('/sporttypes/getAllSportTypesForR');
                console.log('종목 API 전체 응답:', response);
                console.log('종목 API response.data:', response.data);
                console.log('종목 API response.data.data:', response.data?.data);
                
                if (response.data && response.data.data) {
                    console.log('종목 데이터 개수:', response.data.data.length);
                    setSports(response.data.data);
                } else {
                    console.warn('종목 데이터가 없거나 구조가 다릅니다. response.data:', response.data);
                    setSports([]);
                }
            } catch (err) {
                setSportError('스포츠 종목 데이터를 불러오는 데 실패 했습니다.');
                console.error('Error fetching sport data:', err);
                console.error('Error response:', err.response);
                setSports([]);
            } finally {
                setSportLoading(false);
            }
        }

        fetchSports();
    }, []);

    // 지점 데이터 호출
    useEffect(() => {
        const fetchBranchs = async () => {
            try {
                const response = await api.get('/branches/getAllBranchesForR');
                console.log('지점 API 전체 응답:', response);
                console.log('지점 API response.data:', response.data);
                console.log('지점 API response.data.data:', response.data?.data);
                
                if (response.data && response.data.data) {
                    const allBranches = response.data.data;
                    console.log('지점 데이터 개수:', allBranches.length);
                    const topBranches = allBranches.slice(0, 4); // 가장 앞의 4개의 데이터만 저장

                    setBranches(allBranches);
                    setFilteredBranches(topBranches);
                    setSelectedBranch(topBranches[0] || null); // 기본 선택 지점
                } else {
                    console.warn('지점 데이터가 없거나 구조가 다릅니다. response.data:', response.data);
                    setBranches([]);
                    setFilteredBranches([]);
                    setSelectedBranch(null);
                }
            } catch (err) {
                setBranchError('지점 데이터를 불러오는 데 실패 했습니다.');
                console.error('Error fetching branch data:', err);
                console.error('Error response:', err.response);
                setBranches([]);
                setFilteredBranches([]);
                setSelectedBranch(null);
            } finally {
                setBranchLoading(false);
            }
        }

        fetchBranchs();
    }, []);

    // 주소에서 "○○역" 형태의 역 이름 추출
    const extractStationFromAddress = (addr) => {
        if (!addr) return null;
        const match = addr.match(/([가-힣0-9]+역)/);
        return match ? match[1] : null;
    };

    // 지점 정보를 기반으로 지도 URL 생성 (데이터에 입력된 주소 우선 사용)
    const getBranchMapUrl = (branch) => {
        if (!branch) return '';

        const addr = branch.addr && branch.addr.trim();
        const query = addr || extractStationFromAddress(branch.addr) || branch.brchNm || '';

        if (!query) return '';

        // Google Maps 위성 지도 embed (t=k: satellite, output=embed)
        return `https://www.google.com/maps?q=${encodeURIComponent(
            query,
        )}&t=k&z=16&output=embed`;
    };

    const renderBranchContent = () => (
        <div className="tab-content">
            {/* 상단: 블로그 피처 카드처럼, 왼쪽 지점 선택 / 오른쪽 달력 */}
            <div className="branch-hero-card">
                <div className="branch-hero-content">
                    <div className="tab-content-header">
                        <h2 className="tab-title">지점별 예약</h2>
                        <button
                            type="button"
                            className="more-link-button"
                            onClick={() => setIsBranchModalOpen(true)}
                        >
                            더보기
                        </button>
                    </div>

                    <p className="tab-description">
                        자주 이용하는 지점을 기준으로 예약할 수 있어요.
                    </p>

                    <div className="branch-selection-area">
                        {branchloading ? (
                            <div className="status-text">지점 데이터를 불러오는 중 입니다.</div>
                        ) : branchError ? (
                            <div className="status-text error">{branchError}</div>
                        ) : branches.length === 0 ? (
                            <div className="status-text">등록된 지점이 없습니다.</div>
                        ) : (
                            filteredBranches.map((branch) => (
                                <div
                                    key={branch.brchId}
                                    className="branch-item-wrapper"
                                    onMouseEnter={() => setSelectedBranch(branch)}
                                >
                                    <Link
                                        className="branch-link-item"
                                        to={`/schedule-list?type=branch&brchId=${branch.brchId}&name=${encodeURIComponent(
                                            branch.brchNm,
                                        )}`}
                                    >
                                        <i className="bi bi-geo-alt-fill branch-link-icon" aria-hidden="true" />
                                        <p className="branch-name-text">{branch.brchNm}</p>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="branch-hero-calendar">
                    <div className="calendar-placeholder">
                        {selectedBranch ? (
                            <iframe
                                title="branch-map"
                                src={getBranchMapUrl(selectedBranch)}
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '8px' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        ) : (
                            <span>지점을 선택하면 지도 링크가 표시됩니다.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // 그룹 펼치기/접기 토글
    const toggleGroup = (groupKey) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    // 종목 선택 핸들러
    const handleSportSelect = (sport) => {
        setSelectedSport(sport);
        setSelectedDate(null);
        setSchedules([]);
    };

    // 날짜 선택 핸들러
    const handleDateSelect = async (date) => {
        if (!selectedSport) return;
        
        setSelectedDate(date);
        setScheduleLoading(true);
        
        try {
            const formattedDate = date.toLocaleDateString('sv-SE'); // YYYY-MM-DD 형식
            const response = await api.get(`/schedules/getSchedulesBySportIdForR/${selectedSport.sportId}`, {
                params: {
                    searchKeyword: '',
                    page: 0,
                    size: 100,
                    selectedDate: formattedDate
                }
            });
            
            if (response.data && response.data.data && response.data.data.content) {
                setSchedules(response.data.data.content);
            } else {
                setSchedules([]);
            }
        } catch (err) {
            console.error('스케줄 조회 실패:', err);
            setSchedules([]);
        } finally {
            setScheduleLoading(false);
        }
    };

    // 시간 포맷팅
    const formatTime = (timeValue) => {
        if (!timeValue) return "";
        // LocalTime 객체이거나 문자열일 수 있으므로 문자열로 변환
        const timeString = typeof timeValue === 'string' ? timeValue : String(timeValue);
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);
        if (isNaN(h)) return "";
        const ampm = h >= 12 ? '오후' : '오전';
        const h12 = h % 12 || 12;
        const minuteStr = m > 0 ? ` ${m}분` : '';
        return `${ampm} ${h12}시${minuteStr}`;
    };

    // 예약하기 핸들러
    const handleReservation = (schedule) => {
        // sessions에서 첫 번째 세션의 schdId 사용
        const schdId = schedule.sessions && schedule.sessions.length > 0 
            ? schedule.sessions[0].schdId 
            : null;
        
        navigate(`/program-detail?progId=${schedule.progId}&userId=${schedule.userId}&brchNm=${encodeURIComponent(schedule.brchNm)}&strtDt=${schedule.groupedStrtDt}&endDt=${schedule.groupedEndDt}&strtTm=${schedule.strtTm}&endTm=${schedule.endTm}`, {
            state: {
                sessions: schedule.sessions || [{
                    date: schedule.groupedStrtDt,
                    schdId: schdId,
                    strtTm: schedule.strtTm,
                    endTm: schedule.endTm
                }]
            }
        });
    };

    const renderSportContent = () => {
        // sport_memo 로 그룹 분류 (EMOTION / SELF / LIFE / EDUCATION / NETWORK)
        const groups = {
            EMOTION: {
                title: '마음 지도 (Map of Emotions)',
                description: '나의 감정과 마음을 들여다보는 여정을 떠나요.',
                items: [],
            },
            SELF: {
                title: '자기 이해 지도 (Self-Map)',
                description: '성향과 사고 패턴을 탐색하며 나를 이해해요.',
                items: [],
            },
            LIFE: {
                title: '인생 설계 지도 (Life Map)',
                description: '진로, 목표, 관계까지 나의 내일을 한눈에 계획해요.',
                items: [],
            },
            EDUCATION: {
                title: '교육 프로그램',
                description: '개인별 진단 결과를 바탕으로 효과적인 변화와 성장을 지원하는 맞춤형 프로그램입니다.',
                items: [],
            },
            NETWORK: {
                title: '네트워크',
                description: '인생 경험이 풍부한 선배들과 현직자들을 만나 현실적인 조언과 경험을 나누는 시간입니다.',
                items: [],
            },
        };

        sports.forEach((sport) => {
            const key = (sport.groupCd || sport.sportMemo || '').toUpperCase();
            if (groups[key]) {
                groups[key].items.push(sport);
            }
        });

        return (
            <div className="tab-content sport-reservation-layout">
                <div className="sport-list-section">
                    <div className="tab-content-header">
                        <h2 className="tab-title">종목별 예약</h2>
                    </div>

                    <p className="tab-description">
                        원하는 지도를 선택하고, 항목을 골라 참여 가능한 스케줄을 확인해 보세요.
                    </p>

                    {sportLoading ? (
                        <div className="status-text">스포츠 종목 데이터를 불러오는 중 입니다.</div>
                    ) : sportError ? (
                        <div className="status-text error">{sportError}</div>
                    ) : sports.length === 0 ? (
                        <div className="status-text">등록된 종목이 없습니다.</div>
                    ) : (
                        <div className="mind-map-groups">
                            {Object.entries(groups).map(([key, group]) =>
                                group.items.length > 0 ? (
                                    <section key={key} className="mind-map-section">
                                        <div 
                                            className="mind-map-header"
                                            onClick={() => toggleGroup(key)}
                                        >
                                            <h3 className="mind-map-title">{group.title}</h3>
                                            <span className="accordion-icon">
                                                {expandedGroups[key] ? '▼' : '▶'}
                                            </span>
                                        </div>
                                        {expandedGroups[key] && (
                                            <>
                                                {group.description && (
                                                    <p className="mind-map-description">{group.description}</p>
                                                )}
                                                <div className="sport-selection-area">
                                                    {group.items.map((sport) => (
                                                        <div 
                                                            key={sport.sportId} 
                                                            className={`sport-item-wrapper ${selectedSport?.sportId === sport.sportId ? 'selected' : ''}`}
                                                            onClick={() => handleSportSelect(sport)}
                                                        >
                                                            <p className="sport-name-text">{sport.sportNm}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </section>
                                ) : null,
                            )}
                        </div>
                    )}
                </div>

                {/* 오른쪽 달력 및 시간 선택 영역 */}
                {selectedSport && (
                    <div className="sport-calendar-section">
                        <div className="selected-sport-info">
                            <h3 className="selected-sport-title">{selectedSport.sportNm}</h3>
                            <button 
                                className="close-selection-btn"
                                onClick={() => {
                                    setSelectedSport(null);
                                    setSelectedDate(null);
                                    setSchedules([]);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="calendar-container">
                            <Calendar
                                onChange={handleDateSelect}
                                value={selectedDate}
                                locale="ko-KR"
                                calendarType="gregory"
                                formatDay={(locale, date) => date.getDate()}
                                minDate={new Date()}
                            />
                        </div>

                        {selectedDate && (
                            <div className="time-list-container">
                                <h4 className="time-list-title">
                                    {selectedDate.toLocaleDateString('ko-KR', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        weekday: 'long'
                                    })} 예약 가능한 시간
                                </h4>
                                
                                {scheduleLoading ? (
                                    <div className="status-text">시간 목록을 불러오는 중...</div>
                                ) : schedules.length === 0 ? (
                                    <div className="status-text">선택한 날짜에 예약 가능한 시간이 없습니다.</div>
                                ) : (
                                    <div className="time-list">
                                        {schedules.map((schedule, index) => {
                                            const schdId = schedule.sessions && schedule.sessions.length > 0 
                                                ? schedule.sessions[0].schdId 
                                                : `schedule-${index}`;
                                            return (
                                                <div key={schdId || `schedule-${index}`} className="time-item">
                                                    <div className="time-info">
                                                        <span className="time-range">
                                                            {formatTime(schedule.strtTm)} ~ {formatTime(schedule.endTm)}
                                                        </span>
                                                        <span className="branch-name">{schedule.brchNm}</span>
                                                        <span className="instructor-name">{schedule.userName || '강사명 없음'}</span>
                                                    </div>
                                                    <button 
                                                        className="reserve-btn"
                                                        onClick={() => handleReservation(schedule)}
                                                    >
                                                        예약하기
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="type-select-page">
            <div className="type-select-panel">
                <header className="type-select-header">
                    <div>
                        <h1 className="type-select-title">예약하기</h1>
                        <p className="type-select-subtitle">
                            지점 또는 종목을 선택해 예약 가능한 스케줄을 확인해 보세요.
                        </p>
                    </div>
                </header>

                <div className="type-select-tabs">
                    <button
                        type="button"
                        className={`type-tab ${activeTab === 'branch' ? 'active' : ''}`}
                        onClick={() => setActiveTab('branch')}
                    >
                        지점별 예약
                    </button>
                    <button
                        type="button"
                        className={`type-tab ${activeTab === 'sport' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sport')}
                    >
                        종목별 예약
                    </button>
                </div>

                <main className="type-select-body">
                    {activeTab === 'branch' ? renderBranchContent() : renderSportContent()}
                </main>
            </div>

            {/* --- 지점 검색 모달 --- */}
            <BranchSearchModal
                isOpen={isBranchModalOpen}
                onClose={() => setIsBranchModalOpen(false)}
                branches={branches}
            />
        </div>
    );
};

export default TypeSelect;