import {Routes, Route} from 'react-router-dom';
import { Home } from '../views/home';
import {BrowserRouter} from 'react-router-dom';
import { Update } from '../views/update';
import { Upload } from '../views/upload';

export function Router(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/upload' element={<Upload/>}/>
            <Route path='/upload/update/:id' element={<Update/>}/>
        </Routes>
        </BrowserRouter>
    );
}