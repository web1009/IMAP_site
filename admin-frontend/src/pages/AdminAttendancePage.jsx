import React, { useState, useEffect } from 'react';
import api from '../api';

/* =========================
   출석 상태 표시
========================= */
const STATUS_LABEL = {
    ATTENDED: { label: '출석', color: '#3498db' },
    ABSENT: { label: '결석', color: '#e74c3c' },
    UNCHECKED: { label: '미처리', color: '#7f8c8d' }
};

function AdminAttendancePage() {
    /* =========================
       스케줄 목록
    ========================= */
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    /* =========================
       참석자 모달
    ========================= */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);

    const [attendees, setAttendees] = useState([]);
    const [attendeeLoading, setAttendeeLoading] = useState(false);

    /* 로컬 선택 상태 (저장 전) - { reservationId: 'ATTENDED'|'ABSENT'|'UNCHECKED' } */
    const [localStatus, setLocalStatus] = useState({});
    const [saving, setSaving] = useState(false);

    /* =========================
       초기 로딩
    ========================= */
    useEffect(() => {
        fetchSchedules();
    }, []);

    /* =========================
       출석 스케줄 목록: 모든 강사/강의 (관리자용)
       GET /api/admin/schedules → scheduleId, startTime, endTime, branchName, programName, currentCount, maxCount
    ========================= */
    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/schedules');
            setSchedules(res.data || []);
        } catch (e) {
            console.error(e);
            alert('출석 스케줄을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       특정 스케줄 참석자 조회
       GET /api/attendance/{schdId}
    ========================= */
    const fetchAttendees = async (scheduleId) => {
        setAttendeeLoading(true);
        try {
            const res = await api.get(`/attendance/${scheduleId}`);
            const data = res.data;
            const list =
                (Array.isArray(data?.reservations) ? data.reservations : null) ??
                (Array.isArray(data?.data?.reservations) ? data.data.reservations : null) ??
                (Array.isArray(data) ? data : null) ??
                [];
            setAttendees(list);
        } catch (e) {
            console.error(e);
            alert('참석자 정보를 불러오지 못했습니다.');
            setAttendees([]);
        } finally {
            setAttendeeLoading(false);
        }
    };

    /* =========================
       모달 열기
    ========================= */
    const openAttendanceModal = async (scheduleId) => {
        setSelectedScheduleId(scheduleId);
        setIsModalOpen(true);
        setLocalStatus({});
        await fetchAttendees(scheduleId);
    };

    /* 출석 상태 로컬 변경 */
    const changeLocalStatus = (reservationId, status) => {
        setLocalStatus(prev => ({ ...prev, [reservationId]: status }));
    };

    /* 현재 표시할 상태 (로컬 > 서버) */
    const getDisplayStatus = (a) => {
        const key = typeof a.attendanceStatus === 'string' ? a.attendanceStatus : (a.attendanceStatus || 'UNCHECKED');
        return localStatus[a.reservationId] ?? key;
    };

    /* 변경 여부 */
    const hasChanges = () => Object.keys(localStatus).length > 0;

    /* =========================
       출석 상태 일괄 저장
       PATCH /api/attendance/{schdId}/reservations
    ========================= */
    const saveAttendance = async () => {
        if (!hasChanges()) {
            alert('변경된 출석 상태가 없습니다.');
            return;
        }
        setSaving(true);
        try {
            const items = Object.entries(localStatus).map(([reservationId, status]) => ({
                reservationId: Number(reservationId),
                status
            }));
            await api.patch(`/attendance/${selectedScheduleId}/reservations`, { items });

            setAttendees(prev =>
                prev.map(a => ({
                    ...a,
                    attendanceStatus: localStatus[a.reservationId] ?? a.attendanceStatus
                }))
            );
            setLocalStatus({});
            alert('저장되었습니다.');
        } catch (e) {
            console.error(e);
            alert('저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    /* =========================
       렌더링
    ========================= */
    return (
        <div style={{ padding: '20px' }}>
            <h1>[관리자] 출결 관리</h1>

            {/* =========================
               스케줄 목록
            ========================= */}
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>시간</th>
                            <th>지점</th>
                            <th>수업</th>
                            <th>강사명</th>
                            <th>예약한 사용자명</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length === 0 ? (
                            <tr>
                                <td colSpan="6">데이터 없음</td>
                            </tr>
                        ) : (
                            schedules.map(item => (
                                <tr
                                    key={item.scheduleId}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        openAttendanceModal(item.scheduleId)
                                    }
                                >
                                    <td>{item.scheduleId}</td>
                                    <td>
                                        {item.startTime} ~ {item.endTime}
                                    </td>
                                    <td>{item.branchName}</td>
                                    <td>{item.programName}</td>
                                    <td>{item.instructorName ?? '-'}</td>
                                    <td>{item.reservedUserNames || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* =========================
               참석자 모달
            ========================= */}
            {isModalOpen && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h2>📋 참석자 명단</h2>

                        {attendeeLoading ? (
                            <p>로딩 중...</p>
                        ) : attendees.length === 0 ? (
                            <p>예약자 없음</p>
                        ) : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th>이름</th>
                                        <th>연락처</th>
                                        <th>출석 상태</th>
                                        <th>출결 체크</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendees.map(a => {
                                        const displayStatus = getDisplayStatus(a);
                                        const st = STATUS_LABEL[displayStatus] || STATUS_LABEL.UNCHECKED;

                                        return (
                                            <tr key={a.reservationId}>
                                                <td>{a.userName}</td>
                                                <td>{a.phone ?? a.phoneNumber ?? '-'}</td>
                                                <td>
                                                    <span
                                                        style={{
                                                            background: st.color,
                                                            color: '#fff',
                                                            padding: '4px 10px',
                                                            borderRadius: '12px'
                                                        }}
                                                    >
                                                        {st.label}
                                                    </span>
                                                </td>
                                                <td style={{ minWidth: '220px' }}>
                                                    <label style={{ marginRight: '12px', cursor: 'pointer' }}>
                                                        <input
                                                            type="radio"
                                                            name={`status-${a.reservationId}`}
                                                            checked={displayStatus === 'ATTENDED'}
                                                            onChange={() => changeLocalStatus(a.reservationId, 'ATTENDED')}
                                                            style={{ marginRight: '4px' }}
                                                        />
                                                        출석
                                                    </label>
                                                    <label style={{ marginRight: '12px', cursor: 'pointer' }}>
                                                        <input
                                                            type="radio"
                                                            name={`status-${a.reservationId}`}
                                                            checked={displayStatus === 'ABSENT'}
                                                            onChange={() => changeLocalStatus(a.reservationId, 'ABSENT')}
                                                            style={{ marginRight: '4px' }}
                                                        />
                                                        결석
                                                    </label>
                                                    <label style={{ cursor: 'pointer' }}>
                                                        <input
                                                            type="radio"
                                                            name={`status-${a.reservationId}`}
                                                            checked={displayStatus === 'UNCHECKED'}
                                                            onChange={() => changeLocalStatus(a.reservationId, 'UNCHECKED')}
                                                            style={{ marginRight: '4px' }}
                                                        />
                                                        미처리
                                                    </label>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {hasChanges() && (
                                <button
                                    type="button"
                                    onClick={saveAttendance}
                                    disabled={saving}
                                    style={{
                                        padding: '10px 24px',
                                        background: saving ? '#95a5a6' : '#27ae60',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    {saving ? '저장 중...' : '저장'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    padding: '10px 24px',
                                    background: '#95a5a6',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================
   스타일
========================= */
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center'
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const modalStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '700px',
    maxHeight: '80vh',
    overflowY: 'auto'
};

export default AdminAttendancePage;
