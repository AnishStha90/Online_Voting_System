import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAllParties } from '../api/partyApi';
import { getMembersByParty } from '../api/partyMemberApi';

const Election = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [parties, setParties] = useState([]);
  const [partyMembers, setPartyMembers] = useState({});
  const [selectedVotes, setSelectedVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const electionRes = await axios.get(`/api/elections/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const partiesRes = await getAllParties();

        setElection(electionRes.data);
        setParties(partiesRes);

        const membersData = {};
        for (const party of partiesRes) {
          const members = await getMembersByParty(party._id);
          membersData[party._id] = members;
        }
        setPartyMembers(membersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isElectionOver = () => {
    return new Date(election?.endDate) < new Date();
  };

  const handleVoteChange = (postId, candidateId) => {
    setSelectedVotes((prev) => ({ ...prev, [postId]: candidateId }));
  };

  const handleSubmit = async () => {
    if (!election) {
      setSubmitResult('Election data not loaded.');
      return;
    }

    if (isElectionOver()) {
      setSubmitResult('This election has already ended. Voting is closed.');
      return;
    }

    if (Object.keys(selectedVotes).length !== election.posts.length) {
      setSubmitResult('Please vote for all posts before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const token = localStorage.getItem('token');

      const votesArray = Object.entries(selectedVotes).map(([postId, candidateId]) => ({
        postId,
        candidateId,
      }));

      await axios.post(
        `/api/votes/submit`,
        {
          electionId: id,
          votes: votesArray,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubmitResult('Your vote has been successfully submitted!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      setSubmitResult('You have already voted in this election');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!election) return <div>Election not found</div>;

  const uniqueParties = parties.filter((party) =>
    election.posts.some((post) =>
      post.candidates.some((c) => c.party === party._id)
    )
  );

  // ✅ Return message if election has ended
  if (isElectionOver()) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>{election.title}</h2>
        <p style={{ color: 'red', fontWeight: 'bold' }}>This election has already ended. Voting is closed.</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ height: "3rem" }}></div>
      <h2>{election.title}</h2>
      <div style={{ height: "3rem" }}></div>

      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          border: '2px solid black',
          minWidth: '600px',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
              Symbol
            </th>
            {election.posts.map((post) => (
              <th
                key={post._id}
                style={{ border: '1px solid black', padding: '8px', textAlign: 'center', backgroundColor: '#f0f0f0' }}
              >
                {post.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueParties.map((party) => (
            <tr key={party._id}>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                {party.symbol ? (
                  <img
                    src={`http://localhost:5000${party.symbol?.startsWith('/') ? party.symbol : '/' + party.symbol}`}
                    alt={party.name}
                    style={{ height: 50, width: 50, objectFit: 'contain', display: 'block', margin: '0 auto' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/fallback-symbol.png';
                    }}
                  />
                ) : (
                  <strong>{party.name.substring(0, 3).toUpperCase()}</strong>
                )}
              </td>

              {election.posts.map((post) => {
                const candidatesForPost = post.candidates.filter((c) => c.party === party._id) || [];

                const enrichedCandidates = candidatesForPost.map((candidate) => {
                  const member = (partyMembers[party._id] || []).find(
                    (m) => String(m._id) === String(candidate.member)
                  );
                  return {
                    ...candidate,
                    name: member?.name || candidate.name || 'Unnamed',
                  };
                });

                if (enrichedCandidates.length === 0) {
                  return (
                    <td
                      key={post._id}
                      style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}
                    >
                      -
                    </td>
                  );
                }

                return (
                  <td
                    key={post._id}
                    style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}
                  >
                    {enrichedCandidates.map((candidate) => (
                      <label key={candidate._id} style={{ cursor: 'pointer', display: 'block' }}>
                        <input
                          type="radio"
                          name={`vote-${post._id}`}
                          value={candidate._id}
                          checked={selectedVotes[post._id] === candidate._id}
                          onChange={() => handleVoteChange(post._id, candidate._id)}
                          style={{ marginRight: '6px' }}
                        />
                        {candidate.name && `(${candidate.name})`}
                      </label>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <div style={{ height: "3rem" }}></div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Vote'}
        </button>
        {submitResult && (
          <div style={{ marginTop: 15, color: submitResult.includes('already') ? 'red' : 'green' }}>
            {submitResult}
          </div>
        )}
      </div>

      <div style={{ height: "3rem" }}></div>
      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
        ← Back
      </button>
      <div style={{ height: "3rem" }}></div>
    </div>
  );
};

export default Election;
