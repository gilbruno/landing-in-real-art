import React, { useState } from 'react'
import styles from './HamburgerMenu.module.scss'
import classNames from 'classnames'

const HamburgerMenu = () => {

  return (
    <>
      <div id="hamburgerMenu">
        <svg className={classNames(styles.menuStyle, styles.menuInstance)} width="34" height="35" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.75 16.7109H20.25M3.75 7.71094H20.25H3.75ZM3.75 12.2109H20.25H3.75Z" stroke="#F6F8FF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round">
            </path>
        </svg>
      </div>
    </>
  )
}

export default HamburgerMenu