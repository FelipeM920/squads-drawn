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

//retornar usuario apost delete, igual ao insert
async function callDelete(userId) {
  await fetch('/api/users', {
    method: "DELETE",
    body: JSON.stringify({
      userId: userId
    })
  })
}

export default function Home({ allUsers }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(allUsers.data);
  }, [allUsers]);

  function handleInsert() {
    const mockUser = { name: 'MockUser', squad: 1, checked_for_draw: true, times_drawn: 0 }
    callInset(mockUser).then((response) => {
      setUsers([...allUsers.data, response])
    });
  }

  function handleDelete(userId) {
    callDelete(userId);
  }

  function userDisplay(user) {
    return (
      <div
        key={user.userId}>
        <button onClick={() => handleDelete(user.userId)}>delete</button>
        <Checkbox
          userId={user.userId}
          name={user.name}
          checked={user.checked_for_draw}
        ></Checkbox>
        <span>{user.name}</span>
      </div>
    )
  }

  return (
    <section>
      <div>
        {users && users.map(user => userDisplay(user))}
      </div>
      <div>
        <button onClick={() => handleInsert()}>Adicionar</button>
      </div>
    </section>
  )
}
