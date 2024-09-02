import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export function Upload(){
    const [file, setFile] = useState();
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [info, setInfo] = useState([{ amigo: "", demonio: false }]);
    const navigate = useNavigate();

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handleInfoChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newInfo = [...info];
        newInfo[index][name] = type === "checkbox" ? checked : value;
        setInfo(newInfo);
    };

    const handleUpload = async() => {
        const formData = new FormData()

        const infosArray = info.map((infos) => ({
            amigo: infos.amigo,
            demonio: infos.demonio,
        }));

        formData.append('name_character', name)
        formData.append('image', file)
        formData.append('info', JSON.stringify(infosArray));

        await axios.post(`${import.meta.env.VITE_API_SERVER}/upload`, formData,{
            headers: {
                "Content-type": "multipart/form-data",
            }
        })
        .then(res => {
            if(res.data.Status === "Success"){
                console.log("Succeded");
            } else {
                console.log("Failed");
            }
        })
        .catch(err => console.log(err))
    }

    const showImages = async () => {
        await axios.get(`${import.meta.env.VITE_API_SERVER}/upload`)
        .then(res => {
            setData(res.data);
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        showImages()
    }, [])



    const addInfo = () => {
        setInfo([...info, { amigo: "", demonio: false }]);
    };
    
    const removeOption = (index) => {
        const newInfo = info.filter((_, i) => i !== index);
        setInfo(newInfo);
    };
    const deleteImage = async(id) => {
        await axios.delete(`${import.meta.env.VITE_API_SERVER}/delete/${id}`)
        showImages();
    }

    return (
        <div>
            <input type='text' onChange={handleName}/>
            <input type='file' onChange={handleFile}/>
            {info.map((infos, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="amigo"
                  value={infos.amigo}
                  onChange={(e) => handleInfoChange(index, e)}
                  placeholder={`Amigo ${index + 1}`}
                />
                <label>
                  Respuesta correcta:
                  <input
                    type="checkbox"
                    name="demonio"
                    checked={infos.demonio}
                    onChange={(e) => handleInfoChange(index, e)}
                  />
                  {index > 0 && (
                    <button onClick={() => removeOption(index)}>
                      Eliminar
                    </button>
                  )}
                </label>
              </div>
            ))}
            <button onClick={addInfo}>Agregar Opción</button>
            <button onClick={handleUpload}>Upload</button>
            {data.map((imagen, index) => 

            <div style={{display: 'flex'}}>
                <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${imagen.filename}`} key={index} length="100px" width="100px"/>
                <p>{imagen.name_character}</p>
                <p>{imagen.info.amigo}</p>
                {/* {imagen.info &&
              imagen.info.map((infos, index) => (
                <div key={index}>
                  <p>Nombre Opción: {infos.amigo}</p>
                  <p>Respuesta: {infos.demonio ? "Correcta" : "Incorrecta"}</p>
                </div>
              ))} */}
                <button onClick={() => navigate(`/upload/update/${imagen.id}`)}>Editar</button>
                <button onClick={()=>deleteImage(imagen.id)}>Eliminar</button>
            </div>
            )}
            
        </div>
    )
}