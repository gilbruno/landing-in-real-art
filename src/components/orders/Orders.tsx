"use client"
import { OrdersProps } from '../../types/types'
import styles from './Orders.module.scss'
import parse from 'html-react-parser'

const Orders = ({mainTitle, ...props}: OrdersProps) => { 

    return (
        <div className={styles.ordersContainer}>
            {parse(mainTitle)}
        </div>
    )
}

export default Orders