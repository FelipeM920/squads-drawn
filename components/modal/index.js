import React from 'react';
import styles from './Modal.module.css'; 

function Modal({ handleClose, show, children, buttonConfirmName, buttonCancelName, title, mainText }) {

  const showHideClassName = show ? (styles.modal + ' ' + styles.display_block) : (styles.modal + ' ' + styles.display_none);
  
  return (
    <div className={showHideClassName}>
      <section className={styles.modal_main}>
        <div className={styles.modal_main__container}>
          <span className={styles.modal_main__title}>{title}</span>
          <span className={styles.modal_main__text}>{mainText}</span>
          <div>
            {children}
          </div>
        </div>
        <div className={styles.modal_main__buttons_container}>
          <button className={styles.modal_main__cancel_button} type="button" onClick={() => handleClose(false)}>
            {buttonCancelName}
          </button>
          <button className={styles.modal_main__confirm_button} type="button" onClick={() => handleClose(true)}>
            {buttonConfirmName}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Modal;

