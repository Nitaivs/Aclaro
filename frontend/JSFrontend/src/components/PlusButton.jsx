import {useState} from "react";
import plusIcon from '../assets/plus-svgrepo-com.svg';

export default function PlusButton({onClick, position = 'right'}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute',
        top: '50%',
        [position]: -12,
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
      }}
      aria-label="Add Task"
    >
        <img
          src={plusIcon}
          alt="Add Task"
          style={{
            width: 24,
            height: 24,
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            [position]: -12,
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            padding: 4,
            filter: hover ? 'brightness(0.9)' : 'none',
            transition: 'filter 0.2s',
          }}
        />
    </button>
  );
}
