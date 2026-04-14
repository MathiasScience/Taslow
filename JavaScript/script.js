const input = document.getElementById('miInput');
const btnEnviar = document.getElementById('btnEnviar');
const listaPendientes = document.getElementById('miLista');
const listaHecha = document.getElementById('listaHecha');

// Cargar tareas al iniciar sesión
async function cargarTareas() {
    const res = await fetch('/tasks');
    const tareas = await res.json();
    tareas.forEach(t => renderizarTarea(t.content, t.status));
}

function renderizarTarea(texto, status) {
    const li = document.createElement('li');
    li.className = "tarea-item";
    li.innerHTML = `<span>${texto}</span>`;

    const btn = document.createElement('button');
    btn.textContent = "✓";
    
    li.appendChild(btn);
    if (status === 0) listaPendientes.appendChild(li);
    else listaHecha.appendChild(li);

    btn.onclick = () => {
        if (li.parentNode === listaPendientes) {
            listaHecha.appendChild(li);
        } else {
            li.remove(); // Eliminar definitivamente
        }
    };
}

btnEnviar.onclick = async () => {
    const val = input.value.trim();
    if (val) {
        await fetch('/tasks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ content: val })
        });
        renderizarTarea(val, 0);
        input.value = "";
    }
};

document.getElementById('btnModo').onclick = () => document.body.classList.toggle('light-mode');

if (window.location.pathname === '/') cargarTareas();
