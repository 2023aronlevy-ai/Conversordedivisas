// ========================================
// SISTEMA DE PEGATINAS
// ========================================


// VARIABLES

let iconoSeleccionado = "☆";

let pegatinas =
    JSON.parse(localStorage.getItem("pegatinas")) || [];

let notas =
    JSON.parse(localStorage.getItem("notas")) || [];

let historial =
    JSON.parse(localStorage.getItem("historial")) || [];


// TASAS DE EJEMPLO

const tasas = {

    USD: 1,

    EUR: 0.9235,

    ARS: 1200,

    GBP: 0.79

};


// ========================================
// FUNCIONES GENERALES
// ========================================

function mostrarMensaje(texto) {

    const mensaje =
        document.getElementById("mensaje");

    mensaje.textContent = texto;

    mensaje.classList.add("mostrar");

    setTimeout(() => {

        mensaje.classList.remove("mostrar");

    }, 2200);
}


function guardarDatos() {

    localStorage.setItem(
        "pegatinas",
        JSON.stringify(pegatinas)
    );

    localStorage.setItem(
        "notas",
        JSON.stringify(notas)
    );

    localStorage.setItem(
        "historial",
        JSON.stringify(historial)
    );
}


function convertir(valor, desde, hasta) {

    return valor * (tasas[hasta] / tasas[desde]);

}


function formato(numero) {

    return Number(numero).toLocaleString(
        "es-AR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ========================================
// SELECCIÓN DE ICONOS
// ========================================

const iconos =
    document.querySelectorAll(".icono");


iconos.forEach(icono => {

    icono.addEventListener("click", () => {

        iconos.forEach(i => {

            i.classList.remove("seleccionado");

        });

        icono.classList.add("seleccionado");

        iconoSeleccionado =
            icono.textContent;

        actualizarResultadoPegatina();

    });

});


// ========================================
// PEGATINAS
// ========================================

function actualizarResultadoPegatina() {

    const valor =
        Number(
            document.getElementById(
                "valorPegatina"
            ).value
        ) || 0;


    const moneda =
        document.getElementById(
            "monedaPegatina"
        ).value;


    const resultado =
        convertir(valor, moneda, "USD");


    document.getElementById(
        "resultadoPegatina"
    ).textContent =
        `${formato(resultado)} USD`;

}


document.getElementById(
    "valorPegatina"
).addEventListener(
    "input",
    actualizarResultadoPegatina
);


document.getElementById(
    "monedaPegatina"
).addEventListener(
    "change",
    actualizarResultadoPegatina
);


// GUARDAR PEGATINA

document.getElementById(
    "guardarPegatina"
).addEventListener(
    "click",
    () => {

        const nombre =
            document.getElementById(
                "nombrePegatina"
            ).value.trim();


        if (nombre === "") {

            mostrarMensaje(
                "Escribí un nombre para la pegatina"
            );

            return;
        }


        const valor =
            Number(
                document.getElementById(
                    "valorPegatina"
                ).value
            ) || 0;


        const moneda =
            document.getElementById(
                "monedaPegatina"
            ).value;


        const estimado =
            convertir(valor, moneda, "USD");


        const pegatina = {

            id: Date.now(),

            nombre: nombre,

            icono: iconoSeleccionado,

            valor: valor,

            moneda: moneda,

            estimado: estimado

        };


        pegatinas.push(pegatina);


        historial.unshift({

            texto:
                `Pegatina guardada: ${nombre}`,

            fecha:
                new Date().toLocaleString("es-AR")

        });


        guardarDatos();

        mostrarTablero();

        mostrarHistorial();


        document.getElementById(
            "nombrePegatina"
        ).value = "";


        mostrarMensaje(
            "Pegatina guardada correctamente"
        );

    }
);


// ========================================
// CONVERSOR
// ========================================

function actualizarConversion() {

    const desde =
        document.getElementById(
            "monedaDesde"
        ).value;


    const hasta =
        document.getElementById(
            "monedaHasta"
        ).value;


    const cantidad =
        Number(
            document.getElementById(
                "cantidad"
            ).value
        ) || 0;


    const resultado =
        convertir(
            cantidad,
            desde,
            hasta
        );


    document.getElementById(
        "resultadoConversion"
    ).value =
        formato(resultado);


    document.getElementById(
        "simboloDesde"
    ).textContent = desde;


    document.getElementById(
        "simboloHasta"
    ).textContent = hasta;


    const tasa =
        convertir(
            1,
            desde,
            hasta
        );


    document.getElementById(
        "textoCotizacion"
    ).textContent =
        `1 ${desde} = ${formato(tasa)} ${hasta}`;

}


document.getElementById(
    "convertir"
).addEventListener(
    "click",
    () => {

        actualizarConversion();


        const desde =
            document.getElementById(
                "monedaDesde"
            ).value;


        const hasta =
            document.getElementById(
                "monedaHasta"
            ).value;


        const cantidad =
            document.getElementById(
                "cantidad"
            ).value;


        const resultado =
            convertir(
                cantidad,
                desde,
                hasta
            );


        historial.unshift({

            texto:
                `${cantidad} ${desde} → ${formato(resultado)} ${hasta}`,

            fecha:
                new Date().toLocaleString("es-AR")

        });


        guardarDatos();

        mostrarHistorial();

        mostrarMensaje(
            "Conversión realizada"
        );

    }
);


document.getElementById(
    "cantidad"
).addEventListener(
    "input",
    actualizarConversion
);


document.getElementById(
    "monedaDesde"
).addEventListener(
    "change",
    actualizarConversion
);


document.getElementById(
    "monedaHasta"
).addEventListener(
    "change",
    actualizarConversion
);


// INTERCAMBIAR MONEDAS

document.getElementById(
    "intercambiar"
).addEventListener(
    "click",
    () => {

        const desde =
            document.getElementById(
                "monedaDesde"
            );


        const hasta =
            document.getElementById(
                "monedaHasta"
            );


        const temporal =
            desde.value;


        desde.value =
            hasta.value;


        hasta.value =
            temporal;


        actualizarConversion();

    }
);


// ========================================
// DIVISAS FAVORITAS
// ========================================

document.querySelectorAll(
    ".lista-favoritos button"
).forEach(boton => {

    boton.addEventListener(
        "click",
        () => {

            document.getElementById(
                "monedaHasta"
            ).value =
                boton.dataset.moneda;


            actualizarConversion();

        }
    );

});


// ========================================
// PIZARRÓN DE NOTAS
// ========================================

function mostrarTablero() {

    const tablero =
        document.getElementById(
            "tablero"
        );


    tablero.innerHTML = "";


    // PEGATINAS

    pegatinas.forEach(
        pegatina => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "nota";


            elemento.draggable = true;


            elemento.dataset.id =
                pegatina.id;


            elemento.innerHTML = `

                <button class="eliminar-nota">
                    ×
                </button>

                <div style="font-size:30px">
                    ${pegatina.icono}
                </div>

                <strong>
                    ${pegatina.nombre}
                </strong>

                <small>
                    ${formato(pegatina.valor)}
                    ${pegatina.moneda}
                    ·
                    ${formato(pegatina.estimado)}
                    USD
                </small>

            `;


            elemento
                .querySelector(
                    ".eliminar-nota"
                )
                .addEventListener(
                    "click",
                    () => {

                        pegatinas =
                            pegatinas.filter(
                                p =>
                                    p.id !==
                                    pegatina.id
                            );


                        guardarDatos();

                        mostrarTablero();

                    }
                );


            elemento.addEventListener(
                "dragstart",
                evento => {

                    evento.dataTransfer.setData(
                        "tipo",
                        "pegatina"
                    );

                    evento.dataTransfer.setData(
                        "id",
                        pegatina.id
                    );

                }
            );


            tablero.appendChild(
                elemento
            );

        }
    );


    // NOTAS

    notas.forEach(
        nota => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "nota";


            elemento.draggable = true;


            elemento.innerHTML = `

                <button class="eliminar-nota">
                    ×
                </button>

                <small>
                    NOTA RÁPIDA
                </small>

                <p>
                    ${nota.texto}
                </p>

            `;


            elemento
                .querySelector(
                    ".eliminar-nota"
                )
                .addEventListener(
                    "click",
                    () => {

                        notas =
                            notas.filter(
                                n =>
                                    n.id !==
                                    nota.id
                            );


                        guardarDatos();

                        mostrarTablero();

                    }
                );


            elemento.addEventListener(
                "dragstart",
                evento => {

                    evento.dataTransfer.setData(
                        "tipo",
                        "nota"
                    );

                    evento.dataTransfer.setData(
                        "id",
                        nota.id
                    );

                }
            );


            tablero.appendChild(
                elemento
            );

        }
    );

}


// ========================================
// AGREGAR NOTA
// ========================================

function agregarNota() {

    const input =
        document.getElementById(
            "notaTexto"
        );


    const texto =
        input.value.trim();


    if (texto === "") {

        mostrarMensaje(
            "Escribí una nota"
        );

        return;
    }


    notas.push({

        id: Date.now(),

        texto: texto

    });


    guardarDatos();

    mostrarTablero();


    input.value = "";


    mostrarMensaje(
        "Nota agregada"
    );

}


document.getElementById(
    "agregarNota"
).addEventListener(
    "click",
    agregarNota
);


document.getElementById(
    "notaTexto"
).addEventListener(
    "keydown",
    evento => {

        if (evento.key === "Enter") {

            agregarNota();

        }

    }
);


// ========================================
// ELIMINAR ARRASTRANDO
// ========================================

const zonaEliminar =
    document.getElementById(
        "zonaEliminar"
    );


zonaEliminar.addEventListener(
    "dragover",
    evento => {

        evento.preventDefault();

        zonaEliminar.classList.add(
            "drag"
        );

    }
);


zonaEliminar.addEventListener(
    "dragleave",
    () => {

        zonaEliminar.classList.remove(
            "drag"
        );

    }
);


zonaEliminar.addEventListener(
    "drop",
    evento => {

        evento.preventDefault();

        zonaEliminar.classList.remove(
            "drag"
        );


        const tipo =
            evento.dataTransfer.getData(
                "tipo"
            );


        const id =
            Number(
                evento.dataTransfer.getData(
                    "id"
                )
            );


        if (tipo === "pegatina") {

            pegatinas =
                pegatinas.filter(
                    p => p.id !== id
                );

        }


        if (tipo === "nota") {

            notas =
                notas.filter(
                    n => n.id !== id
                );

        }


        guardarDatos();

        mostrarTablero();

        mostrarMensaje(
            "Elemento eliminado"
        );

    }
);


// ========================================
// HISTORIAL
// ========================================

function mostrarHistorial() {

    const lista =
        document.getElementById(
            "listaHistorial"
        );


    lista.innerHTML = "";


    if (historial.length === 0) {

        lista.innerHTML =
            "<p>No hay movimientos todavía.</p>";

        return;

    }


    historial.forEach(
        elemento => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "historial-item";


            div.innerHTML = `

                <strong>
                    ${elemento.texto}
                </strong>

                <br>

                <small>
                    ${elemento.fecha}
                </small>

            `;


            lista.appendChild(div);

        }
    );

}


// ========================================
// MENÚ LATERAL
// ========================================

document.querySelectorAll(
    ".nav-button[data-section]"
).forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                document.querySelectorAll(
                    ".nav-button"
                ).forEach(
                    b =>
                        b.classList.remove(
                            "active"
                        )
                );


                boton.classList.add(
                    "active"
                );


                const seccion =
                    boton.dataset.section;


                if (
                    seccion === "pegatinas" ||
                    seccion === "conversor" ||
                    seccion === "notas"
                ) {

                    document.getElementById(
                        seccion
                    ).scrollIntoView({
                        behavior: "smooth"
                    });

                }


                if (
                    seccion === "historial" ||
                    seccion === "ajustes"
                ) {

                    document.querySelectorAll(
                        ".oculto"
                    ).forEach(
                        elemento =>
                            elemento.style.display =
                                "none"
                    );


                    document.getElementById(
                        seccion
                    ).style.display =
                        "block";


                    document.getElementById(
                        seccion
                    ).scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }
);


// ========================================
// TEMA OSCURO / CLARO
// ========================================

document.getElementById(
    "tema"
).addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "claro"
        );

    }
);


document.getElementById(
    "temaCheckbox"
).addEventListener(
    "change",
    evento => {

        document.body.classList.toggle(
            "claro",
            !evento.target.checked
        );

    }
);


// ========================================
// CERRAR SESIÓN
// ========================================

document.getElementById(
    "cerrarSesion"
).addEventListener(
    "click",
    () => {

        mostrarMensaje(
            "Sesión cerrada"
        );

    }
);


// ========================================
// BORRAR DATOS
// ========================================

document.getElementById(
    "borrarTodo"
).addEventListener(
    "click",
    () => {

        const confirmar =
            confirm(
                "¿Seguro que querés borrar todos los datos?"
            );


        if (!confirmar) return;


        pegatinas = [];

        notas = [];

        historial = [];


        guardarDatos();

        mostrarTablero();

        mostrarHistorial();


        mostrarMensaje(
            "Todos los datos fueron borrados"
        );

    }
);


// ========================================
// INICIAR APLICACIÓN
// ========================================

actualizarResultadoPegatina();

actualizarConversion();

mostrarTablero();

mostrarHistorial();
