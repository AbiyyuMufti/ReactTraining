import { useTimer } from "../Hooks/useTimer";

function Home() {
    const { timer } = useTimer();
    return <div>{timer.toLocaleString()}</div>;
}

export default Home;
