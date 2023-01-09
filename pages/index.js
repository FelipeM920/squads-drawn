import React, { useState, useEffect } from 'react';
import Checkbox from '../components/checkbox/index'
import styles from '../styles/Home.module.css'

export async function getServerSideProps() {
  let res = await fetch(`${process.env.API_URL}/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allUsers = await res.json();
  return {
    props: { allUsers },
  };
}

async function callInset(newUser) {
  let res = await fetch('/api/users', {
    method: "POST",
    body: JSON.stringify(newUser),
  });
  let insertUser = await res.json();
  return insertUser;
}

async function callDelete(userId) {
  let res = await fetch('/api/users', {
    method: "DELETE",
    body: JSON.stringify({
      userId: userId
    })
  });
  let users = await res.json();
  return users.data;
}

async function callUpdate(userForUpdate) {
  let res = await fetch('/api/users', {
    method: "PUT",
    body: JSON.stringify({
      id: userForUpdate.userId,
      checkStatus: userForUpdate.checked_for_draw,
      name: userForUpdate.name,
      timesDrawn: userForUpdate.times_drawn
    })
  });
  let users = await res.json();
  return users.data;
}

export default function Home({ allUsers }) {
  const [users, setUsers] = useState([]);
  const [drawn, setDrawn] = useState('?');
  let nameToAdd = 'Nome';

  useEffect(() => {
    setUsers(allUsers.data);
  }, [allUsers]);

  function handleInsert() {
    const mockUser = { name: nameToAdd, squad: 1, checked_for_draw: true, times_drawn: 0 }
    callInset(mockUser).then((response) => {
      setUsers(response)
    });
  }

  function handleDelete(userId) {
    callDelete(userId).then(response => {
      setUsers(response);
    });
  }

  function userDisplay(user) {
    return (
      <div
        key={user.userId}>
        <button onClick={() => handleDelete(user.userId)}>delete</button>
        <Checkbox
          user={user}
          setUsers={setUsers}
        ></Checkbox>
        <span>{user.name}</span>
      </div>
    )
  }

  function handleInput(event) {
    nameToAdd = event.target.value;
  }

  function handleUpdateUser(userForUpdate) {
    callUpdate(userForUpdate);
  }

  function handleDrawn() {
    console.log('users', users)
    const userForDrawn = users.filter(user => user.checked_for_draw);
    const drawnNumber = Math.floor(Math.random() * userForDrawn.length);
    const user = users.find(user => user === userForDrawn[drawnNumber])
    user.checked_for_draw = !user.checked_for_draw;
    user.times_drawn++;
    setDrawn(user.name);
    handleUpdateUser(user);
  }

  return (
    <section>
      <div>
        {users && users.map(user => userDisplay(user))}
      </div>
      <div>
        <input type="text" onChange={e => handleInput(e)} />
        <button onClick={() => handleInsert()}>Adicionar</button>
      </div>
      <div>
        <button onClick={handleDrawn}>Sortear</button>
      </div>
      <div>{drawn}</div>
    </section>
  )
}
