import React from "react";
import ReactGA from "react-ga";

export default function QuienesSomos(props) {
  ReactGA.pageview(window.location.pathname + window.location.search);
  return (
    <div className="quienes-somos">
      <div className="container pl-0 pr-0">
        <div className="hero">
          <h2 className="title">
            <div>¡CONTRA LA ESPECULACIÓN,</div>
            <div>ORGANIZACIÓN!</div>
          </h2>
        </div>
      </div>
      <div className="container">
        <h2 className="title">¿Que es el Nodo Temperley?</h2>
        <div className="text">
          <p>
            Es un nodo de consumo solidario, surgido a partir de la iniciativa
            de una organización territorial como <b>La Chapanay</b>, que tiene
            entre sus objetivos la lucha por la soberanía alimentaria, precios
            justos, defensa de la producción agroecológica y promoción de
            productorxs locales. Trabajamos en conjunto con{" "}
            <b>Mercado Territorial- línea Agricultura Familiar</b>. Somos un
            grupo de consumidorxs organizadxs lo que nos permite generar y
            reforzar lazos sociales solidarios, promoviendo así relaciones de
            comunidad. Buscamos promover y construir canales alternativos, no
            especulativos y democráticos de comercialización para los grupos de
            productorxs de la agricultura familiar en el esfuerzo por generar
            otras relaciones de producción, comercialización y consumo.
          </p>
        </div>
        <h2 className="title">¿Por qué nos organizamos en nodos?</h2>
        <div className="text">
          <p>
            La propuesta de organizar el consumo a través de nodos se debe
            principalmente a tres razones: la primera es que la organización de
            los consumidores permite generar y reforzar lazos sociales
            promoviendo así relaciones de comunidad al tiempo que circula
            información en relación al bolsón (recetas, actividades, etc.); en
            segundo lugar, facilita el acceso a verduras de calidad, para todxs
            lxs participantes al abaratar los costos de transporte y la tercera
            generar mercados para los pequeños productores locales, rurales y
            urbanos.
          </p>
        </div>
      </div>
    </div>
  );
}
