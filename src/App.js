import React, { Fragment, useEffect, useState } from "react";
import Header from "./components/Header";
import Formulario from "./components/Formulario";
import Clima from "./components/Clima";
import Error from "./components/Error";

function App() {
  const [busqueda, guardarBusqueda] = useState({
    ciudad: "",
    pais: "",
  });

  //1- Para que se actualice el state cada vez que se presiona el boton y no por cada letra en el input
  const [consultar, guardarConsultar] = useState(false);

  const [resultado, guardarResultado] = useState({});

  const [error, guardarError] = useState(false);

  //Extraer de busqueda
  const { ciudad, pais } = busqueda;

  useEffect(() => {
    const consultarApi = async () => {
      //Si consultar esta como true hace el llamado
      if (consultar) {
        const appId = "37fb2f52f08354ee526e9758eaed2fc9";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        guardarResultado(resultado);
        guardarConsultar(false);

        //Detecta si los resultados de la consulta dueron correctos

        if (resultado.cod === "404") {
          guardarError(true);
        } else {
          guardarError(false);
        }
      }
    };

    consultarApi();
    //Para quitar errores de dependencias en consola que NO sean ESTRICTAMENTE NECESARIAS
    // eslint-disable-next-line
  }, [consultar]);

  //CARGA CONDICIONAL DE COMPONENTES
  let componente;
  if (error) {
    componente = <Error mensaje="No hay resultados" />;
  } else {
    componente = <Clima resultado={resultado}></Clima>;
  }

  return (
    <Fragment>
      <Header titulo="Clima React App"></Header>
      <div className="contenedor-form">
        <div className="container">
          <div className="row">
            <div className="col m6 s12">
              <Formulario
                busqueda={busqueda}
                guardarBusqueda={guardarBusqueda}
                guardarConsultar={guardarConsultar}
              ></Formulario>
            </div>
            <div className="col m6 s12">{componente}</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
