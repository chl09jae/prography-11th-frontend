export const DateUtils = {
    /**
     * Date 객체를 "YYYY-MM-DD" 문자열로 변환
     */
    formatDate: (date: Date): string => {
        return date.toISOString().split('T')[0];
    },

    /**
     * 현재 날짜 반환
     */
    getToday: (): string => {
        return DateUtils.formatDate(new Date());
    },

    /**
     * 현재 날짜로부터 특정 일수(days) 전의 날짜 반환
     * (예: 365일 전, 30일 전)
     */
    getDaysAgo: (days: number): string => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return DateUtils.formatDate(date);
    },

    /**
     * 현재 날짜로부터 1년 전 날짜 반환
     */
    getOneYearAgo: (): string => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        return DateUtils.formatDate(date);
    }
};