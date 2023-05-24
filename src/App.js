import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [nums, setNums] = useState([...Array(6).keys(), ...Array(6).keys()]);
  const [first, setFirst] = useState({ isFlipped: false, index: null, value: null });
  const [second, setSecond] = useState({ isFlipped: false, index: null, value: null });
  const [matched, setMatches] = useState([]);

  const handleOnClick = (index, value) => {
    // console.log('handleOnClick: ', index)
    if(first.isFlipped === false) {
      setFirst({ isFlipped: true, index, value })
    } else {
      setSecond({ isFlipped: true, index, value });
    }
  }

  const addToMatched = useCallback((first, second) => {
    const timer = setTimeout(() => {
      setMatches((m) => [...m, first, second])
    }, 2000)
  }, [])

  useEffect(() => {
    console.log({ first, second, matched })
    if(!first.isFlipped || !second.isFlipped) return
    if(first.value !== null && second.value !== null && first.value === second.value) {
      addToMatched(first.index, second.index)
    }

    const timer = setTimeout(() => {
      setFirst({ isFlipped: false, index: null, value: null });
      setSecond({ isFlipped: false, index: null, value: null });
    }, 2000)

    return () => clearTimeout(timer)
    
  }, [first, second, addToMatched])
  
  return (
    <div className="app">
      <header>
        <h1>Memory Recall Game</h1>
        <p>Match each pair of cards</p>
      </header>
      <main className='main'>
        <div className="left-side">
          <h2>Current Level: <span>10</span></h2>
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
