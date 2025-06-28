import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAllParties } from '../api/partyApi';
import { getMembersByParty } from '../api/partyMemberApi';

const LiveResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [parties, setParties] = useState([]);
  const [partyMembers, setPartyMembers] = useState({});
  const [voteCounts, setVoteCounts] = useState({}); // { candidateId: count }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const electionRes = await axios.get(`/api/elections/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const partiesRes = await getAllParties();

        const membersData = {};
        for (const party of partiesRes) {
          const members = await getMembersByParty(party._id);
          membersData[party._id] = members;
        }

        const votesRes = await axios.get(`/api/votes/election/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const counts = {};
        for (const post of votesRes.data.results) {
          for (const candidate of post.candidates) {
            counts[candidate.candidateId] = candidate.votes;
          }
        }

        setElection(electionRes.data);
        setParties(partiesRes);
        setPartyMembers(membersData);
        setVoteCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!election) return <div>Election not found</div>;

  // Filter parties that have candidates in this election
  const uniqueParties = parties.filter((party) =>
    election.posts.some((post) =>
      post.candidates.some((c) => c.party === party._id)
    )
  );

  // Calculate max votes per post
  const maxVotesPerPost = {};
  election.posts.forEach((post) => {
    let maxVotes = 0;
    post.candidates.forEach((candidate) => {
      const candidateId = candidate.candidateId || candidate._id;
      const votes = voteCounts[candidateId] || 0;
      if (votes > maxVotes) {
        maxVotes = votes;
      }
    });
    maxVotesPerPost[post._id] = maxVotes;
  });

  // Determine winners or ties per post
  const postWinners = {};
  election.posts.forEach((post) => {
    const maxVotes = maxVotesPerPost[post._id];
    if (maxVotes === 0) {
      postWinners[post._id] = { type: 'none', winners: [] };
      return;
    }
    // Collect candidates with maxVotes
    const winners = post.candidates.filter((candidate) => {
      const candidateId = candidate.candidateId || candidate._id;
      return (voteCounts[candidateId] || 0) === maxVotes;
    });

    if (winners.length === 1) {
      postWinners[post._id] = { type: 'winner', winners };
    } else {
      postWinners[post._id] = { type: 'tie', winners };
    }
  });

  return (
    <div style={{ overflowX: 'auto' }}>
       {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
      <h2>{election.title} - Live Results</h2>
       {/* Spacer div */}
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
            <th
              style={{
                border: '1px solid black',
                padding: '8px',
                textAlign: 'center',
                backgroundColor: '#f0f0f0',
              }}
            >
              Party
            </th>
            {election.posts.map((post) => (
              <th
                key={post._id}
                style={{
                  border: '1px solid black',
                  padding: '8px',
                  textAlign: 'center',
                  backgroundColor: '#f0f0f0',
                }}
              >
                {post.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueParties.map((party) => (
            <tr key={party._id}>
              <td
                style={{
                  border: '1px solid black',
                  padding: '8px',
                  textAlign: 'center',
                  position: 'relative',
                  width: 120,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {party.name}
              </td>

              {election.posts.map((post) => {
                const candidatesForPost =
                  post.candidates.filter((c) => c.party === party._id) || [];

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
                      style={{
                        border: '1px solid black',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      -
                    </td>
                  );
                }

                const postResult = postWinners[post._id];

                return (
                  <td
                    key={post._id}
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    {enrichedCandidates.map((candidate) => {
                      const candidateId = candidate.candidateId || candidate._id;
                      const votes = voteCounts[candidateId] || 0;

                      // Determine status label (winning / equal / none)
                      let statusLabel = '';
                      if (postResult.type === 'winner') {
                        if (
                          postResult.winners[0].candidateId === candidateId ||
                          postResult.winners[0]._id === candidateId
                        ) {
                          statusLabel = ' (Winning)';
                        }
                      } else if (postResult.type === 'tie') {
                        const isInTie = postResult.winners.some(
                          (w) => (w.candidateId || w._id) === candidateId
                        );
                        if (isInTie) {
                          statusLabel = ' (Equal)';
                        }
                      }

                      return (
                        <div key={candidateId} style={{ marginBottom: '4px' }}>
                          <span>
                            {candidate.name} — <strong>{votes} vote{votes !== 1 ? 's' : ''}</strong>
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
 {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
        ← Back
      </button>
       {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
    </div>
  );
};

export default LiveResults;
