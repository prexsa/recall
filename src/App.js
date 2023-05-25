import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [nums, setNums] = useState([]);
  const [first, setFirst] = useState({ isFlipped: false, index: null, value: null });
  const [second, setSecond] = useState({ isFlipped: false, index: null, value: null });
  const [matched, setMatches] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  let [level, setLevel] = useState(1);

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
  const handleShuffle = () => shuffle();

  // increase by multiple of 2
  const buildArray = useCallback((val) => {
    const mergeDupKeys = [...Array(val).keys(), ...Array(val).keys()]
    const shuffled = shuffle(mergeDupKeys);
    setNums(shuffled)
  }, [])

  useEffect(() => {
    // Initial setup of board starts here
    // Each row contains 4 cards
    if(level > 4) return;
    const keys = 2 + (level * 2) ;
    buildArray(keys);
  }, [buildArray, level])

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

  const levelUp = () => {
    console.log('levelUp')
    setLevel(level + 1)
  }

  const handleLevelUp = () => {
    setLevel(level + 1)
  }

  const clearFeedback = useCallback(() => {
    setTimeout(() => {
      setIsComplete(false);
      setMatches([])
      levelUp();
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
        <p>Match each pair of cards</p>
      </header>
      {/*<button onClick={handleShuffle}>shuffle</button>
      <button onClick={handleLevelUp}>Level Up</button>*/}
      <div className={`feedback ${isComplete ? 'show': 'hide'}`}>Congratulations</div>
      <main className='main'>
        <div className="left-side">
          <h2>Current Level: <span>{level}</span></h2>
          <div>
            <h4>Highest Score</h4>
            <p>Username <span>Level 15</span></p>
          </div>
        </div>
        <div className='card-wrapper right-side'>
        {
          nums.map((num, idx) => {
            return (
              <div key={idx} className='flip-card'>
                <div 
                  className={
                    `flip-card-inner` +  
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
