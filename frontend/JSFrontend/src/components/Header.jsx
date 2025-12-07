import '../style/Header.css'
import liveIcon from '../assets/l1ve.svg'

/**
 * @component Header
 * @description A header component that displays the application header with a logo. Not currently used.
 * @returns {JSX.Element} The Header component.
 */
export default function Header() {
  return (
    <header className="app-header">
      <div className={"app-header-container"} >
        <img src={liveIcon} alt="live icon" />
      </div>
    </header>
  );
}
