// deleteItem.js
import { supabase } from '../supabaseClient'

async function deleteItem(id, type) {
  let table = '';

  if (type === 'comida') {
    table = 'comidas';
  } else if (type === 'video') {
    table = 'videos';
  } else if (type === 'mein') {
    table = 'mein';
  }
  else {
    console.error('Tipo no válido');
    return;
  }

  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    console.error('Error al insertar:', error);
  } else {
    console.log(`Elemento con id ${id} eliminado de la tabla ${table}`);
  }
}

export default deleteItem;
