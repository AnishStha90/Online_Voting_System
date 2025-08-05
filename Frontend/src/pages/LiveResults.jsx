import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAllParties } from '../api/partyApi';
import { getMembersByParty } from '../api/partyMemberApi';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

const LiveResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [parties, setParties] = useState([]);
  const [partyMembers, setPartyMembers] = useState({});
  const [voteCounts, setVoteCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Initial fetch for election + parties + members
  useEffect(() => {
    const fetchInitialData = async () => {
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

        setElection(electionRes.data);
        setParties(partiesRes);
        setPartyMembers(membersData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // Poll vote count every 10 seconds
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const votesRes = await axios.get(`/api/votes/election/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const counts = {};
        for (const post of votesRes.data.results) {
          for (const candidate of post.candidates) {
            counts[candidate.candidateId] = candidate.votes;
          }
        }

        setVoteCounts(counts);
      } catch (error) {
        console.error('Error fetching vote counts:', error);
      }
    };

    fetchVotes(); // initial fetch
    const intervalId = setInterval(fetchVotes, 10000); // every 10s

    return () => clearInterval(intervalId); // cleanup
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!election) return <div>Election not found</div>;

  const now = new Date();
  const electionEndDate = new Date(election.endDate);
  const isElectionOver = now > electionEndDate;

  const uniqueParties = parties.filter((party) =>
    election.posts.some((post) =>
      post.candidates.some((c) => c.party === party._id)
    )
  );

  const postWinners = {};
  election.posts.forEach((post) => {
    const maxVotes = Math.max(
      ...post.candidates.map((c) => voteCounts[c.candidateId || c._id] || 0)
    );

    const winners = post.candidates.filter((c) =>
      (voteCounts[c.candidateId || c._id] || 0) === maxVotes
    );

    if (winners.length > 1) {
      postWinners[post._id] = { type: 'draw', winners };
    } else {
      postWinners[post._id] = { type: 'winner', winners };
    }
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(election.title + " - Live Results", 14, 22);

    const tableColumn = ["Party", ...election.posts.map(post => post.name)];
    const tableRows = uniqueParties.map(party => {
      const row = [party.name];
      election.posts.forEach(post => {
        const candidatesForPost = post.candidates.filter(c => c.party === party._id);
        const enrichedCandidates = candidatesForPost.map(candidate => {
          const member = (partyMembers[party._id] || []).find(
            m => String(m._id) === String(candidate.member)
          );
          return {
            ...candidate,
            name: member?.name || candidate.name || "Unnamed",
          };
        });

        if (enrichedCandidates.length === 0) {
          row.push("-");
          return;
        }

        const postResult = postWinners[post._id];

        const cellText = enrichedCandidates.map(candidate => {
          const candidateId = candidate.candidateId || candidate._id;
          const votes = voteCounts[candidateId] || 0;
          let statusLabel = "";

          if (postResult.type === "draw") {
            if (postResult.winners.some(w => (w.candidateId || w._id) === candidateId)) {
              statusLabel = " (Draw)";
            }
          } else if (postResult.type === "winner") {
            if ((postResult.winners[0].candidateId || postResult.winners[0]._id) === candidateId) {
              statusLabel = isElectionOver ? " (Winner)" : " (Winning)";
            }
          }

          return `${candidate.name} — ${votes} vote${votes !== 1 ? "s" : ""}${statusLabel}`;
        }).join("\n");

        row.push(cellText);
      });

      return row;
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontStyle: 'bold',
      },
      bodyStyles: {
        textColor: 20,
        lineColor: [180, 180, 180],
        lineWidth: 0.25,
      },
      columnStyles: {
        0: { cellWidth: 40 },
      },
      didParseCell: function (data) {
        const cellText = data.cell.text[0] || '';

        if (cellText.includes('(Draw)')) {
          data.cell.styles.fillColor = [255, 235, 59];
        }
        if (cellText.includes('(Winner)') || cellText.includes('(Winning)')) {
          data.cell.styles.fillColor = [76, 175, 80];
          data.cell.styles.textColor = 255;
        }
      },
    });

    doc.save("live-results.pdf");
  };

  const buttonStyleBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
    padding: '0.5rem 1.25rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    lineHeight: 1,
    userSelect: 'none',
    transition: 'background-color 0.3s ease',
  };

  const downloadButtonStyle = {
    ...buttonStyleBase,
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  const backButtonStyle = {
    ...buttonStyleBase,
    backgroundColor: '#6b7280',
    color: 'white',
  };

  const iconStyle = {
    width: '20px',
    height: '20px',
    verticalAlign: 'middle',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ height: "3rem" }}></div>
      <h2>{election.title} - Live Results</h2>
      <div style={{ height: "3rem" }}></div>

      <table style={{ borderCollapse: 'collapse', width: '100%', border: '2px solid black', minWidth: '600px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
              Party
            </th>
            {election.posts.map((post) => (
              <th key={post._id} style={{ border: '1px solid black', padding: '8px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
                {post.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueParties.map((party) => (
            <tr key={party._id}>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                {party.name}
              </td>
              {election.posts.map((post) => {
                const candidatesForPost = post.candidates.filter(c => c.party === party._id);
                const enrichedCandidates = candidatesForPost.map(candidate => {
                  const member = (partyMembers[party._id] || []).find(
                    m => String(m._id) === String(candidate.member)
                  );
                  return {
                    ...candidate,
                    name: member?.name || candidate.name || "Unnamed",
                  };
                });

                if (enrichedCandidates.length === 0) {
                  return <td key={post._id} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>-</td>;
                }

                const postResult = postWinners[post._id];

                return (
                  <td key={post._id} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                    {enrichedCandidates.map(candidate => {
                      const candidateId = candidate.candidateId || candidate._id;
                      const votes = voteCounts[candidateId] || 0;
                      let statusLabel = "";

                      if (postResult.type === "draw") {
                        if (postResult.winners.some(w => (w.candidateId || w._id) === candidateId)) {
                          statusLabel = " (Draw)";
                        }
                      } else if (postResult.type === "winner") {
                        if ((postResult.winners[0].candidateId || postResult.winners[0]._id) === candidateId) {
                          statusLabel = isElectionOver ? " (Winner)" : " (Winning)";
                        }
                      }

                      return (
                        <div key={candidateId} style={{ marginBottom: '4px' }}>
                          {candidate.name} — <strong>{votes} vote{votes !== 1 ? "s" : ""}</strong>{statusLabel}
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

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          onClick={downloadPDF}
          style={downloadButtonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          <ArrowDownTrayIcon style={iconStyle} />
          Download PDF
        </button>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={backButtonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4b5563'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6b7280'}
        >
          <ArrowLeftIcon style={iconStyle} />
          Back
        </button>
      </div>

      <div style={{ height: "3rem" }}></div>
    </div>
  );
};

export default LiveResults;
