import { useState, useEffect } from 'react';
import './SignSection.css';
import { SIGN_SECTION_TEXT } from './signSectionConfig';
import api from '../../../../api';

export default function SignSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    motivation: '',
    program: '',
  });
  const [loading, setLoading] = useState(false);
  const [programOptions, setProgramOptions] = useState([{ value: '', label: '프로그램을 선택해주세요' }]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get('/programs/getProgramListForR');
        // ApiResponse 래퍼: { resultCode, message, data } 또는 배열 직접 반환
        const raw = res?.data;
        const list = Array.isArray(raw)
          ? raw
          : (raw?.data != null && Array.isArray(raw.data)
            ? raw.data
            : []);
        const options = [
          { value: '', label: '프로그램을 선택해주세요' },
          ...list
            .filter((p) => String(p.progNm ?? p.prog_nm ?? '').trim() !== '')
            .map((p) => {
              const name = p.progNm ?? p.prog_nm ?? '';
              return { value: name, label: name };
            }),
        ];
        setProgramOptions(options);
      } catch (e) {
        console.error('프로그램 목록 조회 실패:', e);
      }
    };
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/user/application', formData);
      
      if (response.data && response.data.resultCode === 'SUCCESS') {
        alert(SIGN_SECTION_TEXT.submitAlert);
        // 폼 초기화
        setFormData({
          name: '',
          phone: '',
          motivation: '',
          program: '',
        });
      } else {
        alert('신청서 제출에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('프로그램 신청 오류:', error);
      alert('신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="sign-form" className="sign-section">
      <div className="sign-container">
        <div className="sign-header">
          <span className="sign-en">{SIGN_SECTION_TEXT.headerEn}</span>
          <h2 className="sign-title">{SIGN_SECTION_TEXT.headerTitle}</h2>
          <p className="sign-description">
            {SIGN_SECTION_TEXT.headerDescription}
          </p>
        </div>

        <form className="sign-form" onSubmit={handleSubmit}>
          <div className="form-group form-group-input">
            <label htmlFor="name" className="form-label">
              {SIGN_SECTION_TEXT.nameLabel}{' '}
              <span className="required">*</span>
            </label>
            <div className="input-placeholder-wrap">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder=" "
                required
              />
              <span className={`input-placeholder-text ${formData.name ? 'hidden' : ''}`} aria-hidden="true">
                {SIGN_SECTION_TEXT.namePlaceholder}
              </span>
            </div>
          </div>

          <div className="form-group form-group-input">
            <label htmlFor="phone" className="form-label">
              {SIGN_SECTION_TEXT.phoneLabel}{' '}
              <span className="required">*</span>
            </label>
            <div className="input-placeholder-wrap">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder=" "
                required
              />
              <span className={`input-placeholder-text ${formData.phone ? 'hidden' : ''}`} aria-hidden="true">
                {SIGN_SECTION_TEXT.phonePlaceholder}
              </span>
            </div>
          </div>

          <div className="form-group">
            <select
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="form-select"
              required
            >
              {programOptions.map((option) => (
                <option key={option.value || 'default'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <textarea
              id="motivation"
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              className="form-textarea"
              placeholder={SIGN_SECTION_TEXT.motivationPlaceholder}
              rows="5"
              required
            />
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? '제출 중...' : SIGN_SECTION_TEXT.submitButton}
          </button>
        </form>
      </div>
    </section>
  );
}
