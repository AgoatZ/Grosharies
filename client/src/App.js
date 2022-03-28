import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import Posts from './components/Posts/Posts';
import Layout from './components/Layout/Layout';
import TasksList from './components/TaskList';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const getTasks = useCallback(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  });

  useEffect(() => {
    getTasks();
  }, []);

  const clickAddTask = event => {
    event.preventDefault();

    fetch('/api/tasks/add', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle }),
    }).then(() => {
      setNewTaskTitle('');
      getTasks();
    });
  };

  return (
    <Layout>
      <div className='img'>
        <img src={'assets/grosharies.png'} height='300px' width='300px' />
      </div>
      <Posts posts={[1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1,2,3,4,5]} />
      {/* <div className="App">
        
        <h1>My Tasks</h1>
        <TasksList tasks={tasks} updateTasks={getTasks} />

        

        <form onSubmit={clickAddTask}>
          <input
            type="text"
            size="30"
            placeholder="New Task"
            value={newTaskTitle}
            onChange={event => setNewTaskTitle(event.target.value)}
          />
          <input className="btn-primary" type="submit" value="Add" />
        </form>
      </div> */}
    </Layout>
  );
};

export default App;
