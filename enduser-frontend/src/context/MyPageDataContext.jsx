import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const MyPageDataContext = createContext(null);
const STORAGE_KEY = 'mypage_data_v1';

function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      usageHistoryData: parsed.usageHistoryData || [],
      writtenReviews: parsed.writtenReviews || [],
      unwrittenHistories: parsed.unwrittenHistories || [],
      reservationsData: parsed.reservationsData || [],
    };
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function MyPageDataProvider({ children }) {
  const [usageHistoryData, setUsageHistoryData] = useState(() => loadFromStorage()?.usageHistoryData ?? []);
  const [writtenReviews, setWrittenReviews] = useState(() => loadFromStorage()?.writtenReviews ?? []);
  const [unwrittenHistories, setUnwrittenHistories] = useState(() => loadFromStorage()?.unwrittenHistories ?? []);
  const [reservationsData, setReservationsData] = useState(() => loadFromStorage()?.reservationsData ?? []);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    saveToStorage({
      usageHistoryData,
      writtenReviews,
      unwrittenHistories,
      reservationsData,
    });
  }, [usageHistoryData, writtenReviews, unwrittenHistories, reservationsData]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUsageHistoryData([]);
      setWrittenReviews([]);
      setUnwrittenHistories([]);
      setReservationsData([]);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [isAuthenticated]);

  const value = {
    usageHistoryData,
    setUsageHistoryData,
    writtenReviews,
    setWrittenReviews,
    unwrittenHistories,
    setUnwrittenHistories,
    reservationsData,
    setReservationsData,
  };

  return (
    <MyPageDataContext.Provider value={value}>
      {children}
    </MyPageDataContext.Provider>
  );
}

export function useMyPageData() {
  const ctx = useContext(MyPageDataContext);
  if (!ctx) {
    return {
      usageHistoryData: [],
      setUsageHistoryData: () => {},
      writtenReviews: [],
      setWrittenReviews: () => {},
      unwrittenHistories: [],
      setUnwrittenHistories: () => {},
      reservationsData: [],
      setReservationsData: () => {},
    };
  }
  return ctx;
}
