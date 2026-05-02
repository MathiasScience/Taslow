document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('miInput');
    const btnEnviar = document.getElementById('btnEnviar');
    const listaPendientes = document.getElementById('miLista');
    const listaHecha = document.getElementById('listaHecha');

    function crearTarea(texto, esHecha = false) {
        const li = document.createElement('li');
        li.className = "tarea-item";
        li.innerHTML = `<span>${texto}</span>`;

        const divBtns = document.createElement('div');
        const btnCheck = document.createElement('button');
        btnCheck.textContent = esHecha ? "↺" : "✓";
        btnCheck.className = "btn-status";

        const btnDelete = document.createElement('button');
        btnDelete.textContent = "🗑️";
        btnDelete.className = "btn-delete";

        divBtns.append(btnCheck, btnDelete);
        li.appendChild(divBtns);

        if (esHecha) {
            listaHecha.appendChild(li);
        } else {
            listaPendientes.appendChild(li);
        }

        btnCheck.onclick = () => {
            if (li.parentNode === listaPendientes) {
                listaHecha.appendChild(li);
                btnCheck.textContent = "↺";
            } else {
                listaPendientes.appendChild(li);
                btnCheck.textContent = "✓";
            }
        };

        btnDelete.onclick = () => {
            li.remove();
        };
    }

    btnEnviar.onclick = () => {
        const valor = input.value.trim();
        if (valor) {
            crearTarea(valor);
            input.value = "";
        }
    };
});
//aqui puede estar el error? nose 
