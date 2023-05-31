import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CountDown = forwardRef(({...props}, ref) => {
  const { isActive, startGame } = props;
  const [seconds, setSeconds] = useState(10);
  const [go, setGo] = useState(true)

  useImperativeHandle(ref, () => ({
    handleTimerReset
  }))

  // const handleToggle = () => setIsActive(true);
  const handleReset = () => {
    setSeconds(10);
    startGame();
  }

  const handleTimerReset = () => {
    setSeconds(10);
  }

  const secondsToMinutes = time => {
    const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
    const seconds = `${time - minutes * 60}`.padStart(2, "0")
    return `${minutes}:${seconds}`;
  }

  useEffect(() => {
    let interval = null;
    if(isActive) {
      interval = setInterval(() => {
        // console.log('seconds: ', seconds)
        setSeconds(seconds => seconds - 1);
        if(seconds === 1) {
          clearInterval(interval);
          handleReset();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [seconds, isActive])

  return (
    <>{secondsToMinutes(seconds)} seconds</>
  )
})

export default CountDown;