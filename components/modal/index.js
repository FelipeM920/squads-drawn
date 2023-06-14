import React from 'react';
import styles from './Modal.module.scss'; 

function Modal({ handleClose, show, children, buttonConfirmName, buttonCancelName, title, mainText }) {

  const showHideClassName = show ? (styles.modal + ' ' + styles.display_block) : (styles.modal + ' ' + styles.display_none);
  
  return (
    <div className={showHideClassName}>
      <section className={styles.modal__main}>
        <div className={styles.modal__main_container}>
          <span className={styles.modal__main_title}>{title}</span>
          <span className={styles.modal__main_text}>{mainText}</span>
          <div>
            {children}
          </div>
        </div>
        <div className={styles.modal__main_buttons_container}>
          <button className={styles.modal__main_cancel_button} type="button" onClick={() => handleClose(false)}>
            {buttonCancelName}
          </button>
          <button className={styles.modal__main_confirm_button} type="button" onClick={() => handleClose(true)}>
            {buttonConfirmName}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Modal;

