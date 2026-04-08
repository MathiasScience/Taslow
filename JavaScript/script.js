const input = document.getElementById('miInput');
const boton = document.getElementById('btnEnviar');
const lista = document.getElementById('miLista');
const listaHecha = document.getElementById('listaHecha');
const btnModo = document.getElementById('btnModo');

boton.addEventListener('click', function() {
    const texto = input.value;

    if (texto.trim() !== "") {
        // 1. Crear el contenedor de la lista (li)
        const li = document.createElement('li');
        li.textContent = texto + " "; // Espacio entre texto y botón

        // 2. Crear el botón de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = "Eliminar";

        // 3. Meter el botón dentro del li, y el li dentro de la lista
        li.appendChild(btnEliminar);
        lista.appendChild(li);

		// 4. Programar qué pasa al hacer clic en "Eliminar"
		btnEliminar.onclick = function() {
            if (li.parentNode === lista) {
                // Si está en la lista de pendientes, la movemos a la de hechas
                listaHecha.appendChild(li);
                btnEliminar.textContent = "Deshacer"; // Cambiamos el texto en lugar de borrar el botón
            } else {
                // Si ya estaba en hecha, la regresamos a pendientes
                lista.appendChild(li);
                btnEliminar.textContent = "Eliminar";
            }
        };

        input.value = "";
    }
});

btnModo.addEventListener('click', () => {
	document.body.classList.toggle('light-mode');
});