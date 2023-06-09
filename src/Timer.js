import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CountUpTimer = forwardRef(({...props}, ref) => {
  const { isActive, setIsActive } = props;
  const [seconds, setSeconds] = useState(0);

  useImperativeHandle(ref, () => ({
    handleToggle,
    handleReset,
    getSeconds
  }))

  const handleToggle = () => setIsActive(true);
  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
  }

  const getSeconds = () => seconds;

  const secondsToMinutes = time => {
    const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
    const seconds = `${time - minutes * 60}`.padStart(2, "0")
    return `${minutes}:${seconds}`;
  }

  useEffect(() => {
    let interval = null;
    if(isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval);
  }, [seconds, isActive])

  return (
    <>{secondsToMinutes(seconds)} seconds</>
  )
})

export default CountUpTimer;