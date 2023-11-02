import { useEffect, useState } from "react";

export function useTimer() {
    const [timer, setTimer] = useState<Date>(new Date());

    useEffect(() => {
        // akan berjalan jika ada watch yg berubah
        const timerInterval = setInterval(() => {
            setTimer(new Date());
        }, 1000);

        // akan berjalan jika ada watch yg berubah dan saat komponen tidak dirender lagi
        return () => {
            clearInterval(timerInterval);
        };
    }, []); // watch
    return {
        timer,
    };
}
