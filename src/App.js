import { useState } from 'react';
import './App.css';

function App() {
  const [active, setActive] = useState(null);
  const nums = [...Array(15).keys()];

  const handleOnClick = (index) => {
    // console.log('handleOnClick: ', index)
    setActive(index);
  }

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
              <div key={num + 1} className='flip-card'>
                <div 
                  className={`flip-card-inner ${active === idx ? 'rotate' : ''}`} 
                  onClick={() => handleOnClick(idx)}
                >
                  <div className='flip-card-front'>
                    <span className="center-text">?</span>
                  </div>
                  <div className='flip-card-back'>
                    <span className="center-text">{num + 1}</span>
                  </div>
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
