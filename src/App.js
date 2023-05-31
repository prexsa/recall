import { useState, useEffect, useCallback, useRef } from 'react';
import Timer from './Timer';
import Countdown from './Countdown';
import './App.css';

function App() {
  const timerCompRef = useRef(null);
  const countdownCompRef = useRef(null);
  const [nums, setNums] = useState([]);
  const [first, setFirst] = useState({ isFlipped: false, index: null, value: null });
  const [second, setSecond] = useState({ isFlipped: false, index: null, value: null });
  const [matched, setMatches] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const handleStartGame = () => {
    setShowAll(false)
    setIsActive(true)
  }

  const handleOnClick = (index, value) => {
    // console.log('handleOnClick: ', index)
    // start the timer when the user clicks on any card
    if(!isActive) {
      setShowAll(true);
      return;
    }
    // block user from spam clicking
    if(second.isFlipped) return;
    if(first.isFlipped === false) {
      setFirst({ isFlipped: true, index, value })
    } else {
      setSecond({ isFlipped: true, index, value });
      setMoves(moves => moves + 1)
    }
  }

  const shuffle = (array) => array.sort((a, b) => 0.5 - Math.random());
  // Access Timer (child) component func
  const handleStart = () => setShowAll(true);
  // const handleStart = () => timerCompRef.current.handleToggle()
  const handleReset = () => {
    if(showAll) {
      countdownCompRef.current.handleTimerReset();
      return;
    } else {
      setMoves(0);
      setMatches([]);
      setFirst({ isFlipped: false, index: null, value: null });
      setSecond({ isFlipped: false, index: null, value: null });
      timerCompRef.current.handleReset()
    }
  }

  // increase by multiple of 2
  const buildArray = useCallback(() => {
    const keys = 12;
    const mergeDupKeys = [...Array(keys).keys(), ...Array(keys).keys()]
    const shuffled = shuffle(mergeDupKeys);
    setNums(shuffled)
  }, []);

  useEffect(() => {
    // Initial setup of board starts here
    buildArray();
  }, [buildArray]);

  const addToMatched = useCallback((first, second) => {
    setTimeout(() => {
      setMatches((m) => [...m, first, second])
    }, 1000)
  }, [])

  useEffect(() => {
    // console.log({ first, second, matched })
    if(!first.isFlipped || !second.isFlipped) return;
    if(first.value === second.value) {
      addToMatched(first.index, second.index)
    }

    const timer = setTimeout(() => {
      setFirst({ isFlipped: false, index: null, value: null });
      setSecond({ isFlipped: false, index: null, value: null });
    }, 1000)

    return () => clearTimeout(timer)
    
  }, [first, second, addToMatched])

  const resetBoard = useCallback(() => {
    setTimeout(() => {
      setIsComplete(false);
      setMatches([]);
      setMoves(0);
      handleReset();
      buildArray();
    }, 2000)
  }, [])

  useEffect(() => {
    if((nums.length !== 0 || matched.length !== 0) && nums.length === matched.length) {
      setIsComplete(true);
      resetBoard()
    }
  }, [nums, matched, resetBoard])
// ` ${isActive ? '' : 'lock-pointer-events'}` + 
  return (
    <div className="app">
      <header>
        <h1>Memory Recall Game</h1>
        <h3>Match each pair of cards</h3>
      </header>
      <section className="game-actions">
        <button className="btn btn-start" onClick={handleStart}>Start</button>
        <button className="btn btn-reset" onClick={handleReset}>Reset</button>
      </section>
      <div className={`feedback ${isComplete ? 'show': 'hide'}`}>Congratulations</div>
      {
        showAll ? 
        <section className="countdownBx">
          <Countdown ref={countdownCompRef} isActive={showAll} startGame={handleStartGame} />
        </section>
        :
        <section className="game-stats">
          <div className="statsBx">
            <h2 className="heading">Time</h2>
            <div className="stats">
              <Timer ref={timerCompRef} isActive={isActive} setIsActive={setIsActive} />
            </div>
          </div>
          <div className="statsBx">
            <h2 className="heading">Moves</h2>
            <div className="stats">{moves}</div>
          </div>
        </section>
      }
      <main className='main'>
        <div className='cardBx'>
        {
          nums.map((num, idx) => {
            return (
              <div key={idx} className='flip-card'>
                <div 
                  className={
                    `flip-card-inner` +
                    ` ${showAll ? 'rotate' : ''}` +
                    ` ${(first.index === idx) ? 'rotate' : ''}` + 
                    ` ${(second.index === idx) ? 'rotate' : ''}`
                  } 
                  onClick={() => handleOnClick(idx, num + 1)}
                >
                {
                  matched.indexOf(idx) !== -1 ?
                  <div className='white-out'></div>
                  :
                  <>
                    <div className='flip-card-front'>
                      <span className="center-text">?</span>
                    </div>
                    <div className='flip-card-back'>
                      <span className="center-text">{num + 1}</span>
                    </div>
                  </>
                }
                </div>
              </div>
            )
          })
        }
        </div>
      </main>
      {/*<footer className="footer">This is where the FOOT clan hangs out!</footer>*/}
    </div>
  );
}


export default App;
