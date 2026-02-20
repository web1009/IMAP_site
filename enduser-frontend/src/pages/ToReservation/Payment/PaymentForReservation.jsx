import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentForReservation.css';
import api from '../../../api';
import ReservationComplete from '../ReservationComplete/ReservationComplete';

const PaymentForReservation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ProgramDetailPage에서 전달받은 정보 구조분해 할당 (값이 없을 경우 대비하여 기본값 설정)
    const {
        schdId,
        progId,
        selectedDate, // YYYY-MM-DD 형식 문자열
        userName,
        brchNm,
        progNm,
        strtTm,
        endTm,
        oneTimeAmt = 0, // 기본값 0
        rwdGamePnt = 0 // 기본값 0
    } = location.state || {};

    const loggedInUserId = useSelector(state => state.auth.userId);

    // 결제 수단: 계좌이체만 가능
    const [payMethod, setPayMethod] = useState('REMITTANCE'); // 계좌이체 고정

    const [loading, setLoading] = useState(true); // 전체 페이지 로딩 상태
    const [error, setError] = useState(null); // 에러 메시지

    // 최종 결제 금액: 계좌이체만 가능하므로 항상 oneTimeAmt
    const [finalAmount, setFinalAmount] = useState(oneTimeAmt);

    // 결제 완료 모달
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- 초기 로드 및 유효성 검사 ---
    useEffect(() => {
        // 필수 정보가 없으면 알림 후 홈으로 리다이렉트
        if (!progId || !selectedDate || !loggedInUserId || !progNm) {
            alert('필수 예약 정보가 누락되었습니다. 다시 시도해 주세요.');
            navigate('/', { replace: true }); // 히스토리 스택에 쌓이지 않도록 replace 사용
            return;
        }

        // 초기 금액 설정
        setFinalAmount(oneTimeAmt);
        setLoading(false); // 필수 정보 로드 완료

    }, [progId, selectedDate, loggedInUserId, progNm, oneTimeAmt, navigate, location.state]);

    // --- 핸들러 함수들 ---

    // --- 최종 결제 버튼 클릭 핸들러 ---
    const handleFinalPayment = async () => {
        // 중복 클릭 방지: 이미 처리 중이면 무시
        if (loading) {
            return;
        }

        if (!loggedInUserId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        if (!progId || !selectedDate || !progNm) {
            alert('필수 예약 정보가 누락되었습니다. 다시 시도해 주세요.');
            return;
        }
        if (!payMethod || payMethod !== 'REMITTANCE') {
            alert('계좌이체만 가능합니다.');
            return;
        }
        if (finalAmount <= 0) {
            alert('결제 금액이 0원 이하입니다.');
            return;
        }
        if (!schdId) {
            alert('스케줄 정보가 올바르지 않습니다.');
            return;
        }

        setLoading(true); // 결제 처리 로딩 시작
        setError(null);

        try {
            // reservationTime 형식 변환 (HH:MM:SS -> HH:MM)
            let formattedTime = strtTm;
            if (strtTm && typeof strtTm === 'string') {
                // HH:MM:SS 형식이면 HH:MM만 추출
                formattedTime = strtTm.substring(0, 5);
            }
            
            // amount가 0이거나 null인지 확인
            if (!finalAmount || finalAmount <= 0) {
                alert('결제 금액이 올바르지 않습니다.');
                return;
            }

            const requestBody = {
                userId: loggedInUserId,
                amount: finalAmount,
                payMethod: 'REMITTANCE', // 계좌이체 고정
                schdId: schdId,
                reservationDate: selectedDate, // YYYY-MM-DD 형식 문자열
                reservationTime: formattedTime, // HH:MM 형식 (HH:MM:SS에서 변환)
                userPassId: null, // 이용권 사용 불가
                paymentDetails: `스케줄 예약: ${progNm} - ${selectedDate}`,
                targetId: schdId,
                targetName: `${progNm}`,
            };
            
            console.log('결제 요청 데이터:', requestBody); // 디버깅용

            const response = await api.post('/payments/process', requestBody);

            if (response.data.resultCode === "SUCCESS" || response.status === 201) {
                setIsModalOpen(true);
            } else {
                // 서버에서 에러는 아니지만 처리에 실패한 경우 (비즈니스 로직 에러)
                const errorMsg = response.data.message || '결제 처리 중 오류가 발생했습니다.';
                setError(errorMsg);
                alert(errorMsg);
            }
        } catch (err) {
            console.error('결제 API 호출 오류:', err);
            console.error('에러 상세:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message
            });
            
            // 백엔드에서 보낸 에러 메시지를 사용
            let serverErrorMsg = '결제 서버와 통신 중 오류가 발생했습니다.';
            
            if (err.response?.data) {
                // ApiResponse 형식의 에러 메시지
                if (err.response.data.message) {
                    serverErrorMsg = err.response.data.message;
                } else if (err.response.data.error) {
                    serverErrorMsg = err.response.data.error;
                } else if (typeof err.response.data === 'string') {
                    serverErrorMsg = err.response.data;
                }
            } else if (err.message) {
                serverErrorMsg = err.message;
            }
            
            setError(serverErrorMsg);
            alert(`결제 실패: ${serverErrorMsg}`);
        } finally {
            setLoading(false); // 결제 처리 로딩 완료
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        return `${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);
        const ampm = h >= 12 ? '오후' : '오전';
        const h12 = h % 12 || 12;
        const minuteStr = m > 0 ? ` ${m}분` : '';
        return `${ampm} ${h12}시${minuteStr}`;
    };

    return (
        <div className="payment-page-container">
            <div className="reservation-summary">
                <p><strong>프로그램:</strong> {progNm}</p>
                <p><strong>강사:</strong> {userName}</p>
                <p><strong>지점:</strong> {brchNm}</p>
                <p><strong>예약 날짜:</strong> {formatDate(selectedDate)}</p>
                <p><strong>예약 시간:</strong> {formatTime(strtTm)} ~ {formatTime(endTm)}</p>
                <p><strong>결제 금액:</strong> {oneTimeAmt.toLocaleString()}원</p>
            </div>

            {/* --- 결제 수단 (계좌이체만) --- */}
            <div className="payment-method-selection">
                <h3>결제 수단</h3>
                <div className="pay-method-options">
                    <label>
                        <input
                            type="radio"
                            name="payMethod"
                            value="REMITTANCE"
                            checked={true}
                            disabled
                        />
                        계좌이체
                    </label>
                </div>
                <p className="payment-amount-display">결제 금액: <span>{oneTimeAmt.toLocaleString()}원</span></p>
                <p style={{ color: '#856404', fontSize: '14px', marginTop: '10px' }}>
                    ⚠️ 계좌이체 후 관리자 확인이 완료되면 예약이 확정됩니다.
                </p>
            </div>

            {/* --- 최종 결제 금액 요약 --- */}
            <div className="final-payment-info">
                <h3>총 결제 금액: <span className="final-amount">{finalAmount.toLocaleString()}원</span></h3>
            </div>

            <div className="payment-actions">
                <button onClick={() => navigate(-1)} className="back-button">
                    뒤로 가기
                </button>

                <button
                    onClick={handleFinalPayment}
                    disabled={loading || !payMethod || finalAmount <= 0}
                    className="final-payment-button"
                >
                    {loading ? '결제 처리 중...' : '결제 확정'}
                </button>
            </div>

            <ReservationComplete
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default PaymentForReservation;