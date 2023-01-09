import React, { useState, useEffect } from 'react';
import Checkbox from '../components/checkbox/index'
import styles from '../styles/Home.module.css'

export async function getServerSideProps() {
  let squadRes = await fetch(`${process.env.API_URL}/api/squads`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let allSquads = await squadRes.json();

  let res = await fetch(`${process.env.API_URL}/api/users?idSquad=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allUsers = await res.json();
  return {
    props: { allUsers, allSquads },
  };
}


async function callGet(idSquad) {
  let res = await fetch(`/api/users?idSquad=${idSquad}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allUsers = await res.json();
  return allUsers.data;
}

async function callInset(newUser) {
  let res = await fetch('/api/users', {
    method: "POST",
    body: JSON.stringify(newUser),
  });
  let insertUser = await res.json();
  return insertUser;
}

async function callInsertSquad(newSquad) {
  let res = await fetch('/api/squads', {
    method: "POST",
    body: JSON.stringify(newSquad),
  });
  let allSquads = await res.json();
  return allSquads;
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

export default function Home({ allUsers, allSquads }) {
  const [users, setUsers] = useState([]);
  const [squads, setSquads] = useState([]);
  const [drawn, setDrawn] = useState('?');
  const [squad, setSquad] = useState(1);
  let nameToAdd = 'Nome';
  let squadNameToAdd = 'SquadName';

  useEffect(() => {
    setUsers(allUsers.data);
    setSquads(allSquads.data);
  }, [allUsers, allSquads]);

  function handleInsert() {
    const mockUser = { name: nameToAdd, squad: squad, checked_for_draw: true, times_drawn: 0 }
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

 function squadDisplay(squad){
  return (
    <option key={squad.id} value={squad.id}>{squad.name}</option>
  )
 }

  function handleInput(event) {
    nameToAdd = event.target.value;
  }

  function handleUpdateUser(userForUpdate) {
    callUpdate(userForUpdate);
  }

  function handleDrawn() {
    const userForDrawn = users.filter(user => user.checked_for_draw);
    const drawnNumber = Math.floor(Math.random() * userForDrawn.length);
    const user = users.find(user => user === userForDrawn[drawnNumber])
    user.checked_for_draw = !user.checked_for_draw;
    user.times_drawn++;
    setDrawn(user.name);
    handleUpdateUser(user);
  }

  function handleSquadChange(event) {
    setSquad(Number(event.target.value));
    callGet(event.target.value).then(response => {
      setUsers(response);
    });
  }

  function handleSquadInput(event) {
    squadNameToAdd = event.target.value;
  }

  function handleAddSquad() {
    const mockSquad = { name: squadNameToAdd }
    callInsertSquad(mockSquad).then(response => {
      setSquads(response);
    });
  }

  return (
    <section>
      <div>
        <label>Squad:</label>
        <select onChange={handleSquadChange}>
          {squads.length > 0 && squads.map(squad => squadDisplay(squad))}
        </select>
      </div>
      <div>
        <input type="text" onChange={e => handleSquadInput(e)}></input>
        <button onClick={handleAddSquad}>Adicionar Squad</button>
      </div>
      <div>
        {users.length > 0 && users.map(user => userDisplay(user))}
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
