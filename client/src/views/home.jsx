import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export function Home() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

  const getData = async () => {
    const response = await axios.get(import.meta.env.VITE_API_SERVER);
    setData(response.data);
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div>
      {data.map((datas, index)=>(
        <div key={index}>
          <p style={{backgroundColor: 'black', color: 'white'}}>{datas.text_answer}</p>
          <p style={{backgroundColor: 'white', color: 'black'}}>{datas.text_answer}</p>
        </div>
      ))}

      <button onClick={() => navigate('upload')}>Upload</button>
    </div>
  )
}