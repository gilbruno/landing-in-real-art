"use client";
// components/ImageBlock.tsx
import { useState } from "react";
import styles from "./Invest.module.scss"; // Import the CSS module
import { IoClose } from "react-icons/io5";

const CheckBoxChecked = () => {
  return (
    <svg
      className={styles["frame-3387__group-36601"]}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="11" fill="#E4EBF5" />
      <path
        d="M7 11L10 14L16 8"
        stroke="#1751F0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Define a type for the component props
interface InvestCardProps {
  number: string;
  title1: string;
  title2: string;
  backgroundImage: string;
  details: string;
  details1?: string[];
  details2?: string[];
  listItems?: string[];
}

const InvestCard: React.FC<InvestCardProps> = ({
  number,
  title1,
  title2,
  backgroundImage,
  details,
  details1,
  details2,
  listItems,
}) => {
  const [showContent, setShowContent] = useState(false);

  return (
    <section
      className={styles.imageBlock}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => setShowContent(!showContent)}
    >
      <h1 className={styles.number}>{number}</h1>
      <h2 className={styles.title1}>{title1}</h2>
      <h3 className={styles.title2}>{title2}</h3>
      <div
        style={{
          display: showContent ? "block" : "none",
        }}
        className={styles.content}
      >
        <IoClose className={styles.close} />
        <div className={styles.details1}>
          {details1?.map(
            (item, index) =>
              item && (
                <div key={index} className={styles.details1Item}>
                  <CheckBoxChecked key={index} />
                  <p>{item}</p>
                </div>
              )
          )}
        </div>
        <div className={styles.details2}>
          {details2?.map(
            (item, index) =>
              item && (
                <div key={index} className={styles.details2Item}>
                  <CheckBoxChecked key={index} />
                  <p>{item}</p>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default InvestCard;
