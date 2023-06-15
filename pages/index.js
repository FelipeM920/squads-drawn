import React, { useState, useEffect, useRef } from 'react';
import Checkbox from '../components/checkbox/index'
import Modal from '../components/modal/index'
import styles from '../styles/Home.module.scss'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import GravatarIcon from '../components/gravatarIcon';
import md5 from 'blueimp-md5';

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

async function callDeleteSquad(squadId) {
  let res = await fetch('/api/squads', {
    method: "DELETE",
    body: JSON.stringify({
      squadId: squadId
    })
  });

  let squads = await res.json();
  return squads.data;
}

async function callUpdate(userForUpdate) {
  let res = await fetch('/api/users', {
    method: "PUT",
    body: JSON.stringify({
      id: userForUpdate.userId,
      checkStatus: userForUpdate.checked_for_draw,
      name: userForUpdate.name,
      timesDrawn: userForUpdate.times_drawn,
      gravatarHash: userForUpdate.gravatar_hash,
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
  const [userSelected, setUserSelected] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSquadModal, setShowDeleteSquadModal] = useState(false);
  const [squadForDelete, setSquadForDelete] = useState(0);
  const [showGravatarModal, setShowGravatarModal] = useState(false);
  const inputEmailGravatarRef = useRef(null);
  const deleteModalTexts = {
    modalDeleteTitle: 'Tem certeza que deseja excluir?',
    modalDeleteMainText: `O usuário ${userSelected.name} será excluído permanentemente.`
  }

  const gravatarModalTexts = {
    modalGravatarTitle: 'Atualizar Imagem do Gravatar',
    modalGravatarMainText: `Insira o email do Gravatar para atualizar a imagem do usuário.`,
  }

  const deleteSquadModalTexts = {
    modalDeleteSquadTitle: 'Tem certeza que deseja excluir?',
    modalDeleteSquadMainText: `O Squad ${squadForDelete.name} será excluído permanentemente.`
  }

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

  function handleDelete(userId, userSquadId) {
    callDelete(userId).then(() => {
      callGet(userSquadId).then((response) => {
        setUsers(response);
      })
    });
  }

  function createGravatarModalBody() {
    return (
      <div className={styles.gravatar__modal_body}>
        <a href='https://en.gravatar.com/' target='_blank' rel="noreferrer">Gravatar</a>
        <input type="text" id="gravatarEmail" name="gravatarEmail" placeholder="Email do Gravatar" ref={inputEmailGravatarRef} />
      </div>
    )
  }

  function userDisplay(user) {
    return (
      <div
        key={user.userId}
        className={styles.user}>
        <button className={styles.user__delete_button} onClick={() => { setUserSelected(user); setShowDeleteModal(true); }}>
          <DeleteForeverOutlinedIcon fontSize='small' />
        </button>
        <Checkbox
          user={user}
          setUsers={setUsers}
        ></Checkbox>
        <span className={styles.user__name}>{user.name}</span>
        <div onClick={() => { setUserSelected(user); setShowGravatarModal(true) }}>
          <GravatarIcon
            user={user}
          ></GravatarIcon>
        </div>
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
    const userForDrawn = users.filter(user => user.checked_for_draw);

    if (!userForDrawn || !userForDrawn.length) return;

    const drawnNumber = Math.floor(Math.random() * userForDrawn.length);
    const user = users.find(user => user === userForDrawn[drawnNumber])
    user.checked_for_draw = !user.checked_for_draw;
    user.times_drawn++;
    setDrawn(user.name);
    handleUpdateUser(user);
  }

  function handleSquadChange(event) {
    setSquad(Number(event.target.getAttribute('value')));
    callGet(event.target.getAttribute('value')).then(response => {
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

  function handleDeleteSquad(squadId) {
    callDeleteSquad(squadId).then(response => {
      setSquads(response);
    });
  }

  function closeModalDelete(okForDelete) {
    if (okForDelete)
      handleDelete(userSelected.userId, userSelected.squad);
    setShowDeleteModal(false);
  }

  function closeModalGravatar(okForGravatar) {
    if (okForGravatar) {
      let hashedEmail = md5(inputEmailGravatarRef.current.value);
      userSelected.gravatar_hash = hashedEmail;
      handleUpdateUser(userSelected)
      setShowGravatarModal(false);
    }
    setShowGravatarModal(false);
  }

  function closeModalDeleteSquad(okForDeleteSquad) {
    if (okForDeleteSquad)
      handleDeleteSquad(squadForDelete.id)
    setShowDeleteSquadModal(false);
  }

  function squadDisplaytab(squadTab) {
    const classes = squadTab.id === squad ? `${styles.nav__tabs} ${styles.nav__active}` : `${styles.nav__tabs}`;
    return (
      <>
        <div key={squadTab.id} value={squadTab.id} onClick={handleSquadChange} className={classes}>
          {squadTab.name}
        </div>
        <button className={styles.nav__delete_button} onClick={() => { setSquadForDelete(squadTab); setShowDeleteSquadModal(true) }}><DeleteForeverOutlinedIcon fontSize='small' /></button>
      </>
    )
  }

  return (
    <section className={styles.main}>
      <Modal
        show={showDeleteModal}
        handleClose={closeModalDelete}
        buttonConfirmName={'Sim'}
        buttonCancelName={'Não'}
        title={deleteModalTexts.modalDeleteTitle}
        mainText={deleteModalTexts.modalDeleteMainText}
      >
      </Modal>
      <Modal
        show={showGravatarModal}
        handleClose={closeModalGravatar}
        buttonConfirmName={'Atualizar'}
        buttonCancelName={'Cancelar'}
        title={gravatarModalTexts.modalGravatarTitle}
        mainText={gravatarModalTexts.modalGravatarMainText}
      >
        {createGravatarModalBody()}
      </Modal>
      <Modal
        show={showDeleteSquadModal}
        handleClose={closeModalDeleteSquad}
        buttonConfirmName={'Sim'}
        buttonCancelName={'Não'}
        title={deleteSquadModalTexts.modalDeleteSquadTitle}
        mainText={deleteSquadModalTexts.modalDeleteSquadMainText}
      >
      </Modal>
      <nav id='nav' className={styles.nav__container}>
        {squads.length > 0 && squads.map(squad => squadDisplaytab(squad))}

        <div className={styles.nav__new_tab_container}>
          <input className={styles.nav__new_tab_container_input} type="text" onChange={e => handleSquadInput(e)}></input>
          <button className={styles.nav__new_tab_container_button} onClick={handleAddSquad}>+</button>
        </div>
      </nav>
      <div className={styles.drawn__container}>
        <div className={styles.drawn__users}>
          <div>
            {users.length > 0 && users.map(user => userDisplay(user))}
          </div>
          <div>
            <input type="text" onChange={e => handleInput(e)} />
            <button onClick={() => handleInsert()}>Adicionar</button>
          </div>
        </div>
        <div className={styles.drawn__button_container}>
          <button className={styles.drawn__button} onClick={handleDrawn}>Sortear</button>
        </div>
        <div className={styles.drawn__name}>{drawn}</div>
      </div>
      <div>made with 💖 by <a className={styles.link} href="https://github.com/FelipeM920">Felipe</a></div>
    </section>
  )
}
