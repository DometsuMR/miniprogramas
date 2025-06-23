import '../App.css'

import pushAll from './pushAll';
import deleteItem from './deleteItem';

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ComidasSemana() {
  const [comidas, setComidas] = useState([])
  const [dias, setDias] = useState([])
  const [selecciones, setSelecciones] = useState({})
  const [mostrarPopup, setMostrarPopup] = useState(false)
  const [nuevaComida, setNuevaComida] = useState({ nombre: '', tipo: '' })

  useEffect(() => {
    fetchDias()
    fetchComidas()
    fetchComidasPorDia()
  }, [])

  const fetchDias = async () => {
    const { data, error } = await supabase.from('dias').select('*').order('id')
    if (error) console.error('Error al obtener días:', error)
    else setDias(data)
  }

  const fetchComidas = async () => {
    const { data, error } = await supabase.from('comidas').select('*')
    if (error) console.error('Error al obtener comidas:', error)
    else setComidas(data)
  }

  const fetchComidasPorDia = async () => {
    const { data, error } = await supabase.from('comidas_por_dia').select('*')
    if (error) {
      console.error('Error al obtener asignaciones:', error)
      return
    }

    const nuevaSelecciones = {}
    data.forEach((item) => {
      nuevaSelecciones[`${item.dia_id}_${item.tipo}`] = item.comida_id
    })
    setSelecciones(nuevaSelecciones)
  }

  const handleChange = async (dia_id, tipo, comidaId) => {
    const key = `${dia_id}_${tipo}`
    setSelecciones((prev) => ({ ...prev, [key]: comidaId }))

    const { data: existente, error } = await supabase
      .from('comidas_por_dia')
      .select('*')
      .eq('dia_id', dia_id)
      .eq('tipo', tipo)
      .maybeSingle()

    if (error) {
      console.error('Error al buscar asignación existente:', error)
      return
    }

    if (existente) {
      await supabase
        .from('comidas_por_dia')
        .update({ comida_id: comidaId })
        .eq('id', existente.id)
    } else {
      await supabase
        .from('comidas_por_dia')
        .insert([{ dia_id, tipo, comida_id: comidaId }])
    }
  }

  const handleNuevaComida = async () => {
    const { nombre, tipo } = nuevaComida;

    // Validar que nombre y tipo no estén vacíos o solo espacios
    if (!nombre.trim() || !tipo.trim()) return;

    // Usar pushAll para insertar en la tabla 'comidas'
    await pushAll({ nombre, tipo }, 'comida');

    // Actualizar localmente o volver a cargar los datos
    setMostrarPopup(false);
    setNuevaComida({ nombre: '', tipo: '' });
    fetchComidas();
  }


  const handleEliminarComida = async (comidaId) => {
    await deleteItem(comidaId, 'comida');
    setComidas(comidas.filter(comidas => comidas.id !== comidaId));
  }
  //Comidas
  const comidas_del_dia = ['comida', 'cena']

  const obtenerDescripcion = (comidaId) => {
    const comida = comidas.find((c) => c.id === parseInt(comidaId))
    return comida?.tipo || ''
  }

  return (
    <div>
      <h1>Plan semanal de comidas</h1>

      <button onClick={() => setMostrarPopup(true)}>➕ Añadir nueva comida</button>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Día</th>
            <th>Comida</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {dias.map((dia) => (
            <tr key={dia.id}>
              <td style={{ textTransform: 'capitalize' }}>{dia.nombre}</td>
              {comidas_del_dia.map((tipo) => {
                const key = `${dia.id}_${tipo}`
                const seleccionadaId = selecciones[key]
                const descripcion = obtenerDescripcion(seleccionadaId)
                return (
                  <td key={tipo}>
                    <select
                      value={seleccionadaId || ''}
                      onChange={(e) => handleChange(dia.id, tipo, e.target.value)}
                    >
                      <option value="">-- Seleccionar --</option>
                      {comidas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                    {descripcion && (
                      <div style={{ fontSize: '0.8em', color: '#555', marginTop: '4px' }}>
                        <em>{descripcion}</em>
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lista de comidas con opción de eliminar */}
      <h2 style={{ marginTop: '2rem' }}>Comidas registradas</h2>
      <ul>
        {comidas.map((comida) => (
          <li key={comida.id} style={{ marginBottom: '6px' }}>
            <strong>{comida.nombre}</strong>{' '}
            <span style={{ fontSize: '0.9em', color: '#666' }}>({comida.tipo})</span>
            <button
              onClick={() => handleEliminarComida(comida.id)}
              style={{
                marginLeft: '10px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              🗑️ Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Modal para nueva comida */}
      {mostrarPopup && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'black',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h2>Nueva comida</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevaComida.nombre}
              onChange={(e) => setNuevaComida({ ...nuevaComida, nombre: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <input
              type="text"
              placeholder="Descripción (ej. vegana, tradicional)"
              value={nuevaComida.tipo}
              onChange={(e) => setNuevaComida({ ...nuevaComida, tipo: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <button onClick={handleNuevaComida}>Guardar</button>
            <button onClick={() => setMostrarPopup(false)} style={{ marginLeft: '10px' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
