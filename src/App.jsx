import React, { useState, useEffect } from 'react';
import api from './api';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

//Siempre vamos a necesitar de useEffect para poder consumir un ApiRest
useEffect(() => {
  const fetchTodos = async () => { 
      try {
        const response = await api.get('getall');
        setTodos(response.data.data);
      } catch (error) {
        console.log('Error en obtener los');
      }
   }
   fetchTodos();
}, []);

  //Metodo para añadir un Todo
  const addTodo = async () => { 
    if (newTodo.trim() === '')return;

    try {
      await api.post('/add',{text:newTodo});
      setNewTodo('');

      const response = await api.get('/getall');
      setTodos(response.data.data);    
    } catch (error) {
      console.error('Error al añadir todo:', error);
    }
   };


   //Metodo para marcar completado un Todo
   const completeTodo = async (id, status) =>{
    try {
      await api.get(`/complete/${id}/${status}`);
      const response = await api.get('/getall');
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error completing todo:', error);
    }
   };


   //Método para eliminar un Todo
   const deleteTodo = async (id) => {
    try {
      await api.get(`/delete/${id}`);
      // Actualizar la lista de todos
      const response = await api.get('/getall');
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };


  return (
    <div>
      <h1 className='text-4xl font-semibold'>Agrega algo a tu TodoList</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
        className='m-4 border-2 rounded-md'
      />
      <button onClick={addTodo} className='ml-4 border-2'>Add Todo</button>
      <ul className='flex flex-col gap-4'>
        {todos.map(todo => (
          <li key={todo._id} className='w-1/4 text-xl border-2 rounded-md'>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} >
              {todo.text}
            </span>
            <button onClick={() => completeTodo(todo._id, !todo.completed)} className='p-2 m-2 text-xl text-white bg-green-600 rounded-md'>
              {todo.completed ? 'Uncomplete' : 'Complete'}
            </button>
            <button onClick={() => deleteTodo(todo._id)} className='p-2 m-2 text-xl text-white bg-red-700 rounded-md'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
