// deleteItem.js
import { supabase } from '../supabaseClient'

async function deleteItem(id, type) {
  let table = '';

  // Asignamos la tabla en función del tipo
  if (type === 'comida') {
    table = 'comidas';
  } else if (type === 'video') {
    table = 'videos';
  } else if (type === 'mein') {
    table = 'mein';
  } else if (type === 'productos') {
    table = 'productos';
  } else {
    console.error('Tipo no válido');
    return { success: false, message: 'Tipo no válido' }; // Retornamos error si el tipo no es válido
  }

  try {
    // Ejecutamos la eliminación en la base de datos
    const { error } = await supabase.from(table).delete().eq('id', id);

    // Verificamos si hay algún error
    if (error) {
      console.error('Error al eliminar:', error);
      return { success: false, message: error.message }; // Retornamos error si la eliminación falla
    } else {
      console.log(`Elemento con id ${id} eliminado de la tabla ${table}`);
      return { success: true, message: `Elemento con id ${id} eliminado correctamente.` }; // Retornamos éxito
    }
  } catch (err) {
    console.error('Error inesperado al eliminar:', err);
    return { success: false, message: 'Error inesperado al eliminar.' }; // Retornamos error en caso de fallos inesperados
  }
}

export default deleteItem;
