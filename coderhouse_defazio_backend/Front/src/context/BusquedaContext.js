import React, {createContext, useState} from "react";

export const BusquedaContext  = createContext();

const BusquedaProvider = ( {children} ) => {
    const [busqueda, setBusqueda] = useState('');
    
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        tel: '',
        domicilio: '',
        localidad: '',
        provincia: '',
        dni: '',
        pass: ''
    })
    return (
        <>
            <BusquedaContext.Provider value={{
                busqueda,
                setBusqueda,
                usuario,
                setUsuario
            }}>
                {children};
            </BusquedaContext.Provider>
        </>
    );
}
export default BusquedaProvider;