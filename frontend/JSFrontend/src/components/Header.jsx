import '../style/Header.css'
import liveIcon from '../assets/l1ve.svg'

export default function Header() {
  return (
    <header className="app-header">
      <div className={"app-header-container"} >
        <img src={liveIcon} alt="live icon" />
      </div>
    </header>
  );
}
