import React, { useRef, useCallback, useReducer } from 'react';
import './App.css';
import TodoTemplate from './components/TodoTemplate';
import TodoInsert from './components/TodoInsert';
import TodoList from './components/TodoList-1';

function createBulkTodos() {
  const array = [];
  for (let i = 0; i <= 2500; i++) {
    array.push({
      id: i,
      text: `할일 ${i}`,
      checked: false,
    });
  }
  return array;
}

// useReducer는 코드를 많이 고쳐야하는 단점이 있지만, 상태를 업데이트하는 로직을 밖에 둘 수 있는 장점이 있음
function todoReducer(todos, action) {
  switch (action.type) {
    case 'INSERT':
      // { type: 'INSERT', todo: {id: 1, text: 'todo', checked: false}}
      return todos.concat(action.todo);
    case 'REMOVE':
      // { type: 'REMOVE', id: 1}
      return todos.filter((todo) => todo.id !== action.id);
    case 'TOGGLE':
      // {type: 'TOGGLE', id 1}
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, checked: !todo.checked } : todo,
      );
    default:
      return todos;
  }
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);
  // 두번째 원래 초기 상태값을 넣어야 하는데, unefined를 넣고 세번째에 초기 상태 함수를 넣었는데,
  // 이러면 처음 렌더링 될때만 createdBulkTodos 함수 호출
  const nextId = useRef(2501); // 리렌더링될 필요가 없고 단순 참조값이라 useRef이용

  const onInsert = useCallback((text) => {
    const todo = {
      id: nextId.current,
      text,
      checked: false,
    };
    dispatch({ type: 'INSERT', todo });
    nextId.current += 1;
  }, []);

  const onRemove = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const onToggle = useCallback((id) => {
    dispatch({ type: 'TOGGLE', id });
  }, []);

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </TodoTemplate>
  );
}

export default App;
