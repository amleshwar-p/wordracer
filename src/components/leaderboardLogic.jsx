import  { useState } from 'react';
import PropTypes from 'prop-types';

const SaveScoreForm = ({ onSave }) => {
    const [name, setName] = useState('');
    const [score, setScore] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && score) {
            onSave({ name, score });
            setName('');
            setScore('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="my-4">
            <label className="block mb-2">
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="ml-2 p-2 border rounded"
                    required
                />
            </label>
            <label className="block mb-2">
                Score:
                <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="ml-2 p-2 border rounded"
                    required
                />
            </label>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Save Score
            </button>
        </form>
    );
};

SaveScoreForm.propTypes = {
    onSave: PropTypes.func.isRequired,
};

export default SaveScoreForm;
