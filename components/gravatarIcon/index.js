import React from "react";
import Image from 'next/image'
import styles from './Gravatar.module.css'

function GravatarIcon({ user }) {
  const userAlreadyDrawed = user.checked_for_draw ? '' : styles.image_container_drawed;
  return (
    <div className={`${styles.image_container} ${userAlreadyDrawed}`}>
      <Image
        src={`https://www.gravatar.com/avatar/${user.gravatar_hash}?d=mp`}
        alt='Gravatar Icon'
        width={80}
        height={80}
      />
    </div>
  )
}

export default GravatarIcon;