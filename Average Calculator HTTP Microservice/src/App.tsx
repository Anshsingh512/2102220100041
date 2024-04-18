import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface NumberResponse {
  numbers: number[];
}

interface AverageResponse extends NumberResponse {
  avg: number;
}

const calculateAverage = (numbers: number[]): number => {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
};

const App: React.FC = () => {
  const [windowSize, setWindowSize] = useState(10);
  const [windowCurrState, setWindowCurrState] = useState<number[]>([]);
  const [windowPrevState, setWindowPrevState] = useState<number[]>([]);
  const [avg, setAvg] = useState(0);

  const getNumbers = async (type: string): Promise<AverageResponse> => {
    const response = await axios.get<NumberResponse>(
      `http://20.244.56.144/test/${type}`
    );
    return {
      numbers: response.data.numbers,
      avg: calculateAverage(response.data.numbers),
    };
  };

  const updateNumbers = async (type: string) => {
    const { numbers, avg } = await getNumbers(type);

    if (numbers.length > windowSize) {
      setWindowCurrState(numbers.slice(numbers.length - windowSize));
      setWindowPrevState(numbers.slice(0, -windowSize));
    } else {
      setWindowCurrState(numbers);
      setWindowPrevState(windowCurrState.slice(0, -numbers.length));
    }

    setAvg(avg);
  };

  useEffect(() => {
    updateNumbers('even');
  }, [windowSize]);

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <button onClick={() => setWindowSize(windowSize + 1)}>
        Increase Window Size
      </button>
      <button onClick={() => setWindowSize(Math.max(windowSize - 1, 1))}>
        Decrease Window Size
      </button>
      <button onClick={() => updateNumbers('even')}>Fetch Even Numbers</button>
      <button onClick={() => updateNumbers('prime')}>Fetch Prime Numbers</button>
      <button onClick={() => updateNumbers('fibo')}>Fetch Fibonacci Numbers</button>
      <button onClick={() => updateNumbers('rand')}>Fetch Random Numbers</button>
      <h2>Window Previous State: {windowPrevState.join(', ')}</h2>
      <h2>Window Current State: {windowCurrState.join(', ')}</h2>
      <h2>Average: {avg.toFixed(2)}</h2>
    </div>
  );
};

export default App;