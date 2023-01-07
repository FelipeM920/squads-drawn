import React, { useState } from 'react';

async function call(userId, checkStatus) {
  await fetch(`/api/users`, {
    method: "PUT",
    body: JSON.stringify({
      id: userId,
      checkStatus: checkStatus
    }),
  });
}

function Checkbox({ userId, name, checked }) {
  const [checkedBox, setCheckedBox] = useState(checked);

  function handleChange() {
    setCheckedBox(() => {
      call(userId, !checkedBox)
      return !checkedBox
    });
  }

  return (
    <input type="checkbox" id={userId} name={name} checked={checkedBox} onChange={handleChange} />
  )
}

export default Checkbox