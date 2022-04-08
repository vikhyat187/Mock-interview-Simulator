import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css';
import {Toaster} from 'react-hot-toast'
import EditorPage from './pages/EditorPage';
import Home from './pages/Home';

function App() {
  return (
    <>
    <div>
      <Toaster position = "top-right"></Toaster>
    </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
        </Routes>
        <Routes>
          <Route path="/editor/:roomId" element={<EditorPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>

    );
}

export default App;
