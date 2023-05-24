import React, { useEffect, useState } from 'react';

async function call(user, checkStatus) {
  let res = await fetch(`/api/users`, {
    method: "PUT",
    body: JSON.stringify({
      id: user.userId,
      checkStatus: checkStatus,
      name: user.name,
      timesDrawn: user.times_drawn,
      squad: user.squad,
      gravatarHash: user.gravatar_hash,
    }),
  });
  let users = await res.json();
  return users.data;
}

function Checkbox({ user, setUsers }) {
  const [checkedBox, setCheckedBox] = useState(user.checked_for_draw);

  useEffect(() => {
    setCheckedBox(user.checked_for_draw);
  }, [user.checked_for_draw])

  function handleChange() {
    setCheckedBox(() => {
      call(user, !user.checked_for_draw).then(response => {
        setUsers(response)
      })
      return !user.checked_for_draw;
    });
  }

  return (
    <input type="checkbox" id={user.userId} name={user.name} checked={checkedBox} onChange={handleChange} />
  )
}

export default Checkbox