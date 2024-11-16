import { useEffect, useState } from "react";
import { Candidate } from "../interfaces/Candidate.interface";


const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState<string>('');
  
  useEffect(() => {
    const loadSavedCandidates = () => {
      const candidtes = localStorage.getItem('savedCandidates');
      if (candidtes) {
        setSavedCandidates(JSON.parse(candidtes));
      } else {
        setMessage('No saved candidates found.');
      }
    };  

    loadSavedCandidates
  }, []);

  //remove candidates
  const removeCandidate = (candidateId: number) => {
    const updatedCandidates = savedCandidates.filter((candidate) => candidate.id !== candidateId)
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));

    if (updatedCandidates.length === 0) {
      setMessage('No saved candidates found.');
    }
  };
  
  return (
    <div>
      <h1>Potential Candidates</h1>
      {savedCandidates.length > 0 ? (
        savedCandidates.map((candidate) => (
          <div key={candidate.id}>
            <img src={candidate.avatar} alt={candidate.name} className="saved-candidate-avatar" />
            <div>
              <h2>{candidate.name}</h2>
              <p>
                <a href={candidate.html_url} target="_blank" rel="noreferrer">
                  View GitHub Profile
                </a>
              </p>
            </div>
            <div>{candidate.location || "cannot find location"}</div>
            <div>{candidate.email || "cannot find email"}</div>
            <div>{candidate.company || "company info not provided"}</div>
            <div>
              <button onClick={() => removeCandidate(candidate.id)}>Remove Candidate</button>
            </div>
          </div>
        ))
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default SavedCandidates;
