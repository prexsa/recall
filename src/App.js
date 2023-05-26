import { useState, useEffect, useCallback, useRef } from 'react';
import Timer from './Timer';
import './App.css';

function App() {
  const timerCompRef = useRef(null);
  const [nums, setNums] = useState([]);
  const [first, setFirst] = useState({ isFlipped: false, index: null, value: null });
  const [second, setSecond] = useState({ isFlipped: false, index: null, value: null });
  const [matched, setMatches] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleOnClick = (index, value) => {
    // console.log('handleOnClick: ', index)
    // block user from spam clicking
    if(second.isFlipped) return;
    if(first.isFlipped === false) {
      setFirst({ isFlipped: true, index, value })
    } else {
      setSecond({ isFlipped: true, index, value });
    }
  }

  const shuffle = (array) => array.sort((a, b) => 0.5 - Math.random());
  // Access Timer (child) component func
  const handleStart = () => timerCompRef.current.handleToggle()
  const handleReset = () => timerCompRef.current.handleReset()

  // increase by multiple of 2
  const buildArray = useCallback((val) => {
    const mergeDupKeys = [...Array(val).keys(), ...Array(val).keys()]
    const shuffled = shuffle(mergeDupKeys);
    setNums(shuffled)
  }, []);

  useEffect(() => {
    // Initial setup of board starts here
    const keys = 10
    buildArray(keys);
  }, [buildArray])

  const addToMatched = useCallback((first, second) => {
    setTimeout(() => {
      setMatches((m) => [...m, first, second])
    }, 2000)
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
    }, 2000)

    return () => clearTimeout(timer)
    
  }, [first, second, addToMatched])

  const clearFeedback = useCallback(() => {
    setTimeout(() => {
      setIsComplete(false);
      setMatches([])
    }, 2000)
  }, [])

  useEffect(() => {
    if((nums.length !== 0 || matched.length !== 0) && nums.length === matched.length) {
      setIsComplete(true);
      clearFeedback()
    }
  }, [nums, matched, clearFeedback])

  return (
    <div className="app">
      <header>
        <h1>Memory Recall Game</h1>
        <h3>Match each pair of cards</h3>
      </header>
      <button className="btn btn-start" onClick={handleStart}>Start</button>
      <button className="btn btn-reset" onClick={handleReset}>Reset</button>
      <div className={`feedback ${isComplete ? 'show': 'hide'}`}>Congratulations</div>
      <div className="game-stats-wrapper">
        <h2>Time: 
          <div className="game-stats">
            <Timer ref={timerCompRef} isActive={isActive} setIsActive={setIsActive} />
          </div>
        </h2>
        <h2>Moves: <div className="game-stats">0</div></h2>
      </div>
      <main className='main'>
        <div className='card-wrapper'>
        {
          nums.map((num, idx) => {
            return (
              <div key={idx} className='flip-card'>
                <div 
                  className={
                    `flip-card-inner` +
                    ` ${isActive ? '' : 'lock-pointer-events'}` + 
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
      <footer className="footer">This is where the FOOT clan hangs out!</footer>
    </div>
  );
}

export default App;
