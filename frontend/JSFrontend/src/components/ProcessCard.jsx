// import { Link } from 'react-router';
import Card from '@mui/material/Card';
import { Link } from 'react-router';

/**
 * @component ProcessCard
 * @description A card component that displays information about a process.
 * The card serves as a link to the detailed process page.
 * @param props The properties for the ProcessCard component.
 * @param props.id The ID of the process.
 * @param props.processName The name of the process.
 * @returns {JSX.Element} The rendered ProcessCard component.
 */
export default function ProcessCard(props) {
    return (
        <div>
            <Link to={`/process/${props.id}`}>
                <Card>
                    <h2>{props.processName}</h2>
                    <p>this is a description</p>
                </Card>
            </Link>
        </div>
    );
}
