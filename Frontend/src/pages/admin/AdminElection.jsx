import React, { useState, useEffect } from 'react';
import { getAllParties } from '../../api/partyApi';
import { createElection } from '../../api/electionApi';
import { getMembersByParty } from '../../api/partyMemberApi';

const CustomButton = ({ children, onClick, title, style }) => (
  <div
    onClick={onClick}
    role="button"
    title={title}
    style={{
      backgroundColor: 'transparent',
      userSelect: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: 6,
      fontWeight: '600',
      transition: 'background-color 0.2s ease',
      ...style,
    }}
  >
    {children}
  </div>
);

export default function AdminElection() {
  const [parties, setParties] = useState([]);
  const [membersByParty, setMembersByParty] = useState({});
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    posts: [
      {
        name: '',
        candidates: [{ party: '', member: '' }],
      },
    ],
  });

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const data = await getAllParties();
        setParties(data);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchParties();
  }, []);

  const handleCandidateChange = async (postIndex, candidateIndex, field, value) => {
    const updatedPosts = [...form.posts];
    updatedPosts[postIndex].candidates[candidateIndex][field] = value;

    if (field === 'party') {
      updatedPosts[postIndex].candidates[candidateIndex].member = '';

      if (value && !membersByParty[value]) {
        try {
          const members = await getMembersByParty(value);
          setMembersByParty((prev) => ({ ...prev, [value]: members }));
        } catch (error) {
          console.error('Failed to fetch members:', error);
        }
      }
    }
    setForm({ ...form, posts: updatedPosts });
  };

  const handlePostChange = (index, field, value) => {
    const updatedPosts = [...form.posts];
    updatedPosts[index][field] = value;
    setForm({ ...form, posts: updatedPosts });
  };

  const removePost = (postIndex) => {
    const updatedPosts = form.posts.filter((_, i) => i !== postIndex);
    setForm({ ...form, posts: updatedPosts });
  };

  const removeCandidate = (postIndex, candidateIndex) => {
    const updatedPosts = [...form.posts];
    updatedPosts[postIndex].candidates = updatedPosts[postIndex].candidates.filter(
      (_, i) => i !== candidateIndex
    );
    setForm({ ...form, posts: updatedPosts });
  };

  const addPost = () => {
    setForm({
      ...form,
      posts: [...form.posts, { name: '', candidates: [{ party: '', member: '' }] }],
    });
  };

  const addCandidate = (postIndex) => {
    const updatedPosts = [...form.posts];
    updatedPosts[postIndex].candidates.push({ party: '', member: '' });
    setForm({ ...form, posts: updatedPosts });
  };

  const submitForm = async () => {
    try {
      await createElection(form);
      alert('Election created successfully');
      setForm({
        title: '',
        startDate: '',
        endDate: '',
        posts: [{ name: '', candidates: [{ party: '', member: '' }] }],
      });
      setMembersByParty({});
    } catch (error) {
      console.error('Create election error:', error);
      alert('Failed to create election. Check console for details.');
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '20px auto',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
        Create Election
      </h2>

      <input
        placeholder="Election Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 16,
          borderRadius: 8,
          border: '1px solid #ccc',
          marginBottom: 20,
          color: '#333',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          style={{
            flex: '1 1 45%',
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ccc',
            color: '#333',
            outline: 'none',
          }}
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          style={{
            flex: '1 1 45%',
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ccc',
            color: '#333',
            outline: 'none',
          }}
        />
      </div>

      {form.posts.map((post, postIndex) => (
        <div
          key={postIndex}
          style={{
            position: 'relative',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          {/* Remove Post Button */}
          <CustomButton
            onClick={() => removePost(postIndex)}
            title="Remove Post"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontSize: 24,
              color: '#d9534f',
              fontWeight: 'bold',
              userSelect: 'none',
            }}
          >
            &times;
          </CustomButton>

          <input
            placeholder="Post Name"
            value={post.name}
            onChange={(e) => handlePostChange(postIndex, 'name', e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #ccc',
              marginBottom: 20,
              color: '#333',
              outline: 'none',
            }}
          />

          {post.candidates.map((candidate, candidateIndex) => (
            <div
              key={candidateIndex}
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              {/* Party Dropdown */}
              <select
                value={candidate.party}
                onChange={(e) =>
                  handleCandidateChange(postIndex, candidateIndex, 'party', e.target.value)
                }
                style={{
                  flex: '1 1 40%',
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  color: '#333',
                }}
              >
                <option value="">Select Party</option>
                {parties.map((party) => (
                  <option key={party._id} value={party._id}>
                    {party.name}
                  </option>
                ))}
              </select>

              {/* Member Dropdown */}
              <select
                value={candidate.member}
                onChange={(e) =>
                  handleCandidateChange(postIndex, candidateIndex, 'member', e.target.value)
                }
                disabled={!candidate.party}
                style={{
                  flex: '1 1 40%',
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 8,
                  border: candidate.party ? '1px solid #ccc' : '1px solid #eee',
                  backgroundColor: candidate.party ? '#fff' : '#eee',
                  color: candidate.party ? '#333' : '#999',
                  cursor: candidate.party ? 'pointer' : 'not-allowed',
                }}
              >
                <option value="">Select Member</option>
                {candidate.party &&
                  membersByParty[candidate.party]
                    ?.filter((member) => {
                      // Prevent duplicate members in other candidates
                      return (
                        !form.posts.some((p, pIdx) =>
                          p.candidates.some((c, cIdx) =>
                            (pIdx !== postIndex || cIdx !== candidateIndex) && c.member === member._id
                          )
                        ) || member._id === candidate.member
                      );
                    })
                    .map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
              </select>

              {/* Remove Candidate Button */}
              <CustomButton
                onClick={() => removeCandidate(postIndex, candidateIndex)}
                title="Remove Candidate"
                style={{
                  fontSize: 24,
                  color: '#d9534f',
                  fontWeight: 'bold',
                  userSelect: 'none',
                  marginLeft: 'auto',
                }}
              >
                &times;
              </CustomButton>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addCandidate(postIndex)}
            style={{
              marginTop: 8,
              padding: '8px 16px',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            + Add Candidate
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={addPost}
          style={{
            flex: '1 1 auto',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Add Post
        </button>

        <button
          type="button"
          onClick={submitForm}
          style={{
            flex: '1 1 auto',
            padding: '10px 20px',
            backgroundColor: '#000',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
