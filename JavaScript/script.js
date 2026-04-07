const input = document.getElementById('miInput');
const boton = document.getElementById('btnEnviar');
const lista = document.getElementById('miLista');
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
        
        // 3. Programar qué pasa al hacer clic en "Eliminar"
        btnEliminar.onclick = function() {
            li.remove(); // Borra el elemento li completo
        };

        // 4. Meter el botón dentro del li, y el li dentro de la lista
        li.appendChild(btnEliminar);
        lista.appendChild(li);

        input.value = "";
    }
});

btnModo.addEventListener('click', () => {
	document.body.classList.toggle('light-mode');
});