import './App.css'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase.from('mein').select('*')
    if (error) {
      console.error('Error fetching data:', error)
    } else {
      setTasks(data)
    }
  }

  const toggleDone = async (task) => {
    const { error } = await supabase
      .from('mein')
      .update({ done: !task.done })
      .eq('id', task.id)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))
    }
  }

  const deleteTask = async (taskId) => {
    const { error } = await supabase
      .from('mein')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Error deleting task:', error)
    } else {
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  const addTask = async () => {
    if (!newTaskName.trim()) return

    const { data, error } = await supabase
      .from('mein')
      .insert([{ name: newTaskName, done: false }])
      .select()

    if (error) {
      console.error('Error adding task:', error)
    } else {
      setTasks([...tasks, ...data])
      setNewTaskName('')
      setShowForm(false)
    }
  }

  return (
    <div>
      <h1>Lista de tareas</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : '➕ Nueva tarea'}
      </button>

      {showForm && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Nombre de la tarea"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button onClick={addTask}>Crear</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Estado</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="3">No hay tareas</td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id}>
                <td>
                  <button
                    onClick={() => toggleDone(task)}
                    className="icon-button"
                    title="Marcar como hecho/no hecho"
                  >
                    {task.done ? '✔️' : '❌'}
                  </button>
                </td>
                <td>{task.name}</td>
                <td>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="icon-button"
                    title="Eliminar tarea"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  )
}

export default App
