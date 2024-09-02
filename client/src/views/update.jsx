import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


export function Update(){
    const [file ,setFile] = useState();
    const [name, setName] = useState('');
    const [info, setInfo] = useState([{ amigo: "", demonio: false }]);
    const navigate = useNavigate();
    const {id} = useParams();

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

    const handleUpdate = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        const infosArray = info.map((infos) => ({
            amigo: infos.amigo,
            demonio: infos.demonio,
        }));
        formData.append('name_character', name)
        formData.append('image', file)
        formData.append('info', JSON.stringify(infosArray));
        await axios.put(`${import.meta.env.VITE_API_SERVER}/update/${id}`, formData,{
            headers: {
                "Content-type": "multipart/form-data",
            }
        }
        )
        navigate('/')
    }

    useEffect(() => {
        getImageByid()
    }, [])


    const getImageByid = async() => {
        const res = await axios.get(`${import.meta.env.VITE_API_SERVER}/upload/${id}`)
        const responseData = res.data[0]; // Accede al primer elemento del array
        setFile(responseData.filename);
        setName(responseData.name_character);
        setInfo(responseData.info.map((info) => ({
            amigo: info.amigo,
            demonio: info.demonio,
          }))
        );
        console.log(responseData.name_character)
        console.log(responseData.filename)
        
    }
    console.log(name)


    const addInfo = () => {
        setInfo([...info, { amigo: "", demonio: false }]);
    };
    
    const removeOption = (index) => {
        const newInfo = info.filter((_, i) => i !== index);
        setInfo(newInfo);
    };


    return(
        <div>
            <input value={name} type='text' onChange={handleName}/>
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
            <button onClick={handleUpdate}>Upload</button>
        </div>
    )
}