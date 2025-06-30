import '../App.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import pushAll from './pushAll'  // Importa la función pushAll
import { SUPERMERCADOS } from './supermercados'  // Importa la constante de supermercados
import deleteItem from './deleteItem'  // Importa la función deleteItem

function ComparadorSupermercados() {
  const [productos, setProductos] = useState([])
  const [productName, setProductName] = useState('')
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    precio: '',
    calificacion: '',
    supermercado: '',
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*')
    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProductos(data)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDelete = async (id) => {
    const { success, message } = await deleteItem(id, 'productos');  // Usamos 'productos' como tipo

    if (success) {
      // Si la eliminación es exitosa, actualizamos el estado
      setProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
    } else {
      // Si hubo un error, mostramos el mensaje de error
      alert(`Error: ${message}`);
    }
  }


  const addProduct = async () => {
    const { nombre, precio, calificacion, supermercado } = newProduct
    if (!nombre || !precio || !calificacion || !supermercado) {
      alert('Todos los campos son obligatorios')
      return
    }

    const data = {
      nombre,
      precio: parseFloat(precio),
      calificacion: parseFloat(calificacion),
      supermercado,
    }

    // Usamos pushAll para agregar el producto
    const insertedProduct = await pushAll(data, 'productos')  // Asegúrate de pasar 'productos'

    if (insertedProduct) {
      setProductos([...productos, insertedProduct])
      setNewProduct({ nombre: '', precio: '', calificacion: '', supermercado: '' })
      setShowForm(false)
    }
  }

  const filteredProducts = productName
    ? productos.filter(producto =>
        producto.nombre.toLowerCase().includes(productName.toLowerCase())
      )
    : productos

  const groupedProducts = filteredProducts.reduce((acc, producto) => {
    if (!acc[producto.nombre]) {
      acc[producto.nombre] = []
    }
    acc[producto.nombre].push(producto)
    return acc
  }, {})

  return (
    <div>
      <h1>Comparador de precios</h1>
      
      <input
        type="text"
        placeholder="Buscar producto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : '➕ Nuevo Producto'}
      </button>

      {showForm && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Nombre del producto"
            name="nombre"
            value={newProduct.nombre}
            onChange={handleInputChange}
          />
          <input
            type="number"
            placeholder="Precio"
            name="precio"
            value={newProduct.precio}
            onChange={handleInputChange}
          />
          <input
            type="number"
            placeholder="Calificación"
            name="calificacion"
            value={newProduct.calificacion}
            onChange={handleInputChange}
          />
          
          {/* Dropdown de supermercados */}
          <select
            name="supermercado"
            value={newProduct.supermercado}
            onChange={handleInputChange}
          >
            <option value="">Selecciona un supermercado</option>
            {SUPERMERCADOS.map((supermercado, index) => (
              <option key={index} value={supermercado}>
                {supermercado}
              </option>
            ))}
          </select>

          <button onClick={addProduct}>Crear Producto</button>
        </div>
      )}

      <div>
        {Object.keys(groupedProducts).length === 0 ? (
          <p>No hay productos que coincidan</p>
        ) : (
          Object.keys(groupedProducts).map((nombreProducto) => (
            <div key={nombreProducto}>
              <h3>{nombreProducto}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Supermercado</th>
                    <th>Precio</th>
                    <th>Calificación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedProducts[nombreProducto].map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.supermercado}</td>
                      <td>{producto.precio} €</td>
                      <td>{producto.calificacion}</td>
                      <td>
                        <button onClick={() => handleDelete(producto.id)}>
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ComparadorSupermercados
