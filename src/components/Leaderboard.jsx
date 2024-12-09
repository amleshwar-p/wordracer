
import PropTypes from 'prop-types';

const Leaderboard = ({ scores }) => {
    return (
        <div className="my-4 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <ul className="list-disc pl-5">
                {scores.length > 0 ? (
                    scores.map((score, index) => (
                        <li key={index} className="mb-2">
                            <span className="font-bold">{score.name}:</span> {score.score} WPM
                        </li>
                    ))
                ) : (
                    <li>No scores available.</li>
                )}
            </ul>
        </div>
    );
};

Leaderboard.propTypes = {
    scores: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default Leaderboard;