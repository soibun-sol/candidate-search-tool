import { useState, useEffect } from 'react';
import { searchGithub } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await searchGithub();
        const formattedCandidates: Candidate[] = data.map((item: any) => ({
          id: item.id,
          name: item.login, 
          username: item.login,
          location: item.location || null, 
          avatar: item.avatar_url, 
          email: null, 
          html_url: item.html_url, 
          company: null, 
        }));
        setCandidates(formattedCandidates);
      } catch (err) {
        setError('Failed to fetch candidates.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const saveCandidate = () => {
    const candidateToSave = candidates[currentIndex];
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    savedCandidates.push(candidateToSave);
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    nextCandidate();
  };

  const removeCandidate = () => {
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    const updatedCandidates = savedCandidates.filter(
      (candidate: Candidate) => candidate.id !== candidates[currentIndex].id
    );
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    nextCandidate();
  };

  const nextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('No more candidates available.');
    }
  };

  if (loading) {
    return <h2>Loading candidates...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const currentCandidate = candidates[currentIndex];
  return (
    <div>
      <h1>Candidate Search</h1>
      {currentCandidate ? (
        <div key={currentCandidate.id} className="candidate-card">
          <img
            src={currentCandidate.avatar}
            alt={`${currentCandidate.name}'s avatar`}
            className="candidate-avatar"
          />
          
          <div className="candidate-info">
            <h2>{currentCandidate.name}</h2>
            <p>
              <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">
                View GitHub Profile
              </a>
            </p>
            <p>{currentCandidate.location || "Location not provided"}</p>
            <p>{currentCandidate.email || "Email not provided"}</p>
          </div>
        </div>
      ) : (
        <p>No candidates found.</p>
      )}

      <div className="button-container">
        <button className={`button button-minus`} onClick={removeCandidate}>-</button>
        <button className={`button button-plus`} onClick={saveCandidate}>+</button>
      </div>
    </div>
  );
}

export default CandidateSearch;
